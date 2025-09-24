// controllers/controller.patient.js  (merged)
// Supports both "password" (model pre-save hashing) and "passwordHash" (manual hashing) styles.

const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
// Use bcryptjs to avoid native build issues; API compatible with bcrypt.
const bcrypt = require("bcrypt");

// If your env lacks JWT_SECRET, fall back to a dev-only secret (keeps previous behavior)
const JWT_SECRET = process.env.JWT_SECRET || "dev_only_secret";

// If these exist in your project (from version A), we'll use them for safe field selection.
let pick, ALLOW_CREATE, ALLOW_UPDATE;
try {
  ({ pick } = require("../utils/pick"));
  ({ ALLOW_CREATE, ALLOW_UPDATE } = require("../constants/patientFields"));
} catch (_) {
  // Fallbacks if not present; still keep behavior close to version B.
  pick = (obj, keys) =>
    keys && Array.isArray(keys)
      ? Object.fromEntries(Object.entries(obj || {}).filter(([k]) => keys.includes(k)))
      : { ...(obj || {}) };
  ALLOW_CREATE = null; // "null" => allow all like version B did
  ALLOW_UPDATE = null;
}

/* ---------------- Create patient (supports both styles) ----------------
   - Version A: model pre-save hook hashes "password". We can pass raw password.
   - Version B: controller hashed to "passwordHash". We compute it too.
   Result: we set both "password" and "passwordHash" to preserve either model shape.
------------------------------------------------------------------------- */
exports.addPatient = async (req, res) => {
  try {
    const data = ALLOW_CREATE ? pick(req.body, ALLOW_CREATE) : { ...(req.body || {}) };

    // Basic email/password guard (from version A)
    if (typeof data.email !== "string" || typeof data.password !== "string") {
      return res.status(400).json({ error: "Invalid email/password" });
    }

    // Compute hash for passwordHash path (version B)
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Build patient payload compatible with both models:
    // - keep "password" for pre-save hook models
    // - include "passwordHash" for hash-in-controller models
    const newPatient = new Patient({
      ...data,
      password: data.password,
      passwordHash, // harmless if schema ignores it; required if schema expects it
    });

    await newPatient.save();
    return res.json("Patient Added");
  } catch (err) {
    // Nice duplicate email handling (version B)
    if (err && err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).send({ error: "Email already exists" });
    }
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    return res.status(500).send({ error: "Failed to add patient" });
  }
};

/* ---------------------- Login (verify hash + migrate) -------------------
   - Supports both fields: passwordHash (primary) and password (hashed or legacy).
   - If legacy plaintext detected, we migrate to bcrypt hash (both password & passwordHash).
--------------------------------------------------------------------------- */
exports.loginPatient = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    email = email.trim().toLowerCase();

    // Include hidden fields from either schema
    const patient = await Patient.findOne({ email }).select("+password +passwordHash");
    if (!patient) {
      return res.status(401).json({ rst: "invalid user" });
    }

    const storedPass = patient.password || "";       // may be hash or legacy plaintext
    const storedHash = patient.passwordHash || "";   // hash (bcrypt) in version B

    // Detect bcrypt prefix
    const isBcrypt = (s) => /^\$2[aby]\$/.test(s);

    let ok = false;

    // 1) Prefer passwordHash when present
    if (storedHash) {
      ok = await bcrypt.compare(password, storedHash);
    }

    // 2) Otherwise fall back to password (hashed or legacy plaintext)
    if (!ok && storedPass) {
      if (isBcrypt(storedPass)) {
        ok = await bcrypt.compare(password, storedPass);
      } else {
        // Legacy plaintext fallback
        ok = password === storedPass;
        if (ok) {
          // Migrate to bcrypt (update BOTH fields to satisfy either schema)
          try {
            const newHash = await bcrypt.hash(password, 12);
            await Patient.updateOne(
              { _id: patient._id },
              { $set: { password: newHash, passwordHash: newHash } }
            );
          } catch (e) {
            console.error("[login] migrate-hash failed:", e);
          }
        }
      }
    }

    if (!ok) {
      return res.status(401).json({ rst: "incorrect password" });
    }

    const token = jwt.sign(
      { sub: patient._id.toString(), email: patient.email, role: "patient" },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const safe = patient.toObject();
    delete safe.password;
    delete safe.passwordHash;
    delete safe.__v;

    return res.status(200).json({ rst: "success", data: safe, tok: token });
  } catch (error) {
    console.error("[login] Unexpected error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/* -------- Verify JWT (accepts "Bearer <token>" or raw token) ---------
   - Version A allowed raw token header.
   - Version B required "Bearer".
   - This accepts both and returns patient without password fields.
------------------------------------------------------------------------ */
exports.checkToken = async (req, res) => {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/);
  const token = m ? m[1] : h; // support both styles

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256", "HS384", "HS512"] });
    // Prefer sub id; fall back to email if present
    let patient = null;
    if (decoded?.sub) {
      patient = await Patient.findById(decoded.sub).lean();
    }
    if (!patient && decoded?.email) {
      patient = await Patient.findOne({ email: decoded.email }).lean();
    }
    if (!patient) return res.status(404).send("Not found");

    delete patient.password;
    delete patient.passwordHash;

    return res.status(200).send({ rst: "checked", patient });
  } catch (e) {
    console.error("[checkToken] verify failed:", e);
    return res.status(401).send("Unauthorized");
  }
};

