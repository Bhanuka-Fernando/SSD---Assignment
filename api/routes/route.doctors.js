// routes/doctorRoutes.js

const express = require("express");
const router = express.Router();
const doctorController = require("../Controllers/controller.doctor");

router.post("/add", doctorController.addDoctor);
router.post("/login", doctorController.loginDoctor);
router.get("/check", doctorController.checkDoctor);
router.get("/", doctorController.getAllDoctors);
router.get("/get/:id", doctorController.getDoctorById);
router.put("/update/:id", doctorController.updateDoctor);

module.exports = router;
