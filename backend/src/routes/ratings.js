const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, createError } = require('../middleware/errorHandler');
const TrustService = require('../services/TrustService');

// Submit rating
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { transactionId, vendorId, deliveryRating, qualityRating, comment } = req.body;

  // Validate ratings
  if (deliveryRating < 1 || deliveryRating > 5 || qualityRating < 1 || qualityRating > 5) {
    throw createError('Ratings must be between 1 and 5', 400);
  }

  const rating = await TrustService.submitRating({
    transactionId,
    buyerId: req.user.id,
    vendorId,
    deliveryRating,
    qualityRating,
    comment
  });

  res.status(201).json({
    message: 'Rating submitted successfully',
    rating
  });
}));

// Get vendor ratings
router.get('/vendor/:vendorId', asyncHandler(async (req, res) => {
  const reputation = await TrustService.getVendorReputation(req.params.vendorId);
  res.json(reputation);
}));

// Get trust score
router.get('/trust-score/:vendorId', asyncHandler(async (req, res) => {
  const trustScore = await TrustService.calculateTrustScore(req.params.vendorId);
  res.json(trustScore);
}));

module.exports = router;