/* ----------------------------- CRUD ------------------------------ */
exports.getPatientById = async (req, res) => {
  const pid = req.params.id;
  try {
    const patient = await Patient.findById(pid).select("-password -passwordHash");
    return res.status(200).send({ status: "Patient fetched", patient });
  } catch (err) {
    return res.status(500).send({
      status: "Error in getting patient details",
      error: err.message,
    });
  }
};

/* -------------- UPDATE (mass-assignment safe if available) --------------
   - Uses pick + ALLOW_UPDATE when provided (version A).
   - Always strips password/passwordHash here (no credential changes via this route).
------------------------------------------------------------------------- */
exports.updatePatient = async (req, res) => {
  try {
    const pid = req.params.id;
    const body = req.body || {};
    let safe = ALLOW_UPDATE ? pick(body, ALLOW_UPDATE) : { ...body };

    delete safe.password;
    delete safe.passwordHash;

    if (ALLOW_UPDATE && Object.keys(safe).length === 0) {
      return res.status(400).json({ error: "No allowed fields to update" });
    }

    await Patient.findByIdAndUpdate(
      pid,
      { $set: safe },
      { new: true, runValidators: true, omitUndefined: true }
    );

    return res.status(200).json({ status: "Patient updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deletePatient = async (req, res) => {
  const pid = req.params.id;
  try {
    await Patient.findByIdAndDelete(pid);
    return res.status(200).send({ status: "Patient deleted" });
  } catch (err) {
    return res.status(202).send({
      status: "Error with deleting the Patient",
      error: err.message,
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password -passwordHash");
    return res.json(patients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* --------------------- CHANGE PASSWORD (kept) ---------------------
   - Endpoint from version A, preserved.
   - Validates current password using whichever hash exists.
-------------------------------------------------------------------- */
exports.changePassword = async (req, res) => {
  try {
    const pid = req.params.id;
    const { currentPassword, newPassword } = req.body || {};

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const patient = await Patient.findById(pid).select("+password +passwordHash");
    if (!patient) return res.status(404).json({ error: "Not found" });

    const storedPass = patient.password || "";
    const storedHash = patient.passwordHash || "";
    const isBcrypt = (s) => /^\$2[aby]\$/.test(s);

    let ok = false;
    if (storedHash) {
      ok = await bcrypt.compare(currentPassword, storedHash);
    } else if (storedPass) {
      ok = isBcrypt(storedPass)
        ? await bcrypt.compare(currentPassword, storedPass)
        : currentPassword === storedPass;
    }

    if (!ok) return res.status(401).json({ error: "Current password incorrect" });

    const hash = await bcrypt.hash(newPassword, 12);
    // Update BOTH fields so either schema path keeps working
    await Patient.findByIdAndUpdate(pid, { $set: { password: hash, passwordHash: hash } });

    return res.json({ status: "Password changed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};
