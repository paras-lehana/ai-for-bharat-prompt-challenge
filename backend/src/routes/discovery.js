const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { Listing, User } = require('../models');

router.get('/nearby', asyncHandler(async (req, res) => {
  const { cropType, lat, lng, radius = 50 } = req.query;

  const listings = await Listing.findAll({
    where: { cropType, status: 'active' },
    include: [{ model: User, as: 'vendor' }],
    limit: 20
  });

  res.json({ vendors: listings });
}));

router.get('/aggregation/:listingId', asyncHandler(async (req, res) => {
  const listing = await Listing.findByPk(req.params.listingId);

  const similarListings = await Listing.findAll({
    where: { cropType: listing.cropType, status: 'active' },
    limit: 5
  });

  res.json({
    suggestions: [{
      vendors: similarListings,
      combinedQuantity: similarListings.reduce((sum, l) => sum + parseFloat(l.quantity), 0),
      weightedPrice: listing.finalPrice
    }]
  });
}));

module.exports = router;
