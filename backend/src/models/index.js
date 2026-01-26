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
