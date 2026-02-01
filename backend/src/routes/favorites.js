const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all favorites for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Listing,
        as: 'listing',
        include: [{ model: User, as: 'vendor', attributes: ['id', 'name', 'phoneNumber'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { listingId, notifyOnPriceChange, targetPrice } = req.body;
    
    // Check if listing exists
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Check if already favorited
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, listingId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    
    const favorite = await Favorite.create({
      userId: req.user.id,
      listingId,
      notifyOnPriceChange: notifyOnPriceChange !== undefined ? notifyOnPriceChange : true,
      targetPrice
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check if listing is favorited
router.get('/check/:listingId', authenticateToken, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, listingId: req.params.listingId }
    });
    res.json({ isFavorite: !!favorite, favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
router.delete('/:listingId', authenticateToken, async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: { userId: req.user.id, listingId: req.params.listingId }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update favorite settings
router.patch('/:listingId', authenticateToken, async (req, res) => {
  try {
    const { notifyOnPriceChange, targetPrice } = req.body;
    
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, listingId: req.params.listingId }
    });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    if (notifyOnPriceChange !== undefined) favorite.notifyOnPriceChange = notifyOnPriceChange;
    if (targetPrice !== undefined) favorite.targetPrice = targetPrice;
    
    await favorite.save();
    res.json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
