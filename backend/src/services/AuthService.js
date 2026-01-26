/**
 * FILE: backend/src/services/AuthService.js
 * 
 * PURPOSE: Handle user authentication via OTP
 * 
 * KEY FUNCTIONS:
 *  - sendOTP() → Generate and send OTP to phone
 *  - verifyOTP() → Verify OTP and create session
 *  - generateToken() → Create JWT token
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/auth routes
 *  - Depends on: User, OTP models
 */

const jwt = require('jsonwebtoken');
const { User, OTP } = require('../models');
const { createError } = require('../middleware/errorHandler');

class AuthService {
  /**
   * Generate 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone number
   * For MVP, we mock SMS sending
   * 
   * @param {string} phoneNumber - Phone number in format +91XXXXXXXXXX
   * @returns {Promise<{success: boolean, expiresAt: Date, otp: string}>}
   */
  async sendOTP(phoneNumber) {
    try {
      // Generate OTP
      const otpCode = this.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Delete any existing OTPs for this phone
      await OTP.destroy({ where: { phoneNumber } });

      // Store OTP in database
      await OTP.create({
        phoneNumber,
        otpCode,
        expiresAt,
        verified: false,
        attempts: 0
      });

      // TODO: In production, send actual SMS via Twilio/other provider
      console.log(`📱 OTP for ${phoneNumber}: ${otpCode}`);

      return {
        success: true,
        expiresAt,
        // For MVP, return OTP in response (REMOVE IN PRODUCTION!)
        otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw createError('Failed to send OTP', 500);
    }
  }

  /**
   * Verify OTP and create/update user
   * 
   * @param {string} phoneNumber - Phone number
   * @param {string} otpCode - OTP code to verify
   * @param {Object} userData - Optional user data (role, language, name)
   * @returns {Promise<{token: string, user: Object}>}
   */
  async verifyOTP(phoneNumber, otpCode, userData = {}) {
    try {
      // Find OTP record
      const otpRecord = await OTP.findOne({
        where: { phoneNumber, verified: false },
        order: [['createdAt', 'DESC']]
      });

      if (!otpRecord) {
        throw createError('OTP not found or already used', 400);
      }

      // Check expiration
      if (new Date() > otpRecord.expiresAt) {
        throw createError('OTP expired', 400);
      }

      // Check attempts
      if (otpRecord.attempts >= 3) {
        throw createError('Maximum OTP attempts exceeded', 429);
      }

      // Verify OTP
      if (otpRecord.otpCode !== otpCode) {
        // Increment attempts
        await otpRecord.update({ attempts: otpRecord.attempts + 1 });
        throw createError('Invalid OTP', 400);
      }

      // Mark OTP as verified
      await otpRecord.update({ verified: true });

      // Find or create user
      let user = await User.findOne({ where: { phoneNumber } });

      if (!user) {
        // New user - require role
        if (!userData.role) {
          throw createError('Role required for new user', 400);
        }

        user = await User.create({
          phoneNumber,
          role: userData.role,
          languagePreference: userData.languagePreference || 'hi',
          name: userData.name,
          locationLat: userData.location?.latitude,
          locationLng: userData.location?.longitude,
          locationAddress: userData.location?.address,
          locationDistrict: userData.location?.district,
          locationState: userData.location?.state
        });
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          role: user.role,
          languagePreference: user.languagePreference,
          name: user.name
        }
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error verifying OTP:', error);
      throw createError('Failed to verify OTP', 500);
    }
  }

  /**
   * Generate JWT token for user
   * 
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      languagePreference: user.languagePreference
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  /**
   * Update user profile
   * 
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} - Updated user
   */
  async updateProfile(userId, updates) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw createError('User not found', 404);
      }

      // Update allowed fields
      const allowedUpdates = {
        name: updates.name,
        languagePreference: updates.languagePreference,
        locationLat: updates.location?.latitude,
        locationLng: updates.location?.longitude,
        locationAddress: updates.location?.address,
        locationDistrict: updates.location?.district,
        locationState: updates.location?.state
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => 
        allowedUpdates[key] === undefined && delete allowedUpdates[key]
      );

      await user.update(allowedUpdates);

      return {
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
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error updating profile:', error);
      throw createError('Failed to update profile', 500);
    }
  }
}

module.exports = new AuthService();
