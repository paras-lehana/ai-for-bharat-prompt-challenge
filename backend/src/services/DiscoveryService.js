/**
 * FILE: backend/src/services/DiscoveryService.js
 * 
 * PURPOSE: Vendor discovery and micro-aggregation service
 * 
 * KEY FUNCTIONS:
 *  - findNearbyVendors() → Find vendors within radius with same crop
 *  - identifyAggregationOpportunities() → Find vendors for bulk orders
 *  - createAggregatedListing() → Create combined listing
 *  - calculateWeightedPrice() → Calculate aggregated pricing
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/discovery routes
 *  - Depends on: User, Listing, Transaction models
 */

const { User, Listing, Transaction } = require('../models');
const { Op } = require('sequelize');
const { createError } = require('../middleware/errorHandler');

class DiscoveryService {
  /**
   * Find nearby vendors with same crop type
   * Uses Haversine formula for distance calculation
   * 
   * @param {string} vendorId - Current vendor ID
   * @param {string} cropType - Crop type to search for
   * @param {number} radiusKm - Search radius in kilometers (default: 50)
   * @returns {Promise<Array>} - Array of nearby vendors with distance
   */
  async findNearbyVendors(vendorId, cropType, radiusKm = 50) {
    try {
      // Get current vendor's location
      const currentVendor = await User.findByPk(vendorId);
      
      if (!currentVendor || !currentVendor.latitude || !currentVendor.longitude) {
        throw createError('Vendor location not found', 404);
      }

      const { latitude: lat1, longitude: lon1 } = currentVendor;

      // Find all vendors with active listings of the same crop
      const vendors = await User.findAll({
        where: {
          id: { [Op.ne]: vendorId }, // Exclude current vendor
          role: 'vendor',
          latitude: { [Op.ne]: null },
          longitude: { [Op.ne]: null }
        },
        include: [
          {
            model: Listing,
            as: 'listings',
            where: {
              cropType: cropType.toLowerCase(),
              status: 'active'
            },
            required: true
          }
        ]
      });

      // Calculate distances and filter by radius
      const nearbyVendors = vendors
        .map(vendor => {
          const distance = this._calculateDistance(
            lat1,
            lon1,
            vendor.latitude,
            vendor.longitude
          );

          return {
            id: vendor.id,
            name: vendor.name,
            phoneNumber: vendor.phoneNumber,
            location: {
              latitude: vendor.latitude,
              longitude: vendor.longitude,
              address: vendor.location
            },
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal
            trustScore: vendor.trustScore || 0,
            listings: vendor.listings.map(l => ({
              id: l.id,
              cropType: l.cropType,
              quantity: l.quantity,
              unit: l.unit,
              qualityTier: l.qualityTier,
              finalPrice: l.finalPrice
            }))
          };
        })
        .filter(v => v.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance); // Sort by distance

      return nearbyVendors;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error finding nearby vendors:', error);
      throw createError('Failed to find nearby vendors', 500);
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @private
   * @param {number} lat1 - Latitude 1
   * @param {number} lon1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lon2 - Longitude 2
   * @returns {number} - Distance in kilometers
   */
  _calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this._toRad(lat2 - lat1);
    const dLon = this._toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @private
   */
  _toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Identify micro-aggregation opportunities for bulk orders
   * 
   * @param {string} cropType - Crop type
   * @param {number} requiredQuantity - Required quantity for bulk order
   * @param {string} location - Location (lat,lon or address)
   * @param {string} qualityTier - Desired quality tier
   * @returns {Promise<Object>} - Aggregation opportunities
   */
  async identifyAggregationOpportunities(cropType, requiredQuantity, location, qualityTier = null) {
    try {
      // Find all active listings for the crop
      const listings = await Listing.findAll({
        where: {
          cropType: cropType.toLowerCase(),
          status: 'active',
          ...(qualityTier && { qualityTier })
        },
        include: [
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'phoneNumber', 'latitude', 'longitude', 'location', 'trustScore']
          }
        ]
      });

      if (listings.length === 0) {
        return {
          canFulfill: false,
          message: 'No active listings found for this crop'
        };
      }

      // Calculate total available quantity
      const totalAvailable = listings.reduce((sum, l) => sum + l.quantity, 0);

      if (totalAvailable < requiredQuantity) {
        return {
          canFulfill: false,
          message: `Only ${totalAvailable} ${listings[0].unit} available, need ${requiredQuantity} ${listings[0].unit}`,
          availableListings: listings.length
        };
      }

      // Sort by trust score and price
      const sortedListings = listings.sort((a, b) => {
        // Prioritize trust score, then price
        if (b.vendor.trustScore !== a.vendor.trustScore) {
          return b.vendor.trustScore - a.vendor.trustScore;
        }
        return a.finalPrice - b.finalPrice;
      });

      // Select vendors to fulfill the order
      let remainingQuantity = requiredQuantity;
      const selectedVendors = [];
      
      for (const listing of sortedListings) {
        if (remainingQuantity <= 0) break;
        
        const quantityFromVendor = Math.min(listing.quantity, remainingQuantity);
        selectedVendors.push({
          vendorId: listing.vendorId,
          vendorName: listing.vendor.name,
          listingId: listing.id,
          quantity: quantityFromVendor,
          unit: listing.unit,
          pricePerUnit: listing.finalPrice,
          totalPrice: quantityFromVendor * listing.finalPrice,
          qualityTier: listing.qualityTier,
          trustScore: listing.vendor.trustScore
        });
        
        remainingQuantity -= quantityFromVendor;
      }

      // Calculate weighted average price
      const weightedPrice = this.calculateWeightedPrice(selectedVendors);

      return {
        canFulfill: true,
        requiredQuantity,
        selectedVendors,
        totalVendors: selectedVendors.length,
        weightedAveragePrice: weightedPrice,
        totalCost: selectedVendors.reduce((sum, v) => sum + v.totalPrice, 0),
        message: `Order can be fulfilled by ${selectedVendors.length} vendor(s)`
      };
    } catch (error) {
      console.error('Error identifying aggregation opportunities:', error);
      throw createError('Failed to identify aggregation opportunities', 500);
    }
  }

