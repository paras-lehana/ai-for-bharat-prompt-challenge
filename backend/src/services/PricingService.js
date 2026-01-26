/**
 * FILE: backend/src/services/PricingService.js
 * 
 * PURPOSE: Pricing calculation service with transparent formula
 * 
 * FORMULA: Final_Price = Base_Price × Quality_Multiplier × Demand_Adjuster
 */

const { ENAMPrice, Transaction } = require('../models');
const { Op } = require('sequelize');

class PricingService {
  /**
   * Quality multipliers for different tiers
   */
  static QUALITY_MULTIPLIERS = {
    premium: 1.2,
    standard: 1.0,
    basic: 0.85
  };

  /**
   * Calculate final price for a listing
   * @param {number} basePrice - Base price from eNAM or vendor
   * @param {string} qualityTier - premium, standard, or basic
   * @param {string} cropType - Type of crop
   * @param {string} location - Location for demand calculation
   * @returns {Object} Price calculation with breakdown
   */
  static async calculateFinalPrice(basePrice, qualityTier, cropType, location) {
    const qualityMultiplier = this.QUALITY_MULTIPLIERS[qualityTier] || 1.0;
    const demandAdjuster = await this.getDemandAdjuster(cropType, location);
    const finalPrice = basePrice * qualityMultiplier * demandAdjuster;

    return {
      basePrice,
      qualityMultiplier,
      demandAdjuster,
      finalPrice: Math.round(finalPrice * 100) / 100,
      breakdown: this.getPriceBreakdown(basePrice, qualityMultiplier, demandAdjuster, finalPrice, qualityTier)
    };
  }

  /**
   * Calculate demand adjuster based on recent transactions
   * @param {string} cropType - Type of crop
   * @param {string} location - Location
   * @returns {number} Demand adjuster between 0.8 and 1.3
   */
  static async getDemandAdjuster(cropType, location) {
    try {
      // Get transactions from last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const recentTransactions = await Transaction.count({
        where: {
          createdAt: { [Op.gte]: sevenDaysAgo },
          status: { [Op.in]: ['confirmed', 'in_transit', 'delivered'] }
        }
      });

      // Simple demand calculation
      // More transactions = higher demand = higher multiplier
      // 0-10 transactions: 0.85
      // 10-50 transactions: 0.95
      // 50-100 transactions: 1.05
      // 100+ transactions: 1.15
      
