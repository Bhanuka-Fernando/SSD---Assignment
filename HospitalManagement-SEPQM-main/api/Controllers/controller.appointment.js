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
  let cid = req.params.id;

  try {
    const appointments = await Appointment.find({ channel: cid });
    res.status(200).json({ data: appointments });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in getting appointment details",
      error: err.message,
    });
  }
};

// Get appointments by patient ID
exports.getPatientAppointments = async (req, res) => {
  let pid = req.params.id;

  try {
    const appointments = await Appointment.find({ patient: pid });
    res.status(200).json({ data: appointments });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in getting appointment details",
      error: err.message,
    });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { patient, notes, channel, name, age, gender, contact } = req.body;

  try {
    const cid = channel._id;
    const doctor = channel.doctor;
    const startDateTime = channel.startDateTime;
    const maxPatients = channel.maxPatients;
    const drName = channel.drName;
    const completed = channel.completed;
    let patients = parseInt(channel.patients);

    patients++;
    const appointmentNo = patients;

    let arrivalTime = new Date(startDateTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 15 * (appointmentNo - 1));

    const newAppointment = new Appointment({
      channel,
      patient,
      appointmentNo,
      notes,
      arrivalTime,
      name,
      age,
      gender,
      contact,
    });

    const updateChannel = {
      doctor,
      drName,
      startDateTime,
      maxPatients,
      patients,
      completed,
    };

    await newAppointment.save();
    await Channel.findByIdAndUpdate(cid, updateChannel);

    const pt = await Patient.findById(patient);

    const mailOptions = {
      from: "helasuwa@zohomail.com",
      to: pt.email,
      subject: "Appointment Made",
      text: `Hello \nYour Appointment has been made for Dr.${drName}. Appointment No :${appointmentNo} 
          Date Time ${new Date(startDateTime).toString()} \nBe there at approximately ${arrivalTime.toLocaleString()} to avoid waiting.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json("New appointment Added");
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in creating appointment",
      error: err.message,
    });
  }
};

// Delete appointment by ID
exports.deleteAppointment = async (req, res) => {
  let aid = req.params.id;
  let cid = "";

  try {
    const apt = await Appointment.findById(aid);
    cid = apt.channel;

    const channel = await Channel.findById(cid);
    const patients = parseInt(channel.patients) - 1;

    const updChannel = { patients };

    await Appointment.findByIdAndDelete(aid);
    await Channel.findByIdAndUpdate(cid, updChannel);

    res.status(200).send({ status: "Appointment Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in deleting appointment",
      error: err.message,
    });
  }
};

// Fetch appointment by ID
exports.getAppointmentById = async (req, res) => {
  let aid = req.params.id;

  try {
    const apt = await Appointment.findById(aid);
    res.status(200).send({ status: "Appointment fetched", apt });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in getting appointment details",
      error: err.message,
    });
  }
};

// Update appointment notes
exports.updateAppointment = async (req, res) => {
  let aid = req.params.id;
  const { notes } = req.body;

  try {
    await Appointment.findByIdAndUpdate(aid, { notes });
    res.status(200).send({ status: "Appointment updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in updating appointment",
      error: err.message,
    });
  }
};

// Mark appointment as consulted
exports.markConsulted = async (req, res) => {
  let aid = req.params.id;
  const consulted = true;

  try {
    await Appointment.findByIdAndUpdate(aid, { consulted });
    res.status(200).send({ status: "Appointment marked as consulted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: "Error in marking appointment",
      error: err.message,
    });
  }
};
