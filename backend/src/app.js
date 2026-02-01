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
const favoritesRoutes = require('./routes/favorites');
const savedSearchesRoutes = require('./routes/savedSearches');
const shareRoutes = require('./routes/share');
const integrationRoutes = require('./routes/integration');
const priceAlertsRoutes = require('./routes/priceAlerts');

// Import database
const { initializeDatabase } = require('./utils/database');
const { initializeCronJobs } = require('./utils/cronJobs');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3001',
  'https://lokalmandi.lehana.in',
  'https://lokmandi.lehana.in',
  'https://lokalmandi.aidhunik.com',
  'https://lokmandi.aidhunik.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting - increased for demo/testing (1000 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
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
    service: 'Lokal Mandi API'
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
app.use('/api/favorites', favoritesRoutes);
app.use('/api/saved-searches', savedSearchesRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/price-alerts', priceAlertsRoutes);
app.use('/api/weather', require('./routes/weather'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/quality', require('./routes/quality'));
app.use('/api/logistics', require('./routes/logistics'));
app.use('/api/community', require('./routes/community'));
app.use('/api/schemes', require('./routes/schemes'));

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
    
    // Initialize cron jobs for price alerts
    initializeCronJobs();
    console.log('✅ Cron jobs initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Lokal Mandi API running on port ${PORT}`);
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
