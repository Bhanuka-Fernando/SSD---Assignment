// middleware/auth.js
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token", requestId: req.id });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "helasuwa",
    });
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token", requestId: req.id });
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role) return res.status(403).json({ error: "Forbidden", requestId: req.id });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden", requestId: req.id });
  next();
};
