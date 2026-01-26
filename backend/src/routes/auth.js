/**
 * FILE: backend/src/routes/auth.js
 * 
 * PURPOSE: Authentication routes
 * 
 * ENDPOINTS:
 *  - POST /api/auth/send-otp - Send OTP to phone
 *  - POST /api/auth/verify-otp - Verify OTP and login
 *  - PUT /api/auth/profile - Update user profile
 *  - GET /api/auth/me - Get current user
 */

const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, phoneNumberSchema, otpSchema, profileUpdateSchema } = require('../utils/validators');

// Send OTP
router.post('/send-otp', asyncHandler(async (req, res) => {
  const { error } = validate(phoneNumberSchema, req.body.phoneNumber);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const result = await AuthService.sendOTP(req.body.phoneNumber);
  res.json(result);
}));

// Verify OTP
router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { phoneNumber, otp, role, languagePreference, name, location } = req.body;

  // Validate phone and OTP
  const phoneValidation = validate(phoneNumberSchema, phoneNumber);
  if (phoneValidation.error) {
    return res.status(400).json({ error: phoneValidation.error.details[0].message });
  }

  const otpValidation = validate(otpSchema, otp);
  if (otpValidation.error) {
    return res.status(400).json({ error: otpValidation.error.details[0].message });
  }

  const result = await AuthService.verifyOTP(phoneNumber, otp, {
    role,
    languagePreference,
    name,
    location
  });

  res.json(result);
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const { User } = require('../models');
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    phoneNumber: user.phoneNumber,
    role: user.role,
    languagePreference: user.languagePreference,
    name: user.name,
    location: {
      latitude: user.locationLat,
      longitude: user.locationLng,
      address: user.locationAddress,
      district: user.locationDistrict,
      state: user.locationState
    }
  });
}));

// Update profile
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const { error } = validate(profileUpdateSchema, req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const result = await AuthService.updateProfile(req.user.id, req.body);
  res.json(result);
}));

module.exports = router;
