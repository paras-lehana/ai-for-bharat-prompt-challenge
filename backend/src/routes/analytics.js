const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Listing, Transaction, Negotiation } = require('../models');

router.get('/dashboard/:vendorId', authenticateToken, asyncHandler(async (req, res) => {
  const listings = await Listing.findAll({ where: { vendorId: req.params.vendorId } });
  const transactions = await Transaction.findAll({ where: { vendorId: req.params.vendorId } });
  const negotiations = await Negotiation.findAll({ where: { vendorId: req.params.vendorId } });

  res.json({
    totalSales: transactions.reduce((sum, t) => sum + parseFloat(t.agreedPrice), 0),
    activeListings: listings.filter(l => l.status === 'active').length,
    pendingNegotiations: negotiations.filter(n => n.status === 'active').length,
    trustScore: 4.2
  });
}));

router.get('/pricing/:vendorId', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    averagePrice: 500,
    regionalAverage: 480,
    comparison: 'above_average'
  });
}));

router.get('/negotiations/:vendorId', authenticateToken, asyncHandler(async (req, res) => {
  const negotiations = await Negotiation.findAll({ where: { vendorId: req.params.vendorId } });

  res.json({
    successRate: 75,
    averageDiscount: 5,
    totalNegotiations: negotiations.length
  });
}));

module.exports = router;
