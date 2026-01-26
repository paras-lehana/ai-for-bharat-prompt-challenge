/**
 * FILE: backend/src/middleware/logger.js
 * 
 * PURPOSE: Request logging middleware
 * 
 * RESPONSIBILITIES:
 *  - Log all incoming requests
 *  - Track response times
 *  - Log request details (method, URL, IP)
 */

const winston = require('winston');

// Configure Winston logger
const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * Request logging middleware
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function logger(req, res, next) {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    requestLogger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  });

  next();
}

module.exports = {
  logger,
  requestLogger
};
