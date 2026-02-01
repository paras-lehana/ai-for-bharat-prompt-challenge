const express = require('express');
const router = express.Router();
const PredictionService = require('../services/PredictionService');

// Get prediction
router.get('/:cropType/:location', async (req, res) => {
  try {
    const { cropType, location } = req.params;
    const { days } = req.query; // Optional

    const prediction = await PredictionService.predictPrice(
      cropType, 
      location, 
      days ? parseInt(days) : 7
    );
    
    res.json(prediction);
  } catch (error) {
    if (error.message.includes('Insufficient data')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
