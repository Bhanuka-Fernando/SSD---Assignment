// models/Patient.js (merged)
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema(
  {
    // Common identity fields
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    firstName:  { type: String, required: true, trim: true },
    lastName:   { type: String, required: true, trim: true },
    dob:        { type: Date,   required: true },
    gender:     { type: String, required: true, trim: true },

    // Credentials (support both styles)
    password: {
      type: String,
      select: false,          // hidden by default
      // not "required" — we validate at least one of password/passwordHash below
    },
    passwordHash: {
      type: String,
      select: false,          // hidden by default
      // not "required" — we validate at least one of password/passwordHash below
    },

    // Contact & profile (preserve both field names from the two models)
    phone:      { type: String, trim: true },   // v1
    phoneNo:    { type: String, trim: true },   // v2
    civilStatus:{ type: String, required: true, trim: true },
    height:     { type: Number, required: true },
    weight:     { type: Number, required: true },
    bloodGroup: { type: String, required: true, trim: true },
    medicalStatus: { type: String, required: true, trim: true },
    allergies:  { type: String, required: true, trim: true },
    emergencyPhone: { type: String, required: true, trim: true },

    gaurdianName:  { type: String, trim: true },
    gaurdianPhone: { type: String, trim: true },
    gaurdianNIC:   { type: String, trim: true },

    insuranceNo:      { type: String, trim: true },
    insuranceCompany: { type: String, trim: true },
  },
  {
    timestamps: true,
    strict: true, // drops unknown fields (helps against mass assignment)
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/* ---------- Validation: require at least one credential field ---------- */
patientSchema.pre("validate", function (next) {
  // Only enforce on new docs or when creds are being changed
  const hasPassword = typeof this.password === "string" && this.password.length > 0;
  const hasPasswordHash = typeof this.passwordHash === "string" && this.passwordHash.length > 0;

  if (this.isNew && !(hasPassword || hasPasswordHash)) {
    return next(new mongoose.Error.ValidationError(this).addError("password", new mongoose.Error.ValidatorError({
      message: "Either password or passwordHash is required",
      path: "password",
      value: this.password,
    })));
  }
  next();
});

/* ----------------- Hashing: controller-agnostic behavior ----------------
   - If `password` is set/changed and not yet bcrypt, hash it.
   - If only `passwordHash` is provided, we leave it as-is (already hashed).
------------------------------------------------------------------------- */
const isBcrypt = (s) => typeof s === "string" && /^\$2[aby]\$/.test(s);

patientSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") && this.password && !isBcrypt(this.password)) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    // Optional safety: if passwordHash is modified but not bcrypt, hash it too.
    if (this.isModified("passwordHash") && this.passwordHash && !isBcrypt(this.passwordHash)) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model("Patient", patientSchema);
