// api/middleware/auth.js
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/);
  if (!m) return res.sendStatus(401);

  try {
    const payload = jwt.verify(m[1], process.env.JWT_SECRET, { algorithms: ["HS256"] });
    // Put just what you need on req.user
    req.user = { id: payload.sub, role: payload.role || "patient" };
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
}

module.exports = { requireAuth };
