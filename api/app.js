// api/app.js (merged)
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // load env before everything else

const app = express();

// Security & middleware
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// DB connection
const { connectToDatabase } = require("./Configurations/DB_Connection.js");

// Mongoose tuning
const mongoose = require("mongoose");
mongoose.set("sanitizeFilter", true);
mongoose.set("debug", true); // show Mongo queries in console
const { isValidObjectId } = mongoose; // (kept for compatibility even if unused)

// If running behind a proxy (e.g., Heroku/NGINX), keep this:
app.set("trust proxy", 1);

// ---- CORS: support BOTH styles (open vs allowlist) ----
// - If CORS_MODE=open -> fully open (matches v1 behavior)
// - Else use allowlist (matches v2 behavior)
const CORS_MODE = (process.env.CORS_MODE || "allowlist").toLowerCase();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

if (CORS_MODE === "open") {
  app.use(cors()); // v1 behavior
} else {
  const corsOptions = {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin / curl
      return cb(null, ALLOWED_ORIGINS.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // set true only if using cookie auth
    maxAge: 600,
  };
  app.use(cors(corsOptions)); // v2 behavior
}

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false })); // keep CSP off unless configured

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// NoSQL injection guard (from v1)
app.use(mongoSanitize({ allowDots: false, replaceWith: "_" }));

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------ DB connection ------------------------
connectToDatabase()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

// ------------------------------ Routes ------------------------------
app.use("/patient", require("./routes/route.patient.js"));
app.use("/admin", require("./routes/routes.admin.js"));
app.use("/doctor", require("./routes/route.doctors.js"));
app.use("/channel", require("./routes/route.channels.js"));
app.use("/appointment", require("./routes/route.appointment.js"));
app.use("/prescription", require("./routes/route.prescription.js"));
app.use("/report", require("./routes/reports"));
app.use("/test", require("./routes/route.tests.js"));
app.use("/record", require("./routes/records"));
app.use("/Inventory", require("./routes/route.inventory.js")); // kept exact casing to avoid breaking clients
app.use("/Order", require("./routes/order.js"));               // kept exact casing to avoid breaking clients
app.use("/PharmacyIn", require("./routes/pharmacyin"));        // kept exact casing to avoid breaking clients
app.use("/card", require("./routes/CardRoutes.js"));
app.use("/insurance", require("./routes/insuranceRoutes"));

// ------------------------- Fallback handlers -------------------------
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Centralized error handler (safe message in production)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const msg =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Error";
  res.status(status).json({ error: msg });
});

module.exports = app;
