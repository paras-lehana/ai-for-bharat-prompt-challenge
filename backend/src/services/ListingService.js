/**
 * FILE: backend/src/services/ListingService.js
 * 
 * PURPOSE: Manage product listings (CRUD operations)
 * 
 * KEY FUNCTIONS:
 *  - createListing() → Create new listing with price calculation
 *  - updateListing() → Update listing details
 *  - deleteListing() → Delete/deactivate listing
 *  - getListing() → Get single listing with details
 *  - searchListings() → Search with filters and sorting
 *  - getVendorListings() → Get all listings for a vendor
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/listings routes
 *  - Depends on: Listing model, PricingService, User model
 */

const { Listing, User, Negotiation } = require('../models');
const PricingService = require('./PricingService');
const { createError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class ListingService {
  /**
   * Create a new listing
   * 
   * @param {string} vendorId - Vendor user ID
   * @param {Object} listingData - Listing details
   * @returns {Promise<Object>} - Created listing with price calculation
   */
  async createListing(vendorId, listingData) {
    try {
      const {
        cropType,
        quantity,
        unit,
        basePrice,
        qualityTier,
        description,
        images,
        location
      } = listingData;

      // Validate required fields
      if (!cropType || !quantity || !unit || !basePrice || !qualityTier) {
        throw createError('Missing required fields: cropType, quantity, unit, basePrice, qualityTier', 400);
      }

      // Validate quality tier
      const validTiers = ['premium', 'standard', 'basic'];
      if (!validTiers.includes(qualityTier.toLowerCase())) {
        throw createError('Invalid quality tier. Must be: premium, standard, or basic', 400);
      }

      // Calculate final price using PricingService
      const priceCalculation = await PricingService.calculateFinalPrice(
        basePrice,
        qualityTier.toLowerCase(),
        cropType,
        location?.district || 'Delhi'
      );

      // Create listing
      const listing = await Listing.create({
        vendorId,
        cropType,
        quantity,
        unit,
        basePrice,
        finalPrice: priceCalculation.finalPrice,
        qualityTier: qualityTier.toLowerCase(),
        description,
        images: images || [],
        locationLat: location?.latitude,
        locationLng: location?.longitude,
        locationAddress: location?.address,
        locationDistrict: location?.district,
        locationState: location?.state,
        status: 'active',
        priceBreakdown: priceCalculation.breakdown
      });

      return {
        ...listing.toJSON(),
        priceCalculation
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error creating listing:', error);
      throw createError('Failed to create listing', 500);
    }
  }

  /**
   * Update an existing listing
   * 
   * @param {string} listingId - Listing ID
   * @param {string} vendorId - Vendor user ID (for authorization)
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated listing
   */
  async updateListing(listingId, vendorId, updates) {
    try {
      const listing = await Listing.findByPk(listingId);

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      // Verify ownership
      if (listing.vendorId !== vendorId) {
        throw createError('Unauthorized to update this listing', 403);
      }

      // If price or quality tier changed, recalculate final price
      if (updates.basePrice || updates.qualityTier) {
        const newBasePrice = updates.basePrice || listing.basePrice;
        const newQualityTier = updates.qualityTier || listing.qualityTier;

        const priceCalculation = await PricingService.calculateFinalPrice(
          newBasePrice,
          newQualityTier,
          listing.cropType,
          listing.locationDistrict || 'Delhi'
        );

        updates.finalPrice = priceCalculation.finalPrice;
        updates.priceBreakdown = priceCalculation.breakdown;
      }

      // Update listing
      await listing.update(updates);

      return listing;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error updating listing:', error);
      throw createError('Failed to update listing', 500);
    }
  }

  /**
   * Delete/deactivate a listing
   * 
   * @param {string} listingId - Listing ID
   * @param {string} vendorId - Vendor user ID (for authorization)
   * @returns {Promise<Object>} - Success message
   */
  async deleteListing(listingId, vendorId) {
    try {
      const listing = await Listing.findByPk(listingId);

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      // Verify ownership
      if (listing.vendorId !== vendorId) {
        throw createError('Unauthorized to delete this listing', 403);
      }

      // Check for active negotiations
      const activeNegotiations = await Negotiation.count({
        where: {
          listingId,
          status: 'active'
        }
      });

      if (activeNegotiations > 0) {
        // Don't delete, just mark as unavailable
        await listing.update({ status: 'unavailable' });
        return {
          success: true,
          message: 'Listing marked as unavailable (has active negotiations)'
        };
      }

      // Soft delete by marking as deleted
      await listing.update({ status: 'deleted' });

      return {
        success: true,
        message: 'Listing deleted successfully'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error deleting listing:', error);
      throw createError('Failed to delete listing', 500);
    }
  }

  /**
   * Get a single listing by ID
   * 
   * @param {string} listingId - Listing ID
   * @returns {Promise<Object>} - Listing with vendor details
   */
  async getListing(listingId) {
    try {
      const listing = await Listing.findByPk(listingId, {
        include: [
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'phoneNumber', 'languagePreference']
          }
        ]
      });

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      if (listing.status === 'deleted') {
        throw createError('Listing not found', 404);
      }

      return listing;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error getting listing:', error);
      throw createError('Failed to get listing', 500);
    }
  }

  /**
   * Search listings with filters and sorting
   * 
   * @param {Object} filters - Search filters
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<Object>} - Listings array and count
   */
  async searchListings(filters = {}, options = {}) {
    try {
      const {
        cropType,
        qualityTier,
        minPrice,
        maxPrice,
        location,
        radius = 50, // km
        vendorId
      } = filters;

      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = options;

      // Build where clause
      const where = {
        status: 'active' // Exclude unavailable and deleted listings
      };

      if (cropType) {
        where.cropType = { [Op.like]: `%${cropType}%` };
      }

      if (qualityTier) {
        where.qualityTier = qualityTier.toLowerCase();
      }

      if (minPrice || maxPrice) {
        where.finalPrice = {};
        if (minPrice) where.finalPrice[Op.gte] = minPrice;
        if (maxPrice) where.finalPrice[Op.lte] = maxPrice;
      }

      if (vendorId) {
        where.vendorId = vendorId;
      }

      // TODO: Implement location-based filtering using Haversine formula
      // For MVP, we'll skip location filtering

      // Execute query
      const { count, rows: listings } = await Listing.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'phoneNumber', 'languagePreference']
          }
        ],
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, sortOrder]]
      });

      return {
        listings,
        count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error searching listings:', error);
      throw createError('Failed to search listings', 500);
    }
  }

  /**
   * Get all active listings for a vendor
   * 
   * @param {string} vendorId - Vendor user ID
   * @returns {Promise<Array>} - Array of listings
   */
  async getVendorListings(vendorId) {
    try {
      const listings = await Listing.findAll({
        where: {
          vendorId,
          status: 'active'
        },
        order: [['createdAt', 'DESC']]
      });

      return listings;
    } catch (error) {
      console.error('Error getting vendor listings:', error);
      throw createError('Failed to get vendor listings', 500);
    }
  }

  /**
   * Update listing status
   * 
   * @param {string} listingId - Listing ID
   * @param {string} vendorId - Vendor user ID
   * @param {string} status - New status (active, unavailable, sold)
   * @returns {Promise<Object>} - Updated listing
   */
  async updateStatus(listingId, vendorId, status) {
    try {
      const listing = await Listing.findByPk(listingId);

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      // Verify ownership
      if (listing.vendorId !== vendorId) {
        throw createError('Unauthorized to update this listing', 403);
      }

      const validStatuses = ['active', 'unavailable', 'sold'];
      if (!validStatuses.includes(status)) {
        throw createError('Invalid status', 400);
      }

      await listing.update({ status });

      return listing;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error updating listing status:', error);
      throw createError('Failed to update listing status', 500);
    }
  }
}

module.exports = new ListingService();
