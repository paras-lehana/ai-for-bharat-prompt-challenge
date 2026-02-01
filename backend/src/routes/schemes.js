/**
 * FILE: backend/src/routes/schemes.js
 * 
 * PURPOSE: API routes for government schemes
 */

const express = require('express');
const router = express.Router();
const SchemeService = require('../services/SchemeService');
const { auth } = require('../middleware/auth');

/**
 * GET /api/schemes
 * Get list of active schemes
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, state, search } = req.query;
    
    let schemes;
    if (search) {
      schemes = await SchemeService.searchSchemes(search);
    } else {
      schemes = await SchemeService.getSchemes({ category, state });
    }
    
    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/schemes/:id
 * Get detail of a specific scheme
 */
router.get('/:id', async (req, res, next) => {
  try {
    const scheme = await SchemeService.getSchemeById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found' });
    }
    res.json({ success: true, data: scheme });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/schemes/seed
 * Seed sample schemes (Admin only, but open for MVP demo)
 */
router.post('/seed', async (req, res, next) => {
  try {
    await SchemeService.seedSampleSchemes();
    res.json({ success: true, message: 'Schemes seeded successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
