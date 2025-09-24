// api/app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { connectToDatabase } = require("./Configurations/DB_Connection.js"); // keep your exact filename

dotenv.config();

const app = express();

/* ---------------- Security & middleware ---------------- */

// If you run behind a proxy in prod, keep this:
app.set("trust proxy", 1);

// Allowlist CORS (no "*")
const ALLOWED_ORIGINS = ["http://localhost:3000"]; // add prod URLs here

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // same-origin or curl
    return cb(null, ALLOWED_ORIGINS.includes(origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,        // set true only if you use cookies for auth
  maxAge: 600,
};

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false })); // keep CSP off until ready

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------------ DB connection ------------------------ */

connectToDatabase()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

/* ------------------------------ Routes ------------------------------ */

app.use("/patient", require("./routes/route.patient.js"));
app.use("/admin", require("./routes/routes.admin.js"));
app.use("/doctor", require("./routes/route.doctors.js"));
app.use("/channel", require("./routes/route.channels.js"));
app.use("/appointment", require("./routes/route.appointment.js"));
app.use("/prescription", require("./routes/route.prescription.js"));
app.use("/report", require("./routes/reports"));
app.use("/test", require("./routes/route.tests.js"));
app.use("/record", require("./routes/records"));
app.use("/Inventory", require("./routes/route.inventory.js"));
app.use("/Order", require("./routes/order.js"));
app.use("/PharmacyIn", require("./routes/pharmacyin"));
app.use("/card", require("./routes/CardRoutes.js"));
app.use("/insurance", require("./routes/insuranceRoutes"));

/* ------------------------- Fallback handlers ------------------------- */

app.use((req, res) => res.status(404).json({ error: "Not found" }));

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
