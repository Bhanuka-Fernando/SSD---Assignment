const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = "helasuwa";

exports.auth = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token", requestId: req.id });
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"], issuer: JWT_ISSUER });
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token", requestId: req.id });
  }
};

exports.requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: "Forbidden", requestId: req.id });