  /**
   * Calculate weighted average price for aggregated listings
   * 
   * @param {Array} vendors - Array of selected vendors with quantities and prices
   * @returns {number} - Weighted average price
   */
  calculateWeightedPrice(vendors) {
    const totalQuantity = vendors.reduce((sum, v) => sum + v.quantity, 0);
    const weightedSum = vendors.reduce((sum, v) => sum + (v.quantity * v.pricePerUnit), 0);
    
    return Math.round((weightedSum / totalQuantity) * 100) / 100;
  }

  /**
   * Create aggregated listing from multiple vendors
   * 
   * @param {string} cropType - Crop type
   * @param {number} totalQuantity - Total quantity
   * @param {string} unit - Unit of measurement
   * @param {Array} participatingVendors - Array of vendor IDs and their contributions
   * @param {string} qualityTier - Quality tier
   * @returns {Promise<Object>} - Created aggregated listing
   */
  async createAggregatedListing(cropType, totalQuantity, unit, participatingVendors, qualityTier) {
    try {
      // Verify all vendors exist and have sufficient quantity
      for (const vendor of participatingVendors) {
        const listing = await Listing.findOne({
          where: {
            id: vendor.listingId,
            vendorId: vendor.vendorId,
            status: 'active'
          }
        });

        if (!listing) {
          throw createError(`Listing ${vendor.listingId} not found or inactive`, 404);
        }

        if (listing.quantity < vendor.quantity) {
          throw createError(`Insufficient quantity for listing ${vendor.listingId}`, 400);
        }
      }

      // Calculate weighted price
      const weightedPrice = this.calculateWeightedPrice(participatingVendors);

      // Create aggregated listing metadata
      const aggregatedListing = {
        type: 'aggregated',
        cropType,
        totalQuantity,
        unit,
        qualityTier,
        weightedPrice,
        participatingVendors: participatingVendors.map(v => ({
          vendorId: v.vendorId,
          vendorName: v.vendorName,
          listingId: v.listingId,
          quantity: v.quantity,
          contribution: Math.round((v.quantity / totalQuantity) * 100)
        })),
        createdAt: new Date()
      };

      // In a real implementation, this would create a new Listing record
      // with type='aggregated' and store vendor contributions
      // For MVP, we return the metadata

      return {
        success: true,
        aggregatedListing,
        message: 'Aggregated listing created successfully'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error creating aggregated listing:', error);
      throw createError('Failed to create aggregated listing', 500);
    }
  }

  /**
   * Distribute payment proportionally to participating vendors
   * 
   * @param {string} aggregatedListingId - Aggregated listing ID
   * @param {number} totalPayment - Total payment received
   * @returns {Promise<Object>} - Payment distribution
   */
  async distributePayment(aggregatedListingId, totalPayment) {
    try {
      // In a real implementation, this would:
      // 1. Get the aggregated listing
      // 2. Calculate each vendor's share based on contribution
      // 3. Create payment records for each vendor
      // 4. Update transaction statuses

      // For MVP, return mock distribution
      return {
        success: true,
        totalPayment,
        distributions: [
          // This would be calculated from actual vendor contributions
        ],
        message: 'Payment distributed successfully'
      };
    } catch (error) {
      console.error('Error distributing payment:', error);
      throw createError('Failed to distribute payment', 500);
    }
  }
}

module.exports = new DiscoveryService();
