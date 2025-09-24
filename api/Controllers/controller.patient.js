// controllers/controller.patient.js
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pick } = require("../utils/pick");
const { ALLOW_CREATE, ALLOW_UPDATE } = require("../constants/patientFields");

const JWT_SECRET = process.env.JWT_SECRET || "dev_only_secret";

// CREATE (signup)
exports.addPatient = async (req, res) => {
  try {
    const data = pick(req.body, ALLOW_CREATE);

    if (typeof data.email !== "string" || typeof data.password !== "string") {
      return res.status(400).json({ error: "Invalid email/password" });
    }

    // Do NOT hash here (model pre-save hook will hash)
    const newPatient = new Patient(data);
    await newPatient.save();

    return res.json("Patient Added");
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
exports.loginPatient = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    email = email.trim().toLowerCase();

    const patient = await Patient.findOne({ email }).select("+password");
    if (!patient) {
      return res.status(401).json({ rst: "invalid user" });
    }

    const stored = patient.password || "";
    const looksHashed =
      stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

    let ok = false;

    if (looksHashed) {
      // normal path
      ok = await bcrypt.compare(password, stored);
    } else {
      // legacy plaintext password path
      if (password === stored) {
        ok = true;
        try {
          const newHash = await bcrypt.hash(password, 12);
          // atomic update: avoids full model validation (e.g., missing `phone`)
          await Patient.updateOne(
            { _id: patient._id },
            { $set: { password: newHash } }
          );
        } catch (e) {
          console.error("[login] migrate-hash failed:", e);
        }
      }
    }

    if (!ok) {
      return res.status(401).json({ rst: "incorrect password" });
    }

    const token = jwt.sign(
      { sub: patient._id.toString(), email: patient.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _omit, __v, ...safe } = patient.toObject();
    return res.status(200).json({ rst: "success", data: safe, tok: token });
  } catch (error) {
    console.error("[login] Unexpected error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


// VERIFY TOKEN
exports.checkToken = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const patient = await Patient.findOne({ email: decoded.email });
    return res.status(200).send({ rst: "checked", patient });
  } catch (e) {
    console.error(e);
    return res.status(401).send("Unauthorized");
  }
};

// GET BY ID
exports.getPatientById = async (req, res) => {
  const pid = req.params.id;
  try {
    const patient = await Patient.findById(pid);
    return res.status(200).send({ status: "Patient fetched", patient });
  } catch (err) {
    return res.status(500).send({
      status: "Error in getting patient details",
      error: err.message,
    });
  }
};

// UPDATE (mass-assignment safe)
exports.updatePatient = async (req, res) => {
  try {
    const pid = req.params.id;
    const safe = pick(req.body, ALLOW_UPDATE);

    if (Object.keys(safe).length === 0) {
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

// DELETE
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

// LIST ALL
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.json(patients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// CHANGE PASSWORD (separate endpoint)
exports.changePassword = async (req, res) => {
  try {
    const pid = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const patient = await Patient.findById(pid).select("+password");
    if (!patient) return res.status(404).json({ error: "Not found" });

    const ok = await bcrypt.compare(currentPassword, patient.password);
    if (!ok) return res.status(401).json({ error: "Current password incorrect" });

    const hash = await bcrypt.hash(newPassword, 12);
    await Patient.findByIdAndUpdate(pid, { $set: { password: hash } });

    return res.json({ status: "Password changed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};
