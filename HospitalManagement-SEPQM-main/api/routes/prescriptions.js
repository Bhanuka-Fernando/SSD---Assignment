const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const fs = require('fs');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: "helasuwa@zohomail.com", // Your Zoho email address
        pass: process.env.EmailPass, // Email password stored in environment variable
    },
});

// Function to send email to the patient
const sendEmailToPatient = async (patientEmail) => {
    const mailOptions = {
        from: "helasuwa@zohomail.com", // sender address
        to: patientEmail, // recipient's email address
        subject: "Prescription Sent", // Subject line
        text: "Your prescription has been sent successfully.", // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

// Route to add a new prescription
router.route("/add").post(async (req, res) => {
    const text = req.body.text;
    const appointment = req.body.apt;
    const patientId = req.body.pid;

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
            await sendEmailToPatient(patient.email); // Send email to the patient's email address
        } else {
            console.warn("Patient email not found");
        }

        res.json("Prescription Added");
    } catch (err) {
        console.error("Error saving prescription: ", err);
        res.status(500).send({ status: "Error in adding prescription", error: err.message });
    }
});

// Route to get prescriptions by appointment ID
router.route("/appointmentPrescriptions/:id").get(async (req, res) => {
    let aid = req.params.id;

    try {
        const prescriptions = await Prescription.find({ appointment: aid });
        res.status(200).json({ data: prescriptions });
    } catch (err) {
        console.error("Error fetching prescriptions: ", err.message);
        res.status(500).send({ status: "Error in getting prescription details", error: err.message });
    }
});

// Route to get prescriptions by patient ID
router.route("/patientPrescriptions/:id").get(async (req, res) => {
    let pid = req.params.id;

    try {
        const prescriptions = await Prescription.find({ patient: pid });
        res.status(200).json({ data: prescriptions });
    } catch (err) {
        console.error("Error fetching prescriptions: ", err.message);
        res.status(500).send({ status: "Error in getting prescription details", error: err.message });
    }
});

// Route to search prescriptions by patient ID
router.get("/patient/search/:id", async (req, res) => {
    let pid = req.params.id;
    const query = req.query.query; 

    try {
        const results = await Prescription.find({
            patient: pid,
            $or: [
                { text: { $regex: query, $options: "i" } }
            ],
        });
        res.json(results);
    } catch (error) {
        console.error("Error searching prescriptions: ", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Export the router
module.exports = router;
