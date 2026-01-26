/**
 * FILE: backend/src/app.js
 * 
 * PURPOSE: Main Express application setup and configuration
 * 
 * RESPONSIBILITIES:
 *  - Initialize Express server
 *  - Configure middleware (CORS, JSON parsing, rate limiting)
 *  - Mount API routes
 *  - Set up error handling
 *  - Initialize database connection
 * 
 * INTEGRATION POINTS:
 *  - All route modules
 *  - Database initialization
 *  - Middleware modules
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

// Import routes
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const negotiationsRoutes = require('./routes/negotiations');
const pricesRoutes = require('./routes/prices');
const vendorsRoutes = require('./routes/vendors');
const voiceRoutes = require('./routes/voice');
const ratingsRoutes = require('./routes/ratings');
const disputesRoutes = require('./routes/disputes');
const messagesRoutes = require('./routes/messages');
const discoveryRoutes = require('./routes/discovery');
const transactionsRoutes = require('./routes/transactions');
const advisoryRoutes = require('./routes/advisory');
const analyticsRoutes = require('./routes/analytics');

// Import database
const { initializeDatabase } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // For audio uploads
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Multilingual Mandi API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/negotiations', negotiationsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/disputes', disputesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Multilingual Mandi API running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
