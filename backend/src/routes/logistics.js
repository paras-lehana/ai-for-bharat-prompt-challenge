const express = require('express');
const router = express.Router();
const LogisticsService = require('../services/LogisticsService');

// Get shipping estimates
router.post('/estimate', async (req, res) => {
  try {
    const { origin, destination, weight } = req.body;
    const estimates = await LogisticsService.getEstimates(origin, destination, weight || 100);
    res.json(estimates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book shipment
router.post('/book', async (req, res) => {
  try {
    const { provider, transactionId } = req.body;
    const booking = await LogisticsService.bookShipment(provider, transactionId);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
