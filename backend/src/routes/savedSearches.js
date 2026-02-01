const express = require('express');
const router = express.Router();
const SavedSearch = require('../models/SavedSearch');
const Listing = require('../models/Listing');
const { authenticateToken } = require('../middleware/auth');

// Get all saved searches for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const searches = await SavedSearch.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(searches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create saved search
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, searchCriteria, notifyOnMatch } = req.body;
    
    const savedSearch = await SavedSearch.create({
      userId: req.user.id,
      name,
      searchCriteria,
      notifyOnMatch: notifyOnMatch !== undefined ? notifyOnMatch : true
    });
    
    res.status(201).json(savedSearch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Execute saved search
router.get('/:id/execute', authenticateToken, async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    const { crop, location, minPrice, maxPrice, quality } = savedSearch.searchCriteria;
    
    const where = { status: 'available' };
    if (crop) where.cropType = crop;
    if (location) where.locationAddress = { [require('sequelize').Op.like]: `%${location}%` };
    if (quality) where.qualityTier = quality;
    if (minPrice || maxPrice) {
      where.finalPrice = {};
      if (minPrice) where.finalPrice[require('sequelize').Op.gte] = minPrice;
      if (maxPrice) where.finalPrice[require('sequelize').Op.lte] = maxPrice;
    }
    
    const listings = await Listing.findAll({ where });
    
    res.json({ savedSearch, results: listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update saved search
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, searchCriteria, notifyOnMatch } = req.body;
    
    const savedSearch = await SavedSearch.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    // Update fields
    if (name !== undefined) savedSearch.name = name;
    if (searchCriteria !== undefined) savedSearch.searchCriteria = searchCriteria;
    if (notifyOnMatch !== undefined) savedSearch.notifyOnMatch = notifyOnMatch;
    
    await savedSearch.save();
    
    res.json(savedSearch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete saved search
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await SavedSearch.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    res.json({ message: 'Saved search deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
