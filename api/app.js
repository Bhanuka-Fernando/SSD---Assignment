// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const { connectToDatabase } = require("./Configurations/DB_Connection.js");
const { auth } = require("./middleware/auth"); // ⬅️ for PHI routes

dotenv.config();

const app = express();

// --- Security headers
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? { useDefaults: true } : false,
  hsts: process.env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: "no-referrer" },
  crossOriginResourcePolicy: { policy: "same-origin" }
}));

// --- CORS (allow only your real frontends)
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.8.100:3000",
  "https://helasuwa.lk"
];
const corsOptions = {
  origin: (origin, cb) => !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(null, false),
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --- Request ID (MUST be before Morgan and all routes)
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
});

// --- Morgan with custom token (prints req.id)
morgan.token("rid", (req) => req.id || "-");
app.use(morgan(":method :url :status :response-time ms rid=:rid ip=:remote-addr", {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

// --- Rate limit (global)
app.use(rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false }));

// --- DB
connectToDatabase().then(() => console.log("Database Connected")).catch(e => console.error(e.message));

// --- Routes (AFTER request-id + morgan)
const filesRoutes = require("./routes/files");
app.use("/files", auth, filesRoutes);             // ⬅️ protect files

const patientRouter = require("./routes/route.patient.js");
app.use("/patient", auth, patientRouter);         // ⬅️ protect PHI

const adminRoutes = require("./routes/routes.admin.js");
app.use("/admin", adminRoutes);

const doctorRoutes = require("./routes/route.doctors.js");
app.use("/doctor", auth, doctorRoutes);

const channelRouter = require("./routes/route.channels.js");
app.use("/channel", channelRouter);

const appointmentRouter = require("./routes/route.appointment.js");
app.use("/appointment", auth, appointmentRouter);

const prescriptionRouter = require("./routes/route.prescription.js");
app.use("/prescription", auth, prescriptionRouter);

const reportRouter = require("./routes/reports");
app.use("/report", auth, reportRouter);

const testRoutes = require("./routes/route.tests.js");
app.use("/test", testRoutes);

const recordtRouter = require("./routes/records");
app.use("/record", auth, recordtRouter);

const inventoryRoutes = require("./routes/route.inventory.js");
app.use("/Inventory", auth, inventoryRoutes);

const orderRoutes = require("./routes/order.js");
app.use("/Order", auth, orderRoutes);

const pharmcyRoutes = require("./routes/pharmacyin");
app.use("/PharmacyIn", auth, pharmcyRoutes);

const cardRoutes = require("./routes/CardRoutes.js");
app.use("/card", auth, cardRoutes);

// --- Health & errors
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use((req, res) => res.status(404).json({ error: "Not found", requestId: req.id }));
app.use((err, req, res, _next) => {
  console.error("ERR", { reqId: req.id, path: req.path, msg: err.message });
  res.status(err.status || 500).json({ error: "Internal server error", requestId: req.id });
});

module.exports = app;
