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
const Favorite = require('./Favorite');
const SavedSearch = require('./SavedSearch');
const Share = require('./Share');
const PriceAlert = require('./PriceAlert');
const CommunityPost = require('./CommunityPost');
const CommunityComment = require('./CommunityComment');
const GovernmentScheme = require('./GovernmentScheme');

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

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Listing.hasMany(Favorite, { foreignKey: 'listingId', as: 'favorites' });

// SavedSearch associations
SavedSearch.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(SavedSearch, { foreignKey: 'userId', as: 'savedSearches' });

// Share associations
Share.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Share.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });
User.hasMany(Share, { foreignKey: 'user_id', as: 'shares' });
Listing.hasMany(Share, { foreignKey: 'listing_id', as: 'shares' });

PriceAlert.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PriceAlert, { foreignKey: 'userId', as: 'priceAlerts' });

// Community associations
CommunityPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(CommunityPost, { foreignKey: 'userId', as: 'posts' });
CommunityComment.belongsTo(CommunityPost, { foreignKey: 'postId', as: 'post' });
CommunityPost.hasMany(CommunityComment, { foreignKey: 'postId', as: 'comments' });
CommunityComment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(CommunityComment, { foreignKey: 'userId', as: 'comments' });
CommunityComment.belongsTo(CommunityComment, { foreignKey: 'parentId', as: 'parent' });
CommunityComment.hasMany(CommunityComment, { foreignKey: 'parentId', as: 'replies' });

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
  ENAMPrice,
  Favorite,
  SavedSearch,
  Share,
  PriceAlert,
  CommunityPost,
  CommunityComment,
  GovernmentScheme
};
