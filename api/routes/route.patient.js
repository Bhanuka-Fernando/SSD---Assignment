// routes/route.patient.js
const router = require("express").Router();
const ctrl = require("../controllers/controller.patient");

// create
router.post("/add", ctrl.addPatient);

// login
router.post("/login", ctrl.loginPatient);

// verify token
router.get("/check", ctrl.checkToken);

// view
router.get("/get/:id", ctrl.getPatientById);

// update (mass-assignment safe)
router.put("/update/:id", ctrl.updatePatient);

// change password (separate)
router.put("/change-password/:id", ctrl.changePassword);

// delete
router.delete("/delete/:id", ctrl.deletePatient);

// list
router.get("/", ctrl.getAllPatients);

module.exports = router;
