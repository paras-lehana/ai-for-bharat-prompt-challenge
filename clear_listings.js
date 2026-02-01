/**
 * Utility to clear all data for a clean start
 */
const { sequelize } = require('./backend/src/utils/database');
const { 
  Listing, Negotiation, Offer, Transaction, Rating, Feedback, 
  Favorite, Share, PriceAlert, Message, CommunityPost, CommunityComment 
} = require('./backend/src/models');

async function clearAllData() {
  try {
    console.log('🧹 Clearing all marketplace data...');
    
    // Disable foreign key checks for SQLite
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Delete in order or just all
    const models = [
      'ratings', 'transactions', 'offers', 'negotiations', 'favorites', 
      'shares', 'price_alerts', 'messages', 'community_comments', 
      'community_posts', 'listings'
    ];
    
    for (const table of models) {
      await sequelize.query(`DELETE FROM ${table}`);
      console.log(`   ✓ Cleared ${table}`);
    }
    
    // Re-enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('✅ All data cleared successfully. Marketplace is now blank.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearAllData();
