// models/Patient.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema(
  {
    email:      { type: String, required: true, unique: true, trim: true, lowercase: true },
    firstName:  { type: String, required: true, trim: true },
    lastName:   { type: String, required: true, trim: true },
    dob:        { type: Date,   required: true },
    gender:     { type: String, required: true },
    password:   { type: String, required: true, select: false }, // hidden by default
    phone:         { type: String, required: true, trim: true },
    civilStatus:   { type: String, required: true, trim: true },
    height:        { type: Number, required: true },
    weight:        { type: Number, required: true },
    bloodGroup:    { type: String, required: true },
    medicalStatus: { type: String, required: true, trim: true },
    allergies:     { type: String, required: true, trim: true },
    emergencyPhone:{ type: String, required: true, trim: true },
    gaurdianName:  { type: String, trim: true },
    gaurdianPhone: { type: String, trim: true },
    gaurdianNIC:   { type: String, trim: true },
    insuranceNo:      { type: String, trim: true },
    insuranceCompany: { type: String, trim: true },
  },
  {
    timestamps: true,
    strict: true, // drops unknown fields (helps against mass assignment)
  }
);

// hide sensitive fields on output
patientSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// hash password when set/changed
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
