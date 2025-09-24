// api/middleware/authorize.js
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Patient can read/modify only *their* appointment.
// Doctor/admin logic: allow if role is 'doctor' or 'admin'.
function canReadAppointment() {
  return async (req, res, next) => {
    const id = req.params.id;
    if (!isValidId(id)) return res.sendStatus(400);
    const appt = await Appointment.findById(id).lean();
    if (!appt) return res.sendStatus(404);

    if (req.user.role === "admin" || req.user.role === "doctor" || String(appt.patient) === String(req.user.id)) {
  req.appt = appt;
  res.set("X-Authz", "canReadAppointment"); // or canModifyAppointment
  return next();
}
res.set("X-Authz", "blocked");
return res.sendStatus(403);
  }
}

function canModifyAppointment() {
  return async (req, res, next) => {
    const id = req.params.id;
    if (!isValidId(id)) return res.sendStatus(400);
    const appt = await Appointment.findById(id);
    if (!appt) return res.sendStatus(404);

    if (req.user.role === "admin" || req.user.role === "doctor" || String(appt.patient) === String(req.user.id)) {
      req.appt = appt;
      return next();
    }
    return res.sendStatus(403);
  };
}

module.exports = { canReadAppointment, canModifyAppointment };
