// models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    actorId: String,   // user id or 'anon'
    action: String,    // 'file.download', 'insurance.claim.submit', etc.
    targetId: String,  // patientId / fileId / claimId (no PHI)
    ip: String,
    ua: String,
    reqId: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
