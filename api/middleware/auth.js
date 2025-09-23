// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports.auth = (req,res,next)=>{
  const h = req.headers.authorization || '';
  if(!h.startsWith('Bearer ')) return res.status(401).json({msg:'auth required'});
  try { req.user = jwt.verify(h.slice(7), process.env.JWT_SECRET); return next(); }
  catch { return res.status(401).json({msg:'invalid token'}); }
};

module.exports.requireRole = (...roles)=> (req,res,next)=>{
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({msg:'forbidden'});
  next();
};
