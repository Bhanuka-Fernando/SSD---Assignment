// requireRole.js
module.exports = (...allowed) => (req, res, next) => {
  if (!req.session?.user) return res.status(401).json({ error: 'unauthenticated' });
  if (!allowed.includes(req.session.user.role)) return res.status(403).json({ error: 'forbidden' });
  next();
};
