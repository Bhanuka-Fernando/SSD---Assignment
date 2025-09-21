const Patient = require("../models/Patient");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = "hey";

// Controller to add a new patient
exports.addPatient = (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    dob,
    civilStatus,
    phone,
    emergencyPhone,
    gaurdianNIC,
    gaurdianName,
    gaurdianPhone,
    height,
    weight,
    bloodGroup,
    allergies,
    medicalStatus,
    insuranceNo,
    insuranceCompany,
  } = req.body;

  const newPatient = new Patient({
    email,
    firstName,
    lastName,
    dob,
    gender,
    password,
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
  });

  newPatient
    .save()
    .then(() => res.json("Patient Added"))
    .catch((err) => console.log(err));
};

// Controller for login
exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email });

  try {
    if (patient) {
      const result = password === patient.password;

      if (result) {
        const token = jwt.sign({ email: patient.email }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).send({ rst: "success", data: patient, tok: token });
      } else {
        res.status(200).send({ rst: "incorrect password" });
      }
    } else {
      res.status(200).send({ rst: "invalid user" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Controller to verify JWT token
exports.checkToken = async (req, res) => {
  const token = req.headers.authorization;
  let email = null;

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log(error);
      return res.status(401).send("Unauthorized");
    }
    email = decoded.email;
  });

  const patient = await Patient.findOne({ email });
  res.status(200).send({ rst: "checked", patient });
};

// Controller to get patient by ID
exports.getPatientById = async (req, res) => {
  const pid = req.params.id;

  try {
    const patient = await Patient.findById(pid);
    res.status(200).send({ status: "Patient fetched", patient });
  } catch (err) {
    res.status(500).send({
      status: "Error in getting patient details",
      error: err.message,
    });
  }
};

// Controller to update a patient by ID
exports.updatePatient = async (req, res) => {
  const pid = req.params.id;
  const updatePatient = req.body;

  try {
    await Patient.findByIdAndUpdate(pid, updatePatient);
    res.status(200).send({ status: "Patient updated" });
  } catch (err) {
    res.status(500).send({
      status: "Error with updating information",
      error: err.message,
    });
  }
};

// Controller to delete a patient by ID
exports.deletePatient = async (req, res) => {
  const pid = req.params.id;

  try {
    await Patient.findByIdAndDelete(pid);
    res.status(200).send({ status: "Patient deleted" });
  } catch (err) {
    res.status(202).send({
      status: "Error with deleting the Patient",
      error: err.message,
    });
  }
};

// Controller to get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.log(err);
  }
};
