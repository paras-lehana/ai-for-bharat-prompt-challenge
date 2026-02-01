const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler, createError } = require('../middleware/errorHandler');
const { Listing, User } = require('../models');
const { Op } = require('sequelize');
const PricingService = require('../services/PricingService');
const AIService = require('../services/AIService');

// Get all listings with filters
router.get('/search', asyncHandler(async (req, res) => {
  const IntegrationService = require('../services/IntegrationService');
  const { cropType, qualityTier, minPrice, maxPrice, lat, lng, radius = 50, sortBy = 'relevance' } = req.query;

  const where = { status: 'active' };
  
  if (cropType) where.cropType = { [Op.like]: `%${cropType}%` };
  if (qualityTier) where.qualityTier = qualityTier;
  if (minPrice || maxPrice) {
    where.finalPrice = {};
    if (minPrice) where.finalPrice[Op.gte] = minPrice;
    if (maxPrice) where.finalPrice[Op.lte] = maxPrice;
  }

  const listings = await Listing.findAll({
    where,
    include: [{ model: User, as: 'vendor', attributes: ['id', 'name', 'phoneNumber'] }],
    order: [['createdAt', 'DESC']], // Newest listings first
    limit: 50
  });

  // Add ODOP badge information to each listing
  const listingsWithBadges = listings.map(listing => {
    const odpBadge = IntegrationService.getODOPBadgeInfo(
      listing.cropType,
      listing.locationDistrict || ''
    );
    
    return {
      ...listing.toJSON(),
      odpBadge: odpBadge.isODOP ? odpBadge.badge : null
    };
  });

  res.json({ listings: listingsWithBadges, count: listingsWithBadges.length });
}));

// Get single listing
router.get('/:id', asyncHandler(async (req, res) => {
  const IntegrationService = require('../services/IntegrationService');
  
  const listing = await Listing.findByPk(req.params.id, {
    include: [{ model: User, as: 'vendor', attributes: ['id', 'name', 'phoneNumber', 'languagePreference'] }]
  });

  if (!listing) {
    throw createError('Listing not found', 404);
  }

  // Add ODOP badge information if applicable
  const odpBadge = IntegrationService.getODOPBadgeInfo(
    listing.cropType,
    listing.locationDistrict || ''
  );

  res.json({
    ...listing.toJSON(),
    odpBadge: odpBadge.isODOP ? odpBadge.badge : null
  });
}));

// Create listing
router.post('/', authenticateToken, requireRole('vendor'), asyncHandler(async (req, res) => {
  const { cropType, quantity, unit, basePrice, qualityTier, description, images, location } = req.body;

  // Calculate pricing using PricingService
  const pricingData = await PricingService.calculateFinalPrice(
    basePrice,
    qualityTier,
    cropType,
    location.address
  );

  // Generate AI description if not provided
  let finalDescription = description;
  if (!description || description.length < 20) {
    finalDescription = await AIService.generateListingDescription(
      cropType,
      quantity,
      qualityTier,
      location.address
    );
  }

  const listing = await Listing.create({
    vendorId: req.user.id,
    cropType,
    quantity,
    unit,
    basePrice,
    qualityTier,
    qualityMultiplier: pricingData.qualityMultiplier,
    demandAdjuster: pricingData.demandAdjuster,
    finalPrice: pricingData.finalPrice,
    description: finalDescription,
    images,
    locationLat: location.latitude,
    locationLng: location.longitude,
    locationAddress: location.address,
    status: 'active'
  });

  res.status(201).json({
    listing,
    pricingBreakdown: pricingData.breakdown,
    aiGenerated: !description || description.length < 20
  });
}));

// Update listing
router.put('/:id', authenticateToken, requireRole('vendor'), asyncHandler(async (req, res) => {
  const listing = await Listing.findByPk(req.params.id);

  if (!listing) {
    throw createError('Listing not found', 404);
  }

  if (listing.vendorId !== req.user.id) {
    throw createError('Not authorized', 403);
  }

  await listing.update(req.body);
  res.json(listing);
}));

// Delete listing
router.delete('/:id', authenticateToken, requireRole('vendor'), asyncHandler(async (req, res) => {
  const listing = await Listing.findByPk(req.params.id);

  if (!listing) {
    throw createError('Listing not found', 404);
  }

  if (listing.vendorId !== req.user.id) {
    throw createError('Not authorized', 403);
  }

  await listing.destroy();
  res.json({ message: 'Listing deleted successfully' });
}));

// DEBUG ENDPOINT: Audit image mappings
router.get('/audit/images', asyncHandler(async (req, res) => {
  const listings = await Listing.findAll({
    attributes: ['id', 'cropType', 'images', 'vendorId', 'status'],
    include: [{ model: User, as: 'vendor', attributes: ['name'] }],
    limit: 100
  });
  
  const audit = listings.map(l => {
    const images = JSON.parse(l.images || '[]');
    return {
      id: l.id,
      cropType: l.cropType,
      vendor: l.vendor?.name || 'Unknown',
      status: l.status,
      images: images,
      imageCount: images.length,
      firstImage: images[0] || null
    };
  });
  
  res.json({
    totalListings: audit.length,
    audit: audit,
    summary: {
      withImages: audit.filter(a => a.imageCount > 0).length,
      withoutImages: audit.filter(a => a.imageCount === 0).length,
      cropTypes: [...new Set(audit.map(a => a.cropType))]
    }
  });
}));

module.exports = router;
