// Controllers/controller.admin.js

const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/* --------------------------- JWT configuration --------------------------- */
// NEVER hardcode secrets
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = "helasuwa";
const JWT_EXPIRES = "1h";

/* ---------------------------- Mailer (Zoho) ------------------------------ */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // e.g., helasuwa@zohomail.com
    pass: process.env.EmailPass, // Zoho app-specific password
  },
});

/* --------------------------------- Utils -------------------------------- */
const signToken = (payload, expiresIn = JWT_EXPIRES) =>
  jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    issuer: JWT_ISSUER,
    expiresIn,
    jwtid: crypto.randomUUID(),
  });

const hashEmail = (e) =>
  e ? crypto.createHash("sha256").update(String(e).toLowerCase().trim()).digest("hex") : null;

/* =============================== Controllers ============================ */

/**
 * Add new admin
 * NOTE: Password is hashed by Admin model hooks. Do NOT email plaintext passwords.
 */
exports.addAdmin = async (req, res) => {
  try {
    const { email, name, phone, roleName, allocatedWork, password } = req.body;

    if (!email || !name || !phone || !roleName || !allocatedWork || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const admin = await Admin.create({ email, name, phone, roleName, allocatedWork, password });

    // Notify (no secrets)
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your staff profile is ready",
        text: `Hi ${name}, your staff account has been created. Please log in and change your password immediately.`,
      });
    } catch (e) {
      req.log?.warn("mail.send.failed", { reqId: req.id, msg: e.message });
    }

    req.log?.info("admin.created", {
      reqId: req.id,
      actor: req.user?.id || "system",
      target: admin._id.toString(),
    });

    return res.status(201).json({ message: "Admin Added", admin });
  } catch (err) {
    req.log?.error("admin.create.error", { reqId: req.id, msg: err.message });
    if (err.code === 11000) return res.status(409).json({ error: "Email already exists" });
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete admin
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    req.log?.info("admin.deleted", { reqId: req.id, actor: req.user?.id, target: id });
    return res.status(200).json({ status: "Staff deleted" });
  } catch (err) {
    req.log?.error("admin.delete.error", { reqId: req.id, msg: err.message });
    return res.status(500).json({ status: "Error deleting admin" });
  }
};

/**
 * Login admin (returns JWT)
 * Security logging: success/fail/error with minimal, non-sensitive context (A09)
 */
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};
  const start = Date.now();

  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ua = req.headers["user-agent"];
  const emailHash = hashEmail(email);

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      req.log?.warn("auth.login.failed", {
        role: "admin",
        reason: "no-user",
        emailHash,
        ip,
        ua,
        reqId: req.id,
        ms: Date.now() - start,
      });
      return res.status(401).json({ rst: "invalid admin" });
    }

    const ok = await admin.comparePassword(password);
    if (!ok) {
      req.log?.warn("auth.login.failed", {
        role: "admin",
        reason: "bad-credentials",
        emailHash,
        ip,
        ua,
        reqId: req.id,
        ms: Date.now() - start,
      });
      return res.status(401).json({ rst: "incorrect password" });
    }

    const token = signToken({
      sub: admin._id.toString(),
      role: admin.roleName,
      email: admin.email,
    });

    req.log?.info("auth.login.success", {
      role: "admin",
      userId: admin._id.toString(),
      ip,
      ua,
      reqId: req.id,
      ms: Date.now() - start,
    });

    return res.status(200).json({ rst: "success", data: admin.toJSON(), tok: token });
  } catch (error) {
    req.log?.error("auth.login.error", {
      role: "admin",
      emailHash,
      ip,
      ua,
      reqId: req.id,
      ms: Date.now() - start,
      msg: error.message,
    });
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Check token (compat: reads Authorization if auth middleware not used)
 */
exports.checkToken = async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ rst: "no token" });

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"], issuer: JWT_ISSUER });
    const admin = await Admin.findById(decoded.sub);
    return res.status(200).json({ rst: "checked", admin });
  } catch (e) {
    return res.status(401).json({ rst: "invalid token" });
  }
};

/**
 * Get all admins
 */
exports.getAllAdmins = async (_req, res) => {
  try {
    const admins = await Admin.find().lean();
    return res.json(admins);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get admin by ID
 */
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).lean();
    if (!admin) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ status: "Staff fetched", staff: admin });
  } catch (err) {
    return res.status(500).json({ status: "Error in getting staff details", error: err.message });
  }
};

/**
 * Search admins (safe regex)
 */
exports.searchAdmins = async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    if (!q) return res.json([]);
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const results = await Admin.find({
      $or: [{ email: re }, { name: re }, { roleName: re }, { allocatedWork: re }],
    }).lean();
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update admin (no password)
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, phone, roleName, allocatedWork } = req.body;
    const update = { name, email, phone, roleName, allocatedWork };
    await Admin.findByIdAndUpdate(req.params.id, update, { runValidators: true });
    req.log?.info("admin.updated", { reqId: req.id, actor: req.user?.id, target: req.params.id });
    return res.status(200).json({ status: "Staff updated" });
  } catch (err) {
    return res.status(500).json({ status: "Error with updating information", error: err.message });
  }
};

/**
 * Update admin WITH password (hashed via model hook)
 */
exports.updateAdminWithPassword = async (req, res) => {
  try {
    const { name, email, phone, roleName, allocatedWork, password } = req.body;
    const update = { name, email, phone, roleName, allocatedWork };
    if (password) update.password = password; // model hook will hash

    await Admin.findByIdAndUpdate(req.params.id, update, { runValidators: true });
    req.log?.info("admin.updated.withPassword", { reqId: req.id, actor: req.user?.id, target: req.params.id });
    return res.status(200).json({ status: "Staff updated" });
  } catch (err) {
    return res.status(500).json({ status: "Error with updating information", error: err.message });
  }
};
