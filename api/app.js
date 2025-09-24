const express = require("express");
// Initialize express
const app = express();
const dotenv = require("dotenv");
dotenv.config(); // load env first



const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const { connectToDatabase } = require("./Configurations/DB_Connection.js");

const mongoose = require("mongoose");
mongoose.set("sanitizeFilter", true);
const { isValidObjectId } = mongoose; 


mongoose.set("debug", true); // shows Mongo queries in console


// Middleware (order matters, and must be AFTER app is created)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(mongoSanitize({ allowDots: false, replaceWith: "_" })); // moved here
app.use("/uploads", express.static("uploads")); // Prescription upload in insurance claim

// Database connection
connectToDatabase()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
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

const recordRouter = require("./routes/records"); // optional: rename from recordtRouter
app.use("/record", recordRouter);

const inventoryRoutes = require("./routes/route.inventory.js");
app.use("/Inventory", inventoryRoutes); // consider "/inventory"

const orderRoutes = require("./routes/order.js");
app.use("/Order", orderRoutes); // consider "/order"

const pharmacyRoutes = require("./routes/pharmacyin"); // optional: rename from pharmcyRoutes
app.use("/PharmacyIn", pharmacyRoutes); // consider "/pharmacy-in"

const cardRoutes = require("./routes/CardRoutes.js");
app.use("/card", cardRoutes);

const insuranceRoutes = require("./routes/insuranceRoutes");
app.use("/insurance", insuranceRoutes);

// Export the app
module.exports = app;
