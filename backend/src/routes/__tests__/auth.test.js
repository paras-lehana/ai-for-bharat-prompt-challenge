/**
 * FILE: backend/src/routes/__tests__/auth.test.js
 * 
 * PURPOSE: Integration tests for authentication routes
 * 
 * TESTS:
 *  - PUT /api/auth/profile endpoint
 *  - Profile update validation
 *  - Authentication middleware
 */

const request = require('supertest');
const express = require('express');
const authRoutes = require('../auth');
const { User, OTP } = require('../../models');
const { sequelize } = require('../../utils/database');
const AuthService = require('../../services/AuthService');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes - Profile Management', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up
    await User.destroy({ where: {}, truncate: true });
    await OTP.destroy({ where: {}, truncate: true });

    // Create test user
    testUser = await User.create({
      phoneNumber: '+919876543210',
      role: 'vendor',
      languagePreference: 'hi',
      name: 'Test User'
    });

    // Generate auth token
    authToken = AuthService.generateToken(testUser);
  });

  describe('PUT /api/auth/profile', () => {
    test('should update profile with valid token and data', async () => {
      const updates = {
        name: 'Updated Name',
        languagePreference: 'ta'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.languagePreference).toBe('ta');
      expect(response.body.id).toBe(testUser.id);
    });

    test('should update language preference (Requirement 1.5)', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ languagePreference: 'mr' })
        .expect(200);

      expect(response.body.languagePreference).toBe('mr');

      // Verify persistence
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.languagePreference).toBe('mr');
    });

    test('should update location information', async () => {
      const updates = {
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'New Delhi, India',
          district: 'Central Delhi',
          state: 'Delhi'
        }
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.location.latitude).toBe(28.6139);
      expect(response.body.location.address).toBe('New Delhi, India');
    });

    test('should reject request without authentication token', async () => {
      const updates = { name: 'Test' };

      const response = await request(app)
        .put('/api/auth/profile')
        .send(updates)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    test('should reject invalid language preference', async () => {
      const updates = {
        languagePreference: 'invalid_lang'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('should reject invalid location coordinates', async () => {
      const updates = {
        location: {
          latitude: 999, // Invalid
          longitude: 77.2090,
          address: 'Test'
        }
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('should validate and persist changes immediately (Requirement 1.6)', async () => {
      const updates = {
        name: 'Immediate Update',
        languagePreference: 'te'
      };

      await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      // Verify immediate persistence
      const freshUser = await User.findByPk(testUser.id);
      expect(freshUser.name).toBe('Immediate Update');
      expect(freshUser.languagePreference).toBe('te');
    });

    test('should handle partial updates', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Only Name' })
        .expect(200);

      expect(response.body.name).toBe('Only Name');
      expect(response.body.languagePreference).toBe('hi'); // Unchanged
    });

    test('should return complete user profile after update', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body).toHaveProperty('role');
      expect(response.body).toHaveProperty('languagePreference');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('location');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(testUser.id);
      expect(response.body.phoneNumber).toBe(testUser.phoneNumber);
      expect(response.body.languagePreference).toBe(testUser.languagePreference);
    });

    test('should reflect updated language preference', async () => {
      // Update language
      await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ languagePreference: 'kn' })
        .expect(200);

      // Fetch current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.languagePreference).toBe('kn');
    });
  });
});
