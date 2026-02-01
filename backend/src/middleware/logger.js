/**
 * FILE: backend/src/middleware/logger.js
 * 
 * PURPOSE: Request logging middleware with enriched logging
 * 
 * RESPONSIBILITIES:
 *  - Log all incoming requests with detailed information
 *  - Track response times
 *  - Log request/response bodies (in debug mode)
 *  - Color-coded console output
 */

const winston = require('winston');
const path = require('path');

// Ensure logs directory exists
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console with colors
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}] ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Configure Winston logger
const requestLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'requests.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  requestLogger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

/**
 * Get status color for console output
 */
function getStatusColor(status) {
  if (status >= 500) return '\x1b[31m'; // Red
  if (status >= 400) return '\x1b[33m'; // Yellow
  if (status >= 300) return '\x1b[36m'; // Cyan
  if (status >= 200) return '\x1b[32m'; // Green
  return '\x1b[0m'; // Reset
}

/**
 * Request logging middleware with enriched logging
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function logger(req, res, next) {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  // Log incoming request
  if (process.env.LOG_API_REQUESTS === 'true') {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📥 [${requestId}] ${req.method} ${req.url}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   User-Agent: ${req.get('user-agent')}`);
    
    if (req.user) {
      console.log(`   User: ${req.user.phoneNumber} (${req.user.role})`);
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`   Body:`, JSON.stringify(req.body, null, 2));
    }
    
    if (req.query && Object.keys(req.query).length > 0) {
      console.log(`   Query:`, JSON.stringify(req.query, null, 2));
    }
  }

  // Capture response body
  const originalSend = res.send;
  let responseBody;
  
  res.send = function(data) {
    responseBody = data;
    originalSend.call(this, data);
  };

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    
    // Console log with colors
    if (process.env.LOG_API_REQUESTS === 'true') {
      console.log(`${statusColor}📤 [${requestId}] ${res.statusCode} ${req.method} ${req.url} - ${duration}ms\x1b[0m`);
      
      if (responseBody && process.env.LOG_LEVEL === 'debug') {
        try {
          const parsed = JSON.parse(responseBody);
          console.log(`   Response:`, JSON.stringify(parsed, null, 2));
        } catch (e) {
          // Not JSON, skip
        }
      }
      console.log('='.repeat(80));
    }
    
    // File log
    const logData = {
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    };

    if (req.user) {
      logData.user = {
        id: req.user.id,
        phone: req.user.phoneNumber,
        role: req.user.role
      };
    }

    if (process.env.LOG_LEVEL === 'debug') {
      if (req.body && Object.keys(req.body).length > 0) {
        logData.requestBody = req.body;
      }
      if (req.query && Object.keys(req.query).length > 0) {
        logData.queryParams = req.query;
      }
    }

    requestLogger.info(logData);
  });

  next();
}

module.exports = {
  logger,
  requestLogger
};

