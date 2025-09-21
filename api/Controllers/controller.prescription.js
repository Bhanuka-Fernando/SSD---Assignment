const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const { sendEmailToPatient } = require("../services/prescriptionMailServices"); // Import the email service

// Controller to add a new prescription
exports.addPrescription = async (req, res) => {
    const { text, apt: appointment, pid: patientId } = req.body;

    const newPrescription = new Prescription({
        text,
        appointment,
        patient: patientId,
    });

    try {
        await newPrescription.save();

        // Fetch patient email from the database
        const patient = await Patient.findById(patientId);
        if (patient && patient.email) {
            await sendEmailToPatient(patient.email); // Use the email service to send an email to the patient
        } else {
            console.warn("Patient email not found");
        }

        res.json("Prescription Added");
    } catch (err) {
        console.error("Error saving prescription: ", err);
        res.status(500).send({ status: "Error in adding prescription", error: err.message });
    }
};

// Controller to get prescriptions by appointment ID
exports.getPrescriptionsByAppointmentId = async (req, res) => {
    let aid = req.params.id;

    try {
        const prescriptions = await Prescription.find({ appointment: aid });
        res.status(200).json({ data: prescriptions });
    } catch (err) {
        console.error("Error fetching prescriptions: ", err.message);
        res.status(500).send({ status: "Error in getting prescription details", error: err.message });
    }
};

// Controller to get prescriptions by patient ID
exports.getPrescriptionsByPatientId = async (req, res) => {
    let pid = req.params.id;

    try {
        const prescriptions = await Prescription.find({ patient: pid });
        res.status(200).json({ data: prescriptions });
    } catch (err) {
        console.error("Error fetching prescriptions: ", err.message);
        res.status(500).send({ status: "Error in getting prescription details", error: err.message });
    }
};

// Controller to search prescriptions by patient ID and query
exports.searchPrescriptionsByPatientId = async (req, res) => {
    let pid = req.params.id;
    const query = req.query.query;

    try {
        const results = await Prescription.find({
            patient: pid,
            $or: [{ text: { $regex: query, $options: "i" } }],
        });
        res.json(results);
    } catch (error) {
        console.error("Error searching prescriptions: ", error);
        res.status(500).json({ error: "Server error" });
    }
};
