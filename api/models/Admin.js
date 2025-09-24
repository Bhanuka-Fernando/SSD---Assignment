const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name:  { type: String, required: true, trim: true },
    // store HASH, not plaintext
    password: { type: String, required: true, select: false },
    roleName: { type: String, required: true, enum: ["admin", "superadmin"] },
    phone:    { type: String, required: true, trim: true },
    allocatedWork: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// Hash on create/save when modified
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash on findOneAndUpdate if password provided
adminSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.password) {
    const salt = await bcrypt.genSalt(12);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Helper for login
adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON automatically
adminSchema.set("toJSON", {
  transform: (_doc, ret) => { delete ret.password; return ret; }
});

module.exports = mongoose.model("Admin", adminSchema);
