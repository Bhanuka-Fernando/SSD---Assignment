const express = require("express");
const router = express.Router();
const {
  addPatient,
  loginPatient,
  checkToken,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllPatients,
} = require("../Controllers/controller.patient");

// Route to add a new patient
router.post("/add", addPatient);

// Route to login a patient
router.post("/login", loginPatient);

// Route to verify token
router.get("/check", checkToken);

// Route to get patient by ID
router.get("/get/:id", getPatientById);

// Route to update a patient by ID
router.put("/update/:id", updatePatient);

// Route to delete a patient by ID
router.delete("/delete/:id", deletePatient);

// Route to get all patients
router.get("/", getAllPatients);

module.exports = router;
