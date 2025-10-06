const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const token = req.cookies.token;  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id; 
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = authMiddleware;
