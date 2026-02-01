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

module.exports = router;
