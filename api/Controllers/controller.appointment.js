// api/Controllers/controller.appointment.js (merged)
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

/* ----------------------------- Helpers ----------------------------- */
const getAuthPatientId = (req, fallback) => {
  // Prefer authenticated user (v2 behavior). Fallback for v1 routes/tests.
  if (req?.user?.role === "patient" && req?.user?.id) return req.user.id;
  return fallback;
};

const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

/* ---------------- Get appointments by channel ID ------------------- */
exports.getChannelAppointments = async (req, res) => {
  const cid = req.params.id;
  try {
    const list = await Appointment.find({ channel: cid }).lean();
    return res.status(200).json({ data: list });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in getting appointment details", error: err.message });
  }
};

/* ------ Get appointments by patient (auth-first, param fallback) ---- */
exports.getPatientAppointments = async (req, res) => {
  try {
    const fallbackId = req.params.id;
    const patientId = getAuthPatientId(req, fallbackId);
    const list = await Appointment.find({ patient: patientId }).lean();
    return res.status(200).json({ data: list });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in getting appointment details", error: err.message });
  }
};

/* ------------------------ Create appointment ----------------------- */
/* v2: forces patient to logged-in user to prevent spoofing.
   v1: accepts patient from body if no auth context. */
exports.createAppointment = async (req, res) => {
  try {
    const { notes, channel, name, age, gender, contact, patient: bodyPatient } = req.body || {};

    // Extract channel fields whether channel is an object or an id with cached fields
    const cid = channel?._id || channel?.id || channel;
    const doctor = channel?.doctor;
    const startDateTime = channel?.startDateTime ? new Date(channel.startDateTime) : null;
    const maxPatients = channel?.maxPatients;
    const drName = channel?.drName;
    const completed = channel?.completed;
    let patients = toInt(channel?.patients, 0);

    if (!cid || !startDateTime) {
      return res.status(400).send({ status: "Error in creating appointment", error: "Invalid channel payload" });
    }

    // Determine patient id (auth first)
    const patientId = getAuthPatientId(req, bodyPatient);
    if (!patientId) {
      return res.status(400).send({ status: "Error in creating appointment", error: "Patient not provided" });
    }

    patients += 1;
    const appointmentNo = patients;

    const arrivalTime = new Date(startDateTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 15 * (appointmentNo - 1));

    const newAppointment = new Appointment({
      channel: cid,          // store only the id
      patient: patientId,    // enforce auth when present
      appointmentNo,
      notes,
      arrivalTime,
      name,
      age,
      gender,
      contact,
    });

    // Update the channel patient count and keep other fields (compatible with v1)
    const updateChannel = {
      ...(doctor !== undefined ? { doctor } : {}),
      ...(drName !== undefined ? { drName } : {}),
      ...(startDateTime ? { startDateTime } : {}),
      ...(maxPatients !== undefined ? { maxPatients } : {}),
      patients,
      ...(completed !== undefined ? { completed } : {}),
    };

    await newAppointment.save();
    await Channel.findByIdAndUpdate(cid, updateChannel);

    // Email the patient (either authed user or provided body id)
    const pt = await Patient.findById(patientId).lean();
    if (pt?.email) {
      transporter.sendMail(
        {
          from: "helasuwa@zohomail.com",
          to: pt.email,
          subject: "Appointment Made",
          text: `Hello 
Your Appointment has been made for Dr.${drName}. Appointment No : ${appointmentNo}
Date Time: ${new Date(startDateTime).toString()}
Be there at approximately ${arrivalTime.toLocaleString()} to avoid waiting.`,
        },
        (error, info) => {
          if (error) console.log(error);
          else console.log("Email sent: " + info.response);
        }
      );
    }

    return res.json("New appointment Added");
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in creating appointment", error: err.message });
  }
};

/* ------------------------- Delete appointment ------------------------- */
/* v2: expects req.appt injected by auth middleware; v1: fetch by :id. */
exports.deleteAppointment = async (req, res) => {
  try {
    let appt = req.appt;
    if (!appt) {
      const aid = req.params.id;
      appt = await Appointment.findById(aid);
      if (!appt) return res.status(404).send({ status: "Appointment not found" });
    }

    const cid = appt.channel;

    const channel = await Channel.findById(cid).lean();
    const newCount = Math.max(0, toInt(channel?.patients, 1) - 1);

    await appt.deleteOne();
    await Channel.findByIdAndUpdate(cid, { patients: newCount });

    return res.status(200).send({ status: "Appointment Deleted" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in deleting appointment", error: err.message });
  }
};

/* ------------------------- Get appointment by ID ---------------------- */
/* v2: uses req.appt; v1: loads by :id. */
exports.getAppointmentById = async (req, res) => {
  try {
    let apt = req.appt;
    if (!apt) {
      const aid = req.params.id;
      apt = await Appointment.findById(aid);
      if (!apt) return res.status(404).send({ status: "Appointment not found" });
    }
    return res.status(200).send({ status: "Appointment fetched", apt });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in getting appointment details", error: err.message });
  }
};

/* --------------------------- Update appointment ----------------------- */
/* v2: req.appt + whitelist; v1: updates notes by id. */
exports.updateAppointment = async (req, res) => {
  try {
    const { notes } = req.body || {};
    if (typeof notes !== "string") {
      // Keep v1 response style, but guard input
      return res.status(200).send({ status: "Appointment updated" });
    }

    if (req.appt) {
      req.appt.notes = notes;
      await req.appt.save();
    } else {
      const aid = req.params.id;
      await Appointment.findByIdAndUpdate(aid, { notes });
    }

    return res.status(200).send({ status: "Appointment updated" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in updating appointment", error: err.message });
  }
};

/* -------------------------- Mark as consulted ------------------------- */
/* v2: req.appt path; v1: update by id. */
exports.markConsulted = async (req, res) => {
  try {
    if (req.appt) {
      req.appt.consulted = true;
      await req.appt.save();
    } else {
      const aid = req.params.id;
      await Appointment.findByIdAndUpdate(aid, { consulted: true });
    }
    return res.status(200).send({ status: "Appointment marked as consulted" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ status: "Error in marking appointment", error: err.message });
  }
};
