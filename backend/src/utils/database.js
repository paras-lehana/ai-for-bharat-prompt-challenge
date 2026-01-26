/**
 * FILE: backend/src/utils/database.js
 * 
 * PURPOSE: Database initialization and connection management
 * 
 * KEY FUNCTIONS:
 *  - initializeDatabase() → Sets up Sequelize and creates tables
 *  - getSequelize() → Returns Sequelize instance
 * 
 * INTEGRATION POINTS:
 *  - Called by: app.js on startup
 *  - Used by: All model files
 * 
 * DATABASE:
 *  - SQLite for MVP (single file, easy deployment)
 *  - PostgreSQL for production (better concurrency)
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// Determine database configuration based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL || 'sqlite:./mandi.db';

// Initialize Sequelize
const sequelize = new Sequelize(databaseUrl, {
  dialect: databaseUrl.startsWith('sqlite') ? 'sqlite' : 'postgres',
  storage: databaseUrl.startsWith('sqlite') ? path.resolve(__dirname, '../../mandi.db') : undefined,
  logging: isDevelopment ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
});

/**
 * Initialize database connection and sync models
 * 
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Sync models (create tables if they don't exist)
    // In production, use migrations instead of sync
    // TEMPORARY FIX: Use force to drop and recreate tables
    await sequelize.sync({ force: true });
    console.log('Database models synchronized (force mode)');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
}

/**
 * Get Sequelize instance
 * 
 * @returns {Sequelize}
 */
function getSequelize() {
  return sequelize;
}

/**
 * Close database connection
 * 
 * @returns {Promise<void>}
 */
async function closeDatabase() {
  await sequelize.close();
  console.log('Database connection closed');
}

module.exports = {
  sequelize,
  initializeDatabase,
  getSequelize,
  closeDatabase
};
