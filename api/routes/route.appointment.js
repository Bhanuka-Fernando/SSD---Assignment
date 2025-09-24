// api/Routes/route.appointment.js
const router = require("express").Router();
const {
  getChannelAppointments,
  getPatientAppointments,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  updateAppointment,
  markConsulted,
} = require("../Controllers/controller.appointment");

const { requireAuth } = require("../middleware/auth");
const { canReadAppointment, canModifyAppointment } = require("../middleware/authorize");

// Channel appointments – typically doctor/admin; if you have roles add a role guard here too
router.get("/channelAppointments/:id", requireAuth, getChannelAppointments);

// Patient appointments – for logged-in patient (controller ignores supplied id for patients)
router.get("/patientAppointments/:id?", requireAuth, getPatientAppointments);

// Create – must be logged in
router.post("/makeapt", requireAuth, createAppointment);

// Protected object routes (ownership enforced in middleware)
router.get("/get/:id", requireAuth, canReadAppointment(), getAppointmentById);
router.put("/update/:id", requireAuth, canModifyAppointment(), updateAppointment);
router.put("/markConsulted/:id", requireAuth, canModifyAppointment(), markConsulted);
router.delete("/delete/:id", requireAuth, canModifyAppointment(), deleteAppointment);

module.exports = router;
