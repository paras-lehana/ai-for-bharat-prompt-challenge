const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { User, Listing, TrustScore } = require('../models');

router.get('/nearby', asyncHandler(async (req, res) => {
  const { cropType, lat, lng, radius = 50 } = req.query;
  
  // If no cropType provided, return all active listings
  const whereClause = { status: 'active' };
  if (cropType) {
    whereClause.cropType = cropType;
  }
  
  // Simplified: return all vendors with that crop (or all if no crop specified)
  const listings = await Listing.findAll({
    where: whereClause,
    include: [{ model: User, as: 'vendor' }],
    limit: 20
  });

  res.json({ vendors: listings });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const vendor = await User.findByPk(req.params.id);
  const listings = await Listing.findAll({ where: { vendorId: req.params.id, status: 'active' } });
  const trustScore = await TrustScore.findOne({ where: { vendorId: req.params.id } });

  res.json({ vendor, listings, trustScore });
}));

router.get('/:id/listings', asyncHandler(async (req, res) => {
  const listings = await Listing.findAll({
    where: { vendorId: req.params.id, status: 'active' }
  });

  res.json({ listings });
}));

module.exports = router;
