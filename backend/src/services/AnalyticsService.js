/**
 * FILE: backend/src/services/AnalyticsService.js
 * 
 * PURPOSE: Analytics and reporting for vendor dashboard
 * 
 * KEY FUNCTIONS:
 *  - getDashboardMetrics() → Get key metrics for vendor dashboard
 *  - getSalesTrends() → Get sales trends over time
 *  - getPricingAnalytics() → Compare prices to regional averages
 *  - getNegotiationAnalytics() → Analyze negotiation success rates
 *  - getBuyerDemographics() → Get buyer location and repeat customer data
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/analytics routes
 *  - Depends on: Transaction, Listing, Negotiation, User, ENAMPrice models
 */

const { Transaction, Listing, Negotiation, User, ENAMPrice, Rating } = require('../models');
const { Op } = require('sequelize');
const { createError } = require('../middleware/errorHandler');

class AnalyticsService {
  /**
   * Get dashboard metrics for a vendor
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Dashboard metrics
   */
  async getDashboardMetrics(vendorId) {
    try {
      const vendor = await User.findByPk(vendorId);
      
      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      // Get total sales
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          status: { [Op.in]: ['delivered', 'in_transit'] }
        }
      });

      const totalSales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);

      // Get active listings count
      const activeListings = await Listing.count({
        where: {
          vendorId,
          status: 'active'
        }
      });

      // Get pending negotiations count
      const pendingNegotiations = await Negotiation.count({
        where: {
          status: 'active'
        },
        include: [
          {
            model: Listing,
            as: 'listing',
            where: { vendorId },
            required: true
          }
        ]
      });

      // Get trust score
      const trustScore = vendor.trustScore || 0;

      // Get sales trends (last 30 days)
      const salesTrends = await this.getSalesTrends(vendorId, 30);

      // Get best-selling crops
      const bestSellingCrops = await this._getBestSellingCrops(vendorId);

      return {
        summary: {
          totalSales: Math.round(totalSales),
          totalTransactions: transactions.length,
          activeListings,
          pendingNegotiations,
          trustScore: Math.round(trustScore * 10) / 10
        },
        salesTrends,
        bestSellingCrops,
        generatedAt: new Date()
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error getting dashboard metrics:', error);
      throw createError('Failed to get dashboard metrics', 500);
    }
  }

  /**
   * Get best-selling crops for a vendor
   * @private
   */
  async _getBestSellingCrops(vendorId) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          status: { [Op.in]: ['delivered', 'in_transit'] }
        },
        include: [
          {
            model: Listing,
            as: 'listing',
            attributes: ['cropType', 'qualityTier']
          }
        ]
      });

      // Group by crop type
      const cropSales = {};
      const cropCounts = {};

      for (const transaction of transactions) {
        const crop = transaction.listing.cropType;
        cropSales[crop] = (cropSales[crop] || 0) + transaction.totalAmount;
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
      }

      // Convert to array and sort
      const crops = Object.keys(cropSales).map(crop => ({
        cropType: crop,
        totalSales: Math.round(cropSales[crop]),
        transactionCount: cropCounts[crop],
        averagePrice: Math.round(cropSales[crop] / cropCounts[crop])
      }));

      crops.sort((a, b) => b.totalSales - a.totalSales);

      return crops.slice(0, 5); // Top 5
    } catch (error) {
      console.error('Error getting best-selling crops:', error);
      return [];
    }
  }

  /**
   * Get sales trends over time
   * 
   * @param {string} vendorId - Vendor ID
   * @param {number} days - Number of days to analyze (default: 30)
   * @returns {Promise<Array>} - Daily sales data
   */
  async getSalesTrends(vendorId, days = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          createdAt: { [Op.gte]: startDate },
          status: { [Op.in]: ['delivered', 'in_transit', 'confirmed'] }
        },
        order: [['createdAt', 'ASC']]
      });

      // Group by date
      const dailySales = {};
      
      for (const transaction of transactions) {
        const date = transaction.createdAt.toISOString().split('T')[0];
        
        if (!dailySales[date]) {
          dailySales[date] = {
            date,
            sales: 0,
            transactions: 0
          };
        }
        
        dailySales[date].sales += transaction.totalAmount;
        dailySales[date].transactions += 1;
      }

      // Convert to array
      const trends = Object.values(dailySales).map(day => ({
        ...day,
        sales: Math.round(day.sales)
      }));

      return trends;
    } catch (error) {
      console.error('Error getting sales trends:', error);
      throw createError('Failed to get sales trends', 500);
    }
  }

  /**
   * Get pricing analytics - compare to regional averages
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Pricing analytics
   */
  async getPricingAnalytics(vendorId) {
    try {
      // Get vendor's active listings
      const listings = await Listing.findAll({
        where: {
          vendorId,
          status: 'active'
        }
      });

      const priceComparisons = [];

      for (const listing of listings) {
        // Get regional average from eNAM
        const enamPrice = await ENAMPrice.findOne({
          where: {
            cropType: listing.cropType.toLowerCase()
          },
          order: [['updatedAt', 'DESC']]
        });

        if (enamPrice) {
          const regionalAverage = enamPrice.modalPrice;
          const vendorPrice = listing.finalPrice;
          const difference = vendorPrice - regionalAverage;
          const percentDifference = Math.round((difference / regionalAverage) * 100);

          priceComparisons.push({
            cropType: listing.cropType,
            qualityTier: listing.qualityTier,
            vendorPrice,
            regionalAverage,
            difference: Math.round(difference),
            percentDifference,
            competitive: Math.abs(percentDifference) <= 10
          });
        }
      }

      return {
        priceComparisons,
        summary: {
          totalListings: listings.length,
          competitivePrices: priceComparisons.filter(p => p.competitive).length,
          averageDifference: priceComparisons.length > 0
            ? Math.round(priceComparisons.reduce((sum, p) => sum + p.percentDifference, 0) / priceComparisons.length)
            : 0
        }
      };
    } catch (error) {
      console.error('Error getting pricing analytics:', error);
      throw createError('Failed to get pricing analytics', 500);
    }
  }

  /**
   * Get negotiation analytics
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Negotiation analytics
   */
  async getNegotiationAnalytics(vendorId) {
    try {
      // Get all negotiations for vendor's listings
      const negotiations = await Negotiation.findAll({
        include: [
          {
            model: Listing,
            as: 'listing',
            where: { vendorId },
            required: true
          }
        ]
      });

      const total = negotiations.length;
      const accepted = negotiations.filter(n => n.status === 'accepted').length;
      const rejected = negotiations.filter(n => n.status === 'rejected').length;
      const expired = negotiations.filter(n => n.status === 'expired').length;
      const active = negotiations.filter(n => n.status === 'active').length;

      // Calculate average discount
      const acceptedNegotiations = negotiations.filter(n => n.status === 'accepted' && n.finalOffer);
      const discounts = acceptedNegotiations.map(n => {
        const listingPrice = n.listing.finalPrice;
        const finalPrice = n.finalOffer;
        return ((listingPrice - finalPrice) / listingPrice) * 100;
      });

      const averageDiscount = discounts.length > 0
        ? Math.round(discounts.reduce((sum, d) => sum + d, 0) / discounts.length)
        : 0;

      return {
        summary: {
          totalNegotiations: total,
          successRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
          averageDiscount,
          averageRounds: Math.round(negotiations.reduce((sum, n) => sum + (n.offerCount || 1), 0) / total) || 1
        },
        breakdown: {
          accepted,
          rejected,
          expired,
          active
        },
        discountDistribution: {
          '0-5%': discounts.filter(d => d >= 0 && d < 5).length,
          '5-10%': discounts.filter(d => d >= 5 && d < 10).length,
          '10-15%': discounts.filter(d => d >= 10 && d < 15).length,
          '15%+': discounts.filter(d => d >= 15).length
        }
      };
    } catch (error) {
      console.error('Error getting negotiation analytics:', error);
      throw createError('Failed to get negotiation analytics', 500);
    }
  }

  /**
   * Get buyer demographics
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Buyer demographics
   */
  async getBuyerDemographics(vendorId) {
    try {
      // Get all transactions
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          status: { [Op.in]: ['delivered', 'in_transit', 'confirmed'] }
        },
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'location', 'district', 'state']
          }
        ]
      });

      // Group by buyer
      const buyerCounts = {};
      const locationCounts = {};

      for (const transaction of transactions) {
        const buyerId = transaction.buyerId;
        buyerCounts[buyerId] = (buyerCounts[buyerId] || 0) + 1;

        const location = transaction.buyer.district || transaction.buyer.state || 'Unknown';
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }

      // Calculate repeat customers
      const totalBuyers = Object.keys(buyerCounts).length;
      const repeatBuyers = Object.values(buyerCounts).filter(count => count > 1).length;
      const repeatRate = totalBuyers > 0 ? Math.round((repeatBuyers / totalBuyers) * 100) : 0;

      // Top locations
      const topLocations = Object.keys(locationCounts)
        .map(location => ({
          location,
          count: locationCounts[location]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        summary: {
          totalBuyers,
          repeatBuyers,
          repeatRate,
          totalTransactions: transactions.length
        },
        topLocations,
        buyerDistribution: {
          oneTime: Object.values(buyerCounts).filter(c => c === 1).length,
          twoToFive: Object.values(buyerCounts).filter(c => c >= 2 && c <= 5).length,
          moreThanFive: Object.values(buyerCounts).filter(c => c > 5).length
        }
      };
    } catch (error) {
      console.error('Error getting buyer demographics:', error);
      throw createError('Failed to get buyer demographics', 500);
    }
  }

  /**
   * Get most profitable quality tiers
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Array>} - Quality tier profitability
   */
  async getProfitableQualityTiers(vendorId) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          status: { [Op.in]: ['delivered', 'in_transit'] }
        },
        include: [
          {
            model: Listing,
            as: 'listing',
            attributes: ['qualityTier', 'cropType']
          }
        ]
      });

      // Group by quality tier
      const tierSales = {};
      const tierCounts = {};

      for (const transaction of transactions) {
        const tier = transaction.listing.qualityTier;
        tierSales[tier] = (tierSales[tier] || 0) + transaction.totalAmount;
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      }

      // Convert to array
      const tiers = Object.keys(tierSales).map(tier => ({
        qualityTier: tier,
        totalSales: Math.round(tierSales[tier]),
        transactionCount: tierCounts[tier],
        averagePrice: Math.round(tierSales[tier] / tierCounts[tier])
      }));

      tiers.sort((a, b) => b.totalSales - a.totalSales);

      return tiers;
    } catch (error) {
      console.error('Error getting profitable quality tiers:', error);
      return [];
    }
  }
}

module.exports = new AnalyticsService();
