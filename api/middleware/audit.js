// middleware/audit.js
const AuditLog = require("../models/AuditLog");

exports.audit = (action, getTargetId) => async (req, _res, next) => {
  try {
    const targetId = typeof getTargetId === "function" ? getTargetId(req) : getTargetId;
    await AuditLog.create({
      at: new Date(),
      actorId: req.user?.id || "anon",
      action,
      targetId: targetId || null,
      ip: req.ip,
      ua: req.headers["user-agent"],
      reqId: req.id,
    });
  } catch (e) {
    console.error("audit-failed", { reqId: req.id, msg: e.message });
  }
  next();
};
