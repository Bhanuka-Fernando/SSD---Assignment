// api/Controllers/controller.appointment.js
const Appointment = require("../models/Appointment");
const Channel = require("../models/Channel");
const Patient = require("../models/Patient");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "helasuwa@zohomail.com",
    pass: process.env.EmailPass,
  },
});

// Get appointments by channel ID
exports.getChannelAppointments = async (req, res) => {
  const cid = req.params.id;
  try {
    const list = await Appointment.find({ channel: cid }).lean();
    // you may project/limit fields for privacy
    return res.status(200).json({ data: list });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in getting appointment details", error: err.message });
  }
};

// Get appointments for the *logged-in* patient (ignore user-supplied id)
exports.getPatientAppointments = async (req, res) => {
  const patientId = req.user.role === "patient" ? req.user.id : (req.params.id || req.user.id);
  try {
    const list = await Appointment.find({ patient: patientId }).lean();
    return res.status(200).json({ data: list });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in getting appointment details", error: err.message });
  }
};

// Create a new appointment — force patient to the logged-in user (prevents spoofing)
exports.createAppointment = async (req, res) => {
  try {
    const { notes, channel, name, age, gender, contact } = req.body;

    const cid = channel._id;
    const doctor = channel.doctor;
    const startDateTime = channel.startDateTime;
    const maxPatients = channel.maxPatients;
    const drName = channel.drName;
    const completed = channel.completed;
    let patients = parseInt(channel.patients, 10) || 0;

    patients += 1;
    const appointmentNo = patients;

    let arrivalTime = new Date(startDateTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 15 * (appointmentNo - 1));

    const newAppointment = new Appointment({
      channel: cid,                     // store only the id
      patient: req.user.id,             // <— enforce ownership
      appointmentNo,
      notes,
      arrivalTime,
      name,
      age,
      gender,
      contact,
    });

    await newAppointment.save();
    await Channel.findByIdAndUpdate(cid, { doctor, drName, startDateTime, maxPatients, patients, completed });

    const pt = await Patient.findById(req.user.id).lean();
    if (pt?.email) {
      transporter.sendMail({
        from: "helasuwa@zohomail.com",
        to: pt.email,
        subject: "Appointment Made",
        text: `Hello,
Your Appointment has been made for Dr.${drName}. Appointment No: ${appointmentNo}
Date Time: ${new Date(startDateTime).toString()}
Be there around ${arrivalTime.toLocaleString()} to avoid waiting.`,
      }, (error) => error && console.log(error));
    }

    return res.json("New appointment Added");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in creating appointment", error: err.message });
  }
};

// Delete appointment by ID (only owner/doctor/admin)
exports.deleteAppointment = async (req, res) => {
  try {
    const appt = req.appt; // set by canModifyAppointment
    const cid = appt.channel;

    const channel = await Channel.findById(cid).lean();
    const patients = Math.max(0, (parseInt(channel.patients, 10) || 1) - 1);

    await appt.deleteOne();
    await Channel.findByIdAndUpdate(cid, { patients });

    return res.status(200).send({ status: "Appointment Deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in deleting appointment", error: err.message });
  }
};

// Fetch appointment by ID (owner/doctor/admin only)
exports.getAppointmentById = async (req, res) => {
  try {
    const apt = req.appt; // set by canReadAppointment()
    return res.status(200).send({ status: "Appointment fetched", apt });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in getting appointment details", error: err.message });
  }
};

// Update appointment notes (owner/doctor/admin; whitelist fields)
exports.updateAppointment = async (req, res) => {
  try {
    const appt = req.appt; // set by canModifyAppointment()
    const { notes } = req.body || {};
    if (typeof notes === "string") {
      appt.notes = notes;
      await appt.save();
    }
    return res.status(200).send({ status: "Appointment updated" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in updating appointment", error: err.message });
  }
};

// Mark appointment as consulted (doctor/admin)
exports.markConsulted = async (req, res) => {
  try {
    const appt = req.appt; // set by canModifyAppointment
    appt.consulted = true;
    await appt.save();
    return res.status(200).send({ status: "Appointment marked as consulted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "Error in marking appointment", error: err.message });
  }
};