const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('authMiddleware decoded:', decoded); // Debug log
    // Validate decoded object
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload: missing id or role');
    }
    req.user = { _id: decoded.id, role: decoded.role }; // Map id to _id
    console.log('Authenticated user set:', req.user); // Debug log
    next();
  } catch (error) {
    console.error('authMiddleware error:', error.message, error.stack);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  console.log('Checking role for user:', req.user); // Debug log
  if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied', userRole: req.user?.role });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };