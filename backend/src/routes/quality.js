const express = require('express');
const router = express.Router();
const QualityService = require('../services/QualityService');

// Assess quality
router.post('/assess', async (req, res) => {
  try {
    const { imageUrl, cropType } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const assessment = await QualityService.assessQuality(imageUrl, cropType);
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
