/**
 * FILE: backend/src/middleware/errorHandler.js
 * 
 * PURPOSE: Global error handling middleware
 * 
 * RESPONSIBILITIES:
 *  - Catch all errors from routes
 *  - Format error responses consistently
 *  - Log errors appropriately
 *  - Hide sensitive information in production
 */

const winston = require('winston');

// Configure Winston logger
const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * Global error handler middleware
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  errorLogger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse = {
    error: err.name || 'Error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * 
 * @param {Function} fn - Async function
 * @returns {Function} - Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create custom error with status code
 * 
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error}
 */
function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  errorHandler,
  asyncHandler,
  createError
};
