/**
 * FILE: backend/src/middleware/auth.js
 * 
 * PURPOSE: JWT authentication middleware
 * 
 * RESPONSIBILITIES:
 *  - Verify JWT tokens from Authorization header
 *  - Attach user information to request object
 *  - Reject unauthorized requests
 * 
 * INTEGRATION POINTS:
 *  - Used by: Protected route handlers
 *  - Depends on: JWT_SECRET environment variable
 */

const jwt = require('jsonwebtoken');
const { createError } = require('./errorHandler');

/**
 * Verify JWT token and attach user to request
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function authenticateToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      phoneNumber: decoded.phoneNumber,
      role: decoded.role,
      languagePreference: decoded.languagePreference
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError('Token expired', 401));
    }
    next(error);
  }
}

/**
 * Check if user has specific role
 * 
 * @param {string[]} roles - Allowed roles
 * @returns {Function} - Middleware function
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403));
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
