const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const PricingService = require('../services/PricingService');

// Get current eNAM prices
router.get('/current', asyncHandler(async (req, res) => {
  const { cropType, location } = req.query;
  
  const priceData = await PricingService.getENAMPrice(cropType, location);
  
  res.json({
    cropType,
    location: location || 'Delhi',
    ...priceData
  });
}));

// Calculate pricing with breakdown
router.post('/calculate', asyncHandler(async (req, res) => {
  const { productName, quantity, qualityTier, location, basePrice } = req.body;
  
  // Get base price from eNAM if not provided
  let finalBasePrice = basePrice;
  if (!finalBasePrice) {
    const enamPrice = await PricingService.getENAMPrice(productName, location);
    finalBasePrice = enamPrice.modalPrice;
  }

  const calculation = await PricingService.calculateFinalPrice(
    finalBasePrice,
    qualityTier || 'standard',
    productName,
    location
  );

  res.json({
    productName,
    quantity,
    qualityTier,
    location,
    ...calculation
  });
}));

// Validate offer price
router.post('/validate-offer', asyncHandler(async (req, res) => {
  const { offerPrice, listingPrice } = req.body;
  
  const validation = PricingService.validateOfferPrice(offerPrice, listingPrice);
  
  res.json(validation);
}));

module.exports = router;
