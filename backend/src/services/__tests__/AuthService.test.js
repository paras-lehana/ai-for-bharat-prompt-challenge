/**
 * FILE: backend/src/services/__tests__/AuthService.test.js
 * 
 * PURPOSE: Unit tests for AuthService
 * 
 * TESTS:
 *  - Profile update functionality
 *  - Language preference persistence
 *  - Validation of profile updates
 */

const AuthService = require('../AuthService');
const { User } = require('../../models');
const { sequelize } = require('../../utils/database');

describe('AuthService - Profile Management', () => {
  beforeAll(async () => {
    // Ensure database is initialized
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('updateProfile', () => {
    let testUser;

    beforeEach(async () => {
      // Create a test user
      testUser = await User.create({
        phoneNumber: '+919876543210',
        role: 'vendor',
        languagePreference: 'hi',
        name: 'Test User'
      });
    });

    test('should update user name successfully', async () => {
      const updates = {
        name: 'Updated Name'
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.name).toBe('Updated Name');
      expect(result.id).toBe(testUser.id);
      expect(result.phoneNumber).toBe(testUser.phoneNumber);
    });

    test('should update language preference successfully (Requirement 1.5)', async () => {
      const updates = {
        languagePreference: 'ta'
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.languagePreference).toBe('ta');
      
      // Verify persistence in database
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.languagePreference).toBe('ta');
    });

    test('should update location information successfully', async () => {
      const updates = {
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'New Delhi, India',
          district: 'Central Delhi',
          state: 'Delhi'
        }
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.location.latitude).toBe(28.6139);
      expect(result.location.longitude).toBe(77.2090);
      expect(result.location.address).toBe('New Delhi, India');
      expect(result.location.district).toBe('Central Delhi');
      expect(result.location.state).toBe('Delhi');
    });

    test('should update multiple fields at once (Requirement 1.6)', async () => {
      const updates = {
        name: 'New Name',
        languagePreference: 'mr',
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
          address: 'Mumbai, India',
          district: 'Mumbai',
          state: 'Maharashtra'
        }
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.name).toBe('New Name');
      expect(result.languagePreference).toBe('mr');
      expect(result.location.latitude).toBe(19.0760);
      expect(result.location.address).toBe('Mumbai, India');

      // Verify all changes persisted
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.languagePreference).toBe('mr');
      expect(updatedUser.locationLat).toBe(19.0760);
    });

    test('should handle partial updates without affecting other fields', async () => {
      const updates = {
        name: 'Only Name Changed'
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.name).toBe('Only Name Changed');
      expect(result.languagePreference).toBe('hi'); // Should remain unchanged
      expect(result.phoneNumber).toBe('+919876543210'); // Should remain unchanged
    });

    test('should throw error for non-existent user', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const updates = { name: 'Test' };

      await expect(
        AuthService.updateProfile(fakeUserId, updates)
      ).rejects.toThrow('User not found');
    });

    test('should ignore undefined values in updates', async () => {
      const updates = {
        name: 'New Name',
        languagePreference: undefined
      };

      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result.name).toBe('New Name');
      expect(result.languagePreference).toBe('hi'); // Should remain unchanged
    });

    test('should return complete user object with location', async () => {
      // First set location
      await testUser.update({
        locationLat: 12.9716,
        locationLng: 77.5946,
        locationAddress: 'Bangalore, India',
        locationDistrict: 'Bangalore Urban',
        locationState: 'Karnataka'
      });

      const updates = { name: 'Updated' };
      const result = await AuthService.updateProfile(testUser.id, updates);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('phoneNumber');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('languagePreference');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('location');
      expect(result.location).toHaveProperty('latitude');
      expect(result.location).toHaveProperty('longitude');
      expect(result.location).toHaveProperty('address');
    });

    test('should persist language preference changes immediately (Requirement 1.6)', async () => {
      const updates = {
        languagePreference: 'te'
      };

      await AuthService.updateProfile(testUser.id, updates);

      // Fetch fresh from database
      const freshUser = await User.findByPk(testUser.id);
      expect(freshUser.languagePreference).toBe('te');
    });

    test('should support all configured languages', async () => {
      const languages = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'pa'];

      for (const lang of languages) {
        const result = await AuthService.updateProfile(testUser.id, {
          languagePreference: lang
        });
        expect(result.languagePreference).toBe(lang);
      }
    });
  });
});
