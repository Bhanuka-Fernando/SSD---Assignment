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

// Route to get appointments by channel
router.get("/channelAppointments/:id", getChannelAppointments);

// Route to get appointments by patient
router.get("/patientAppointments/:id", getPatientAppointments);

// Route to create a new appointment
router.post("/makeapt", createAppointment);

// Route to delete an appointment by ID
router.delete("/delete/:id", deleteAppointment);

// Route to fetch a specific appointment by ID
router.get("/get/:id", getAppointmentById);

// Route to update an appointment's notes
router.put("/update/:id", updateAppointment);

// Route to mark an appointment as consulted
router.put("/markConsulted/:id", markConsulted);

module.exports = router;
