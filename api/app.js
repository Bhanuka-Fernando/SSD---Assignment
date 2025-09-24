// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");

const { connectToDatabase } = require("./Configurations/DB_Connection.js"); // Singleton DB

// OIDC + RBAC helpers
const authRoutes = require("./auth");           // /auth/login, /auth/callback, /auth/me, /auth/logout
const requireAuth = require("./requireAuth");   // 401 if not logged in
const requireRole = require("./requireRole");   // 403 if role not allowed

dotenv.config();

// Initialize express
const app = express();

// --- Security & Core Middleware ---
app.use(helmet());

// Allow your React app (http://localhost:3000) to send cookies (credentials:true)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static uploads (Prescription upload in insurance claim)
app.use("/uploads", express.static("uploads"));

// Trust proxy if you later run behind Nginx/Heroku (keeps SameSite/secure cookies working)
// app.set('trust proxy', 1);

// Session cookie (used by OIDC and protected routes)
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
    },
  })
);

// --- Auth endpoints (OIDC) ---
app.use("/auth", authRoutes);

// --- Database connection ---
connectToDatabase()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

// --- Your existing routes (patient/doctor/etc.) ---
const patientRouter = require("./routes/route.patient.js");
app.use("/patient", patientRouter);

// ✅ Guard /admin with session + role=admin
const adminRoutes = require("./routes/routes.admin.js");
app.use("/admin", requireAuth, requireRole("admin"), adminRoutes);

const doctorRoutes = require("./routes/route.doctors.js");
app.use("/doctor", doctorRoutes);

const channelRouter = require("./routes/route.channels.js");
app.use("/channel", channelRouter);

const appointmentRouter = require("./routes/route.appointment.js");
app.use("/appointment", appointmentRouter);

const prescriptionRouter = require("./routes/route.prescription.js");
app.use("/prescription", prescriptionRouter);

const reportRouter = require("./routes/reports");
app.use("/report", reportRouter);

const testRoutes = require("./routes/route.tests.js");
app.use("/test", testRoutes);

const recordtRouter = require("./routes/records");
app.use("/record", recordtRouter);

const inventoryRoutes = require("./routes/route.inventory.js");
app.use("/Inventory", inventoryRoutes);

const orderRoutes = require("./routes/order.js");
app.use("/Order", orderRoutes);

const pharmcyRoutes = require("./routes/pharmacyin");
app.use("/PharmacyIn", pharmcyRoutes);

const cardRoutes = require('./routes/CardRoutes.js');
app.use("/card", cardRoutes);

const insuranceRoutes = require('./routes/insuranceRoutes');
app.use("/insurance", insuranceRoutes);

// --- Optional: simple health check ---
app.get("/health", (req, res) => {
  res.json({ ok: true, user: req.session?.user || null });
});

module.exports = app;