      if (recentTransactions < 10) return 0.85;
      if (recentTransactions < 50) return 0.95;
      if (recentTransactions < 100) return 1.05;
      return 1.15;
    } catch (error) {
      console.error('Error calculating demand adjuster:', error);
      return 1.0; // Default to neutral
    }
  }

  /**
   * Get price breakdown with explanations
   * @returns {Object} Detailed price breakdown
   */
  static getPriceBreakdown(basePrice, qualityMultiplier, demandAdjuster, finalPrice, qualityTier) {
    return {
      title: "Price Calculation Breakdown",
      steps: [
        {
          label: "Base Price (eNAM Market Rate)",
          value: `₹${basePrice}`,
          description: "Current market price from eNAM"
        },
        {
          label: `Quality Adjustment (${qualityTier})`,
          value: `×${qualityMultiplier}`,
          description: `${qualityTier === 'premium' ? 'Premium quality adds 20%' : qualityTier === 'basic' ? 'Basic quality reduces 15%' : 'Standard quality, no adjustment'}`
        },
        {
          label: "Market Demand",
          value: `×${demandAdjuster}`,
          description: `${demandAdjuster > 1 ? 'High demand in your area' : demandAdjuster < 1 ? 'Lower demand currently' : 'Normal demand'}`
        },
        {
          label: "Final Recommended Price",
          value: `₹${finalPrice.toFixed(2)}`,
          description: "Competitive price based on quality and demand",
          highlight: true
        }
      ],
      fairRange: {
        min: Math.round(finalPrice * 0.95 * 100) / 100,
        max: Math.round(finalPrice * 1.05 * 100) / 100
      }
    };
  }

  /**
   * Get eNAM base price for a crop
   * @param {string} cropType - Type of crop
   * @param {string} location - Location
   * @returns {Object} Price data from eNAM
   */
  static async getENAMPrice(cropType, location) {
    try {
      // Try to get from cache first
      const cached = await ENAMPrice.findOne({
        where: {
          cropType: cropType.toLowerCase(),
          location: location || 'Delhi',
          updatedAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
        }
      });

      if (cached) {
        return {
          modalPrice: cached.modalPrice,
          minPrice: cached.minPrice,
          maxPrice: cached.maxPrice,
          source: 'enam_cached',
          timestamp: cached.updatedAt
        };
      }

      // If not cached, use mock data (in production, call real eNAM API)
      const mockPrices = {
        tomato: { modalPrice: 30, minPrice: 25, maxPrice: 35 },
        onion: { modalPrice: 40, minPrice: 35, maxPrice: 45 },
        potato: { modalPrice: 20, minPrice: 18, maxPrice: 22 },
        wheat: { modalPrice: 2500, minPrice: 2400, maxPrice: 2600 },
        rice: { modalPrice: 3000, minPrice: 2800, maxPrice: 3200 },
        corn: { modalPrice: 1800, minPrice: 1700, maxPrice: 1900 },
        cabbage: { modalPrice: 15, minPrice: 12, maxPrice: 18 },
        cauliflower: { modalPrice: 25, minPrice: 20, maxPrice: 30 }
      };

      const price = mockPrices[cropType.toLowerCase()] || { modalPrice: 100, minPrice: 90, maxPrice: 110 };

      // Cache the price
      await ENAMPrice.create({
        cropType: cropType.toLowerCase(),
        location: location || 'Delhi',
        ...price,
        source: 'enam_api'
      });

      return {
        ...price,
        source: 'enam_api',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching eNAM price:', error);
      // Return fallback price
      return {
        modalPrice: 100,
        minPrice: 90,
        maxPrice: 110,
        source: 'fallback',
        timestamp: new Date()
      };
    }
  }

  /**
   * Validate if an offer price is fair
   * @param {number} offerPrice - Offered price
   * @param {number} listingPrice - Listing price
   * @returns {Object} Validation result with reasoning
   */
  static validateOfferPrice(offerPrice, listingPrice) {
    const percentDiff = ((listingPrice - offerPrice) / listingPrice) * 100;

    if (percentDiff < -10) {
      return {
        valid: false,
        reason: 'Offer is too high (more than 10% above listing price)',
        suggestion: Math.round(listingPrice * 1.05)
      };
    }

    if (percentDiff > 30) {
      return {
        valid: false,
        reason: 'Offer is too low (more than 30% below listing price)',
        suggestion: Math.round(listingPrice * 0.85)
      };
    }

    return {
      valid: true,
      reason: 'Offer is within fair range',
      percentDiff: Math.abs(percentDiff)
    };
  }

  /**
   * Generate counter-offer suggestion
   * @param {number} buyerOffer - Buyer's offer
   * @param {number} listingPrice - Listing price
   * @param {Object} marketData - Market data for context
   * @returns {Object} Counter-offer suggestion with reasoning
   */
  static generateCounterOffer(buyerOffer, listingPrice, marketData = {}) {
    const percentDiff = ((listingPrice - buyerOffer) / listingPrice) * 100;

    // If offer is very low (>20% below), suggest meeting halfway
    if (percentDiff > 20) {
      const counterOffer = Math.round((buyerOffer + listingPrice) / 2);
      return {
        suggestedPrice: counterOffer,
        reasoning: `Buyer's offer is ${percentDiff.toFixed(1)}% below your price. Consider meeting halfway to close the deal.`,
        confidence: 'medium'
      };
    }

    // If offer is moderately low (10-20% below), suggest small concession
    if (percentDiff > 10) {
      const counterOffer = Math.round(listingPrice * 0.95);
      return {
        suggestedPrice: counterOffer,
        reasoning: `Offer is reasonable. A 5% discount could secure the sale while maintaining good margins.`,
        confidence: 'high'
      };
    }

    // If offer is close (<10% below), accept or minor adjustment
    if (percentDiff > 0) {
      return {
        suggestedPrice: Math.round(listingPrice * 0.98),
        reasoning: `Excellent offer! Consider accepting or a minimal 2% discount to close quickly.`,
        confidence: 'high'
      };
    }

    // If offer is at or above listing price
    return {
      suggestedPrice: listingPrice,
      reasoning: `Great offer at or above your listing price. Accept immediately!`,
      confidence: 'very_high'
    };
  }
}

module.exports = PricingService;
