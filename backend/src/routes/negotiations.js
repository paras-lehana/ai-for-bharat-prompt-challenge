const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, createError } = require('../middleware/errorHandler');
const { Negotiation, Offer, Listing, User, Transaction } = require('../models');
const PricingService = require('../services/PricingService');
const AIService = require('../services/AIService');

// Create negotiation
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { listingId, initialOfferPrice, message } = req.body;

  const listing = await Listing.findByPk(listingId);
  if (!listing) throw createError('Listing not found', 404);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const negotiation = await Negotiation.create({
    listingId,
    buyerId: req.user.id,
    vendorId: listing.vendorId,
    status: 'active',
    expiresAt
  });

  await Offer.create({
    negotiationId: negotiation.id,
    userId: req.user.id,
    amount: initialOfferPrice,
    reasoning: message,
    offerType: 'buyer_offer'
  });

  res.status(201).json(negotiation);
}));

// Get negotiation details
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findByPk(req.params.id, {
    include: [
      { model: Listing, as: 'listing' },
      { model: User, as: 'buyer', attributes: ['id', 'name'] },
      { model: User, as: 'vendor', attributes: ['id', 'name'] }
    ]
  });

  if (!negotiation) throw createError('Negotiation not found', 404);

  const offers = await Offer.findAll({
    where: { negotiationId: negotiation.id },
    order: [['createdAt', 'ASC']]
  });

  res.json({ ...negotiation.toJSON(), offers });
}));

// Submit counter-offer
router.post('/:id/counter', authenticateToken, asyncHandler(async (req, res) => {
  const { counterPrice, message } = req.body;

  const negotiation = await Negotiation.findByPk(req.params.id, {
    include: [{ model: Listing, as: 'listing' }]
  });
  if (!negotiation) throw createError('Negotiation not found', 404);
  if (negotiation.status !== 'active') throw createError('Negotiation not active', 400);

  // Get AI suggestion for vendor
  let aiSuggestion = null;
  if (req.user.role === 'vendor') {
    const lastOffer = await Offer.findOne({
      where: { negotiationId: negotiation.id },
      order: [['createdAt', 'DESC']]
    });

    if (lastOffer) {
      aiSuggestion = PricingService.generateCounterOffer(
        lastOffer.amount,
        negotiation.listing.finalPrice
      );
    }
  }

  await Offer.create({
    negotiationId: negotiation.id,
    userId: req.user.id,
    amount: counterPrice,
    reasoning: message,
    offerType: req.user.role === 'vendor' ? 'vendor_counter' : 'buyer_offer'
  });

  res.json({ 
    message: 'Counter-offer submitted',
    aiSuggestion: req.user.role === 'vendor' ? aiSuggestion : null
  });
}));

// Accept offer
router.post('/:id/accept', authenticateToken, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findByPk(req.params.id);
  if (!negotiation) throw createError('Negotiation not found', 404);

  const lastOffer = await Offer.findOne({
    where: { negotiationId: negotiation.id },
    order: [['createdAt', 'DESC']]
  });

  await negotiation.update({ status: 'accepted' });

  const transaction = await Transaction.create({
    negotiationId: negotiation.id,
    listingId: negotiation.listingId,
    buyerId: negotiation.buyerId,
    vendorId: negotiation.vendorId,
    agreedPrice: lastOffer.amount,
    quantity: 1, // TODO: Get from listing
    status: 'pending'
  });

  res.json({ message: 'Offer accepted', transaction });
}));

// Reject/Withdraw negotiation
router.post('/:id/reject', authenticateToken, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findByPk(req.params.id);
  if (!negotiation) throw createError('Negotiation not found', 404);
  
  // Check if user is part of this negotiation
  if (negotiation.buyerId !== req.user.id && negotiation.vendorId !== req.user.id) {
    throw createError('Unauthorized', 403);
  }

  await negotiation.update({ status: 'rejected' });

  res.json({ message: 'Negotiation withdrawn/rejected successfully' });
}));

// Get my negotiations (buyer or vendor)
router.get('/my/all', authenticateToken, asyncHandler(async (req, res) => {
  const where = req.user.role === 'vendor' 
    ? { vendorId: req.user.id }
    : { buyerId: req.user.id };

  const negotiations = await Negotiation.findAll({
    where,
    include: [
      { 
        model: Listing, 
        as: 'listing',
        attributes: ['id', 'cropType', 'finalPrice', 'images']
      },
      { 
        model: User, 
        as: req.user.role === 'vendor' ? 'buyer' : 'vendor',
        attributes: ['id', 'name']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  // Get last offer for each negotiation
  const negotiationsWithOffers = await Promise.all(
    negotiations.map(async (neg) => {
      const lastOffer = await Offer.findOne({
        where: { negotiationId: neg.id },
        order: [['createdAt', 'DESC']]
      });

      return {
        ...neg.toJSON(),
        lastOffer: lastOffer ? lastOffer.amount : null
      };
    })
  );

  res.json({ negotiations: negotiationsWithOffers });
}));

// Get AI counter-offer suggestion
router.get('/:id/suggestion', authenticateToken, asyncHandler(async (req, res) => {
  const negotiation = await Negotiation.findByPk(req.params.id, {
    include: [{ model: Listing, as: 'listing' }]
  });
  if (!negotiation) throw createError('Negotiation not found', 404);

  const lastOffer = await Offer.findOne({
    where: { negotiationId: negotiation.id },
    order: [['createdAt', 'DESC']]
  });

  if (!lastOffer) {
    return res.json({ suggestion: null, message: 'No offers yet' });
  }

  // Use AI for negotiation analysis
  const aiAnalysis = await AIService.analyzeNegotiation(
    negotiation.listing.finalPrice,
    lastOffer.amount,
    { average: negotiation.listing.basePrice }
  );

  res.json({ 
    suggestion: {
      amount: aiAnalysis.counterOffer,
      reasoning: aiAnalysis.reasoning,
      confidence: aiAnalysis.confidence
    }
  });
}));

module.exports = router;
