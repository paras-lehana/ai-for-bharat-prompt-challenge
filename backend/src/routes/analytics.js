const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../models');

// Track share event
router.post('/share', authenticateToken, async (req, res) => {
  try {
    const { listingId, method } = req.body;

    if (!listingId || !method) {
      return res.status(400).json({ 
        error: 'listingId and method are required' 
      });
    }

    // Verify listing exists
    const listing = await db.Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Create share tracking record (using snake_case for database)
    const share = await db.Share.create({
      listing_id: listingId,
      user_id: req.user.id,
      method, // 'whatsapp', 'sms', 'email', 'copy_link', 'qr_code'
      shared_at: new Date()
    });

    // Increment share count on listing (if field exists)
    if (listing.shareCount !== undefined) {
      await listing.increment('shareCount');
    }

    res.json({
      success: true,
      message: 'Share tracked successfully',
      share: {
        id: share.id,
        method: share.method,
        sharedAt: share.shared_at
      }
    });
  } catch (error) {
    console.error('Error tracking share:', error);
    res.status(500).json({ error: 'Failed to track share' });
  }
});

// Get share statistics for a listing
router.get('/shares/:listingId', authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;

    const shares = await db.Share.findAll({
      where: { listing_id: listingId },
      attributes: [
        'method',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['method']
    });

    const totalShares = await db.Share.count({
      where: { listing_id: listingId }
    });

    res.json({
      listingId,
      totalShares,
      sharesByMethod: shares.map(s => ({
        method: s.method,
        count: parseInt(s.get('count'))
      }))
    });
  } catch (error) {
    console.error('Error fetching share statistics:', error);
    res.status(500).json({ error: 'Failed to fetch share statistics' });
  }
});

// Get user's share history
router.get('/shares/user/history', authenticateToken, async (req, res) => {
  try {
    const shares = await db.Share.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: db.Listing,
        as: 'listing',
        attributes: ['id', 'cropType', 'finalPrice', 'unit']
      }],
      order: [['shared_at', 'DESC']],
      limit: 50
    });

    res.json({
      shares: shares.map(s => ({
        id: s.id,
        method: s.method,
        sharedAt: s.shared_at,
        listing: s.listing ? {
          id: s.listing.id,
          cropType: s.listing.cropType,
          finalPrice: s.listing.finalPrice,
          unit: s.listing.unit
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching share history:', error);
    res.status(500).json({ error: 'Failed to fetch share history' });
  }
});

// Get dashboard statistics
router.get('/dashboard/:vendorId', authenticateToken, async (req, res) => {
  try {
    // In a real app, these would be aggregated from multiple tables
    res.json({
      totalSales: 45250.00,
      activeListings: 8,
      pendingNegotiations: 3,
      trustScore: 4.8,
      salesTrends: [
        { date: '2026-01-26', sales: 4500 },
        { date: '2026-01-27', sales: 3200 },
        { date: '2026-01-28', sales: 5800 },
        { date: '2026-01-29', sales: 4100 },
        { date: '2026-01-30', sales: 6200 },
        { date: '2026-01-31', sales: 5100 },
        { date: '2026-02-01', sales: 4800 }
      ],
      bestSellingCrops: [
        { crop: 'Tomato', quantity: 450 },
        { crop: 'Potato', quantity: 320 },
        { crop: 'Onion', quantity: 280 },
        { crop: 'Corn', quantity: 210 }
      ],
      qualityTierPerformance: [
        { tier: 'Premium', value: 45 },
        { tier: 'Standard', value: 35 },
        { tier: 'Fair', value: 20 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// Get pricing analytics
router.get('/pricing/:vendorId', authenticateToken, async (req, res) => {
  try {
    res.json({
      averagePrice: 34.50,
      regionalAverage: 32.20,
      priceHistory: [
        { month: 'Oct', price: 28 },
        { month: 'Nov', price: 30 },
        { month: 'Dec', price: 35 },
        { month: 'Jan', price: 34 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing analytics' });
  }
});

// Get negotiation analytics
router.get('/negotiations/:vendorId', authenticateToken, async (req, res) => {
  try {
    res.json({
      successRate: 78.5,
      averageDiscount: 12.4,
      totalNegotiations: 45,
      negotiationOutcomes: [
        { name: 'Accepted', value: 35 },
        { name: 'Rejected', value: 10 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch negotiation statistics' });
  }
});

module.exports = router;
