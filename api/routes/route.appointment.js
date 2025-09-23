// api/Routes/route.appointment.js
const router = require("express").Router();
const { Types } = require("mongoose");
const {
  getChannelAppointments,
  getPatientAppointments,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  updateAppointment,
  markConsulted,
} = require("../Controllers/controller.appointment");


const { auth, requireRole } = require("../middleware/auth"); // see note below

// Validate :id is a proper ObjectId
const validateId = (param = "id") => (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ msg: "invalid id" });
  }
  next();
};

// Patients can only read their own appointments
const patientCanOnlyAccessOwn = (req, res, next) => {
  if (req.user?.role === "patient" && req.user?.sub !== req.params.id) {
    return res.status(403).json({ msg: "forbidden" });
  }
  next();
};

// ---- Routes ----

// Get appointments by channel (doctor/admin only)
router.get(
  "/channelAppointments/:id",
  auth,
  requireRole("doctor", "admin"),
  validateId(),
  getChannelAppointments
);

// Get appointments by patient
// - doctor/admin can view any
// - patient can only view their own (id === JWT sub)
router.get("/patientAppointments/:id",auth,patientCanOnlyAccessOwn,validateId(),getPatientAppointments
);

// Create a new appointment (patient/doctor/admin)
router.post("/makeapt", auth, requireRole("patient", "doctor", "admin"), createAppointment);

// Delete appointment by ID (doctor/admin)
router.delete("/delete/:id", auth, requireRole("doctor", "admin"), validateId(), deleteAppointment);

// Fetch specific appointment by ID (doctor/admin)
// (If you want patients to fetch by appointment ID, add ownership checks that the appointment.patient === req.user.sub)
router.get("/get/:id", auth, requireRole("doctor", "admin"), validateId(), getAppointmentById);

// Update appointment notes (doctor/admin)
router.put("/update/:id", auth, requireRole("doctor", "admin"), validateId(), updateAppointment);

// Mark appointment as consulted (doctor/admin)
router.put(
  "/markConsulted/:id",
  auth,
  requireRole("doctor", "admin"),
  validateId(),
  markConsulted
);

module.exports = router;
