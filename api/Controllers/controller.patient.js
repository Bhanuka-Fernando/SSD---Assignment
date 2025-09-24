// api/Controllers/controller.patient.js
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

/* ---------------- Create patient (hash password) ---------------- */
exports.addPatient = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName, gender, dob, civilStatus,
      phone, emergencyPhone, gaurdianNIC, gaurdianName, gaurdianPhone,
      height, weight, bloodGroup, allergies, medicalStatus,
      insuranceNo, insuranceCompany,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 12);

    const newPatient = new Patient({
      email,
      firstName,
      lastName,
      dob,
      gender,
      civilStatus,
      phoneNo: phone,
      emergencyPhone,
      gaurdianName,
      gaurdianNIC,
      gaurdianPhone,
      height,
      weight,
      bloodGroup,
      allergies,
      medicalStatus,
      insuranceCompany,
      insuranceNo,
      passwordHash, // store only the hash
    });

    await newPatient.save();
    return res.json("Patient Added");
  } catch (err) {
    // handle duplicate emails nicely if you set unique: true on email
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).send({ error: "Email already exists" });
    }
    console.log(err);
    return res.status(500).send({ error: "Failed to add patient" });
  }
};

/* ---------------------- Login (verify hash) --------------------- */
exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    // include hidden hash
    const patient = await Patient.findOne({ email }).select("+passwordHash +password");

    if (!patient) return res.status(401).send({ rst: "invalid user" });

    // Prefer hash; support legacy plaintext if it exists
    let ok = false;
    if (patient.passwordHash) {
      ok = await bcrypt.compare(password, patient.passwordHash);
    } else if (patient.password) {
      ok = password === patient.password; // legacy fallback; remove after migration
    }

    if (!ok) return res.status(401).send({ rst: "incorrect password" });

    const token = jwt.sign(
      { sub: String(patient._id), role: "patient" },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const safe = patient.toObject();
    delete safe.passwordHash;
    delete safe.password;

    return res.status(200).send({ rst: "success", data: safe, tok: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Login failed" });
  }
};

/* -------- Verify JWT (expects Authorization: Bearer <token>) ----- */
exports.checkToken = async (req, res) => {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).send("Unauthorized");

  try {
    const payload = jwt.verify(m[1], JWT_SECRET, { algorithms: ["HS256"] });
    const patient = await Patient.findById(payload.sub).lean();
    if (!patient) return res.status(404).send("Not found");

    delete patient.password;
    delete patient.passwordHash;

    return res.status(200).send({ rst: "checked", patient });
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

/* ------------------------- CRUD helpers ------------------------- */
exports.getPatientById = async (req, res) => {
  const pid = req.params.id;
  try {
    const patient = await Patient.findById(pid);
    return res.status(200).send({ status: "Patient fetched", patient });
  } catch (err) {
    return res.status(500).send({ status: "Error in getting patient details", error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  const pid = req.params.id;
  const updatePatient = { ...req.body };
  // never accept raw password fields here
  delete updatePatient.password;
  delete updatePatient.passwordHash;

  try {
    await Patient.findByIdAndUpdate(pid, updatePatient);
    return res.status(200).send({ status: "Patient updated" });
  } catch (err) {
    return res.status(500).send({ status: "Error with updating information", error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  const pid = req.params.id;
  try {
    await Patient.findByIdAndDelete(pid);
    return res.status(200).send({ status: "Patient deleted" });
  } catch (err) {
    return res.status(202).send({ status: "Error with deleting the Patient", error: err.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password -passwordHash");
    return res.json(patients);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to fetch patients" });
  }
};
