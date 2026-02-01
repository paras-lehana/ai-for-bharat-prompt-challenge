/**
 * FILE: backend/src/routes/integration.js
 * 
 * PURPOSE: API routes for eNAM, ODOP, and GeM integration
 * 
 * ENDPOINTS:
 *  - GET /api/integration/odop/check - Check if product is ODOP
 *  - GET /api/integration/gem/guide - Get GeM documentation guide
 *  - POST /api/integration/enam/sync - Sync transaction to eNAM
 *  - PUT /api/integration/enam/preference - Update eNAM sync preference
 */

const express = require('express');
const router = express.Router();
const IntegrationService = require('../services/IntegrationService');
const { authenticateToken } = require('../middleware/auth');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Check if a product is ODOP-registered
 * GET /api/integration/odop/check?cropType=onion&district=Nashik
 */
router.get('/odop/check', asyncHandler(async (req, res) => {
  const { cropType, district } = req.query;

  if (!cropType || !district) {
    return res.status(400).json({
      success: false,
      message: 'cropType and district are required'
    });
  }

  const badgeInfo = IntegrationService.getODOPBadgeInfo(cropType, district);

  res.json({
    success: true,
    ...badgeInfo
  });
}));

/**
 * Get ODOP districts for a crop
 * GET /api/integration/odop/districts?cropType=onion
 */
router.get('/odop/districts', asyncHandler(async (req, res) => {
  const { cropType } = req.query;

  if (!cropType) {
    return res.status(400).json({
      success: false,
      message: 'cropType is required'
    });
  }

  const districts = IntegrationService.getODOPDistrictsForCrop(cropType);

  res.json({
    success: true,
    cropType,
    districts,
    count: districts.length
  });
}));

/**
 * Get GeM documentation guide
 * GET /api/integration/gem/guide?language=hi
 */
router.get('/gem/guide', asyncHandler(async (req, res) => {
  const { language = 'en' } = req.query;

  const guide = IntegrationService.getGeMDocumentationGuide(language);

  res.json({
    success: true,
    guide
  });
}));

/**
 * Sync transaction to eNAM
 * POST /api/integration/enam/sync
 * Body: { transactionId }
 */
router.post('/enam/sync', authenticateToken, asyncHandler(async (req, res) => {
  const { transactionId } = req.body;
  const userId = req.user.id;

  if (!transactionId) {
    return res.status(400).json({
      success: false,
      message: 'transactionId is required'
    });
  }

  const result = await IntegrationService.syncTransactionToENAM(transactionId, userId);

  res.json(result);
}));

/**
 * Update eNAM sync preference
 * PUT /api/integration/enam/preference
 * Body: { enabled: true/false }
 */
router.put('/enam/preference', authenticateToken, asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  const userId = req.user.id;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'enabled must be a boolean value'
    });
  }

  const result = await IntegrationService.updateENAMSyncPreference(userId, enabled);

  res.json(result);
}));

/**
 * Get user's eNAM sync status
 * GET /api/integration/enam/status
 */
router.get('/enam/status', authenticateToken, asyncHandler(async (req, res) => {
  const { User } = require('../models');
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    enamDataSync: user.enamDataSync || false
  });
}));

module.exports = router;
