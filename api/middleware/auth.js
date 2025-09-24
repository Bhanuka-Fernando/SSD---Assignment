// api/middleware/auth.js (merged)
const jwt = require("jsonwebtoken");

/** Internal helper: parse Bearer or raw token */
function extractToken(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/);
  return m ? m[1] : h || null; // prefer Bearer, else raw header value
}

/** Internal verify that populates req.user consistently */
function verifyAndAttachUser(req) {
  const token = extractToken(req);
  if (!token) return { ok: false, code: 401, msg: "auth required" };

  try {
    // Prefer HS256 (matches v2), allow common HS algs for forwards-compat
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256", "HS384", "HS512"],
    });

    // Preserve full payload (v1) and add normalized fields (v2)
    req.user = {
      ...payload,                 // keep everything from token
      id: payload.sub || payload.id, // normalized id
      role: payload.role || "patient",
    };

    return { ok: true };
  } catch (_) {
    return { ok: false, code: 401, msg: "invalid token" };
  }
}

/* ---------------- v1 style: JSON error messages ---------------- */
function auth(req, res, next) {
  const result = verifyAndAttachUser(req);
  if (!result.ok) return res.status(result.code).json({ msg: result.msg });
  return next();
}

/* ---------------- v2 style: sendStatus codes ------------------- */
function requireAuth(req, res, next) {
  const result = verifyAndAttachUser(req);
  if (!result.ok) return res.sendStatus(result.code);
  return next();
}

/* --------------- Role guard (from v1, unchanged) --------------- */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ msg: "forbidden" });
  }
  next();
};

module.exports = { auth, requireAuth, requireRole };
