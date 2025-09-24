const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const { connectToDatabase } = require("./Configurations/DB_Connection.js");

dotenv.config();

// Initialize express
const app = express();

/* ------------------------ Security: headers & proxy ------------------------ */
app.disable("x-powered-by");
app.set("trust proxy", 1); // needed if behind nginx/heroku to make HSTS & secure cookies work

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production"
        ? {
            useDefaults: true,
            directives: {
              "default-src": ["'self'"],
              "img-src": ["'self'", "data:"],
              "script-src": ["'self'"],
              "style-src": ["'self'", "'unsafe-inline'"],
              "connect-src": ["'self'", "https://helasuwa.lk", "https://api.helasuwa.lk"],
            },
          }
        : false, // CSP off in dev to avoid DX pain
    hsts:
      process.env.NODE_ENV === "production"
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    referrerPolicy: { policy: "no-referrer" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

/* --------------------------------- CORS ---------------------------------- */
// ❗ Replace your old `app.use(cors())`
const allowedOrigins = ["http://localhost:3000", "https://helasuwa.lk","192.168.8.100"];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                 // curl/Postman/same-origin
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);                              // ❗ do NOT pass an Error (avoids 500)
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Make sure preflight requests don't error
app.options("*", cors(corsOptions));


/* ------------------------- Request parsing limits ------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ---------------------- ❌ No public static /uploads ---------------------- */
// IMPORTANT: do NOT expose medical files publicly
const filesRoutes = require('./routes/files');
app.use('/files', filesRoutes);


/* ---------------------- Request ID + access logging ----------------------- */
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
});
app.use(
  morgan(':method :url :status :response-time ms - reqId=:req[id] user=:remote-addr', {
    stream: { write: (msg) => console.log(msg.trim()) },
  })
);

/* --------------------------- Basic rate limiting -------------------------- */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

/* -------------------------- Database connection --------------------------- */
connectToDatabase()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err?.message || err));

/* --------------------------------- Routes -------------------------------- */
const patientRouter = require("./routes/route.patient.js");
app.use("/patient", patientRouter);

const adminRoutes = require("./routes/routes.admin.js");
app.use("/admin", adminRoutes);

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

const cardRoutes = require("./routes/CardRoutes.js");
app.use("/card", cardRoutes);

const insuranceRoutes = require("./routes/insuranceRoutes");
app.use("/insurance", insuranceRoutes);

/* ---------------------------- Health & 404s ------------------------------- */
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// 404 handler (don’t leak internals)
app.use((req, res) => {
  res.status(404).json({ error: "Not found", requestId: req.id });
});

/* ---------------------------- Error handling ------------------------------ */
// Central error handler: logs server-side, safe message to clients
// Use `next(err)` from routes/controllers to reach here
app.use((err, req, res, _next) => {
  console.error("ERR", { reqId: req.id, path: req.path, msg: err.message });
  res.status(err.status || 500).json({ error: "Internal server error", requestId: req.id });
});

module.exports = app;
