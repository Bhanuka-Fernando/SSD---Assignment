const express = require("express");
const router = express.Router();

const adminController = require("../Controllers/controller.admin");
const { auth, requireRole } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const Admin = require("../models/Admin");



// ───────────────── Public login (rate-limited) ─────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
});
router.post("/login", loginLimiter, adminController.loginAdmin);

// ───────────────── Everything below requires admin token ─────────────────
router.use(auth, requireRole("admin", "superadmin"));

router.post("/add", adminController.addAdmin);
router.delete("/delete/:id", adminController.deleteAdmin);
router.get("/check", adminController.checkToken);
router.get("/", adminController.getAllAdmins);
router.get("/get/:id", adminController.getAdminById);
router.get("/search", adminController.searchAdmins);
router.put("/update/:id", adminController.updateAdmin);
router.put("/updateStaff/:id", adminController.updateAdminWithPassword);

module.exports = router;
