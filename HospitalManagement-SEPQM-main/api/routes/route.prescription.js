// api/routes/route.prescription.js
const express = require("express");
const router = express.Router();
const {
    addPrescription,
    getPrescriptionsByAppointmentId,
    getPrescriptionsByPatientId,
    searchPrescriptionsByPatientId,
} = require("../Controllers/controller.prescription");

// Route to add a new prescription
router.post("/add", addPrescription);

// Route to get prescriptions by appointment ID
router.get("/appointmentPrescriptions/:id", getPrescriptionsByAppointmentId);

// Route to get prescriptions by patient ID
router.get("/patientPrescriptions/:id", getPrescriptionsByPatientId);

// Route to search prescriptions by patient ID and query
router.get("/patient/search/:id", searchPrescriptionsByPatientId);

module.exports = router;
