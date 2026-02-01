const express = require('express');
const router = express.Router();
const PriceAlert = require('../models/PriceAlert');
const Listing = require('../models/Listing');
const ENAMPrice = require('../models/ENAMPrice');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all price alerts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const alerts = await PriceAlert.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active price alerts for user
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const alerts = await PriceAlert.findAll({
      where: { 
        userId: req.user.id,
        isActive: true
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create price alert
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cropType, targetPrice, alertType, location, notificationMethod } = req.body;
    
    // Validation
    if (!cropType || !targetPrice || !alertType) {
      return res.status(400).json({ 
        error: 'cropType, targetPrice, and alertType are required' 
      });
    }
    
    if (!['below', 'above'].includes(alertType)) {
      return res.status(400).json({ 
        error: 'alertType must be either "below" or "above"' 
      });
    }
    
    if (targetPrice <= 0) {
      return res.status(400).json({ 
        error: 'targetPrice must be greater than 0' 
      });
    }
    
    const alert = await PriceAlert.create({
      userId: req.user.id,
      cropType,
      targetPrice,
      alertType,
      location: location || null,
      notificationMethod: notificationMethod || 'in-app',
      isActive: true
    });
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single price alert
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!alert) {
      return res.status(404).json({ error: 'Price alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update price alert
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { targetPrice, alertType, location, notificationMethod, isActive } = req.body;
    
    const alert = await PriceAlert.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!alert) {
      return res.status(404).json({ error: 'Price alert not found' });
    }
    
    // Update fields
    if (targetPrice !== undefined) {
      if (targetPrice <= 0) {
        return res.status(400).json({ error: 'targetPrice must be greater than 0' });
      }
      alert.targetPrice = targetPrice;
    }
    if (alertType !== undefined) {
      if (!['below', 'above'].includes(alertType)) {
        return res.status(400).json({ error: 'alertType must be either "below" or "above"' });
      }
      alert.alertType = alertType;
    }
    if (location !== undefined) alert.location = location;
    if (notificationMethod !== undefined) alert.notificationMethod = notificationMethod;
    if (isActive !== undefined) alert.isActive = isActive;
    
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete price alert
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await PriceAlert.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Price alert not found' });
    }
    
    res.json({ message: 'Price alert deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check alerts (manual trigger for testing)
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const alerts = await PriceAlert.findAll({
      where: { 
        userId: req.user.id,
        isActive: true
      }
    });
    
    const triggeredAlerts = [];
    
    for (const alert of alerts) {
      // Get current price for the crop
      const currentPrice = await getCurrentPrice(alert.cropType, alert.location);
      
      if (currentPrice) {
        let shouldTrigger = false;
        
        if (alert.alertType === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.alertType === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        }
        
        if (shouldTrigger) {
          // Update last triggered
          alert.lastTriggered = new Date();
          await alert.save();
          
          triggeredAlerts.push({
            alert,
            currentPrice,
            message: `Price alert triggered! ${alert.cropType} is now ₹${currentPrice}/quintal (target: ₹${alert.targetPrice})`
          });
        }
      }
    }
    
    res.json({ 
      checked: alerts.length,
      triggered: triggeredAlerts.length,
      alerts: triggeredAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get triggered alerts (for in-app notifications)
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const PriceAlertService = require('../services/PriceAlertService');
    const notifications = await PriceAlertService.getTriggeredAlertsForUser(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get current price
async function getCurrentPrice(cropType, location) {
  try {
    // First try to get from active listings
    const listings = await Listing.findAll({
      where: { 
        cropType,
        status: 'available'
      },
      attributes: ['finalPrice'],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    
    if (listings.length > 0) {
      // Calculate average price from recent listings
      const sum = listings.reduce((acc, listing) => acc + parseFloat(listing.finalPrice), 0);
      return sum / listings.length;
    }
    
    // Fallback to eNAM prices
    const enamPrice = await ENAMPrice.findOne({
      where: { cropType },
      order: [['timestamp', 'DESC']]
    });
    
    if (enamPrice) {
      return parseFloat(enamPrice.modalPrice);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current price:', error);
    return null;
  }
}

module.exports = router;
