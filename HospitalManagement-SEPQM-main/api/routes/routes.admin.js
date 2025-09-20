// adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/controller.admin");

router.post("/add", adminController.addAdmin);
router.delete("/delete/:id", adminController.deleteAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/check", adminController.checkToken);
router.get("/", adminController.getAllAdmins);
router.get("/get/:id", adminController.getAdminById);
router.get("/search", adminController.searchAdmins);
router.put("/update/:id", adminController.updateAdmin);
router.put("/updateStaff/:id", adminController.updateAdminWithPassword);

module.exports = router;
