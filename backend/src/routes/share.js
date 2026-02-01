const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { Listing } = require('../models');

// Generate QR code for listing (Data URL format)
router.get('/qr/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Verify listing exists
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/listing/${listingId}`;
    
    const qrCode = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    res.json({ 
      qrCode, 
      url,
      listingId,
      cropType: listing.cropType
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate QR code as PNG image (for download)
router.get('/qr/:listingId/download', async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Verify listing exists
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/listing/${listingId}`;
    
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    
    // Set headers for download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="listing-${listingId}-qr.png"`);
    res.send(qrBuffer);
  } catch (error) {
    console.error('QR download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Track share analytics (optional)
router.post('/track', async (req, res) => {
  try {
    const { listingId, platform } = req.body;
    // In a real app, you'd store this in a ShareAnalytics table
    console.log(`Listing ${listingId} shared on ${platform}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
