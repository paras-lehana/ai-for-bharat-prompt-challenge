/**
 * FILE: backend/src/models/index.js
 * 
 * PURPOSE: Central export for all models
 */

const User = require('./User');
const OTP = require('./OTP');
const Listing = require('./Listing');
const Negotiation = require('./Negotiation');
const Offer = require('./Offer');
const Transaction = require('./Transaction');
const Rating = require('./Rating');
const TrustScore = require('./TrustScore');
const Dispute = require('./Dispute');
const Evidence = require('./Evidence');
const Message = require('./Message');
const ENAMPrice = require('./ENAMPrice');

// Define additional associations not already in model files
// Rating associations (these are missing)
Rating.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Rating.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });
Rating.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

// User associations for ratings (these are missing)
User.hasMany(Rating, { foreignKey: 'vendorId', as: 'vendorRatings' });
User.hasMany(Rating, { foreignKey: 'buyerId', as: 'buyerRatings' });

// Offer associations
Offer.belongsTo(Negotiation, { foreignKey: 'negotiationId', as: 'negotiation' });
Offer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Negotiation.hasMany(Offer, { foreignKey: 'negotiationId', as: 'offers' });

module.exports = {
  User,
  OTP,
  Listing,
  Negotiation,
  Offer,
  Transaction,
  Rating,
  TrustScore,
  Dispute,
  Evidence,
  Message,
  ENAMPrice
};
