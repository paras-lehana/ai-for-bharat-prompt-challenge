/**
 * FILE: backend/src/services/AdvisoryService.js
 * 
 * PURPOSE: Multilingual crop advisory and market intelligence
 * 
 * KEY FUNCTIONS:
 *  - generateMarketInsights() → Analyze market trends and generate insights
 *  - getWeeklyReport() → Generate weekly market summary
 *  - getSeasonalGuidance() → Provide seasonal planting/harvest guidance
 *  - sendNotifications() → Send proactive notifications
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/advisory routes, cron jobs
 *  - Depends on: ENAMPrice, Transaction, Listing models, TranslationService
 */

const { ENAMPrice, Transaction, Listing, User } = require('../models');
const { Op } = require('sequelize');
const TranslationService = require('./TranslationService');
const { createError } = require('../middleware/errorHandler');

class AdvisoryService {
  /**
   * Seasonal guidance data
   */
  static SEASONAL_GUIDANCE = {
    wheat: {
      planting: { months: [10, 11], description: 'Best time for wheat sowing' },
      harvest: { months: [3, 4], description: 'Wheat harvest season' }
    },
    rice: {
      planting: { months: [6, 7], description: 'Monsoon rice planting' },
      harvest: { months: [10, 11], description: 'Rice harvest season' }
    },
    cotton: {
      planting: { months: [5, 6], description: 'Cotton sowing season' },
      harvest: { months: [10, 11, 12], description: 'Cotton picking season' }
    },
    sugarcane: {
      planting: { months: [2, 3, 10, 11], description: 'Sugarcane planting' },
      harvest: { months: [12, 1, 2, 3], description: 'Sugarcane harvest' }
    },
    tomato: {
      planting: { months: [7, 8, 1, 2], description: 'Tomato planting' },
      harvest: { months: [10, 11, 4, 5], description: 'Tomato harvest' }
    },
    onion: {
      planting: { months: [6, 7, 10, 11], description: 'Onion planting' },
      harvest: { months: [12, 1, 4, 5], description: 'Onion harvest' }
    }
  };

  /**
   * Generate market insights for a vendor
   * 
   * @param {string} vendorId - Vendor ID
   * @param {string} cropType - Crop type (optional)
   * @returns {Promise<Object>} - Market insights
   */
  async generateMarketInsights(vendorId, cropType = null) {
    try {
      const vendor = await User.findByPk(vendorId);
      
      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      // Get vendor's active listings
      const listings = await Listing.findAll({
        where: {
          vendorId,
          status: 'active',
          ...(cropType && { cropType: cropType.toLowerCase() })
        }
      });

      if (listings.length === 0) {
        return {
          insights: [],
          message: 'No active listings found'
        };
      }

      const insights = [];

      // Analyze each crop
      for (const listing of listings) {
        const cropInsights = await this._analyzeCropMarket(
          listing.cropType,
          vendor.location,
          vendor.languagePreference
        );
        
        if (cropInsights) {
          insights.push(cropInsights);
        }
      }

      return {
        insights,
        generatedAt: new Date()
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error generating market insights:', error);
      throw createError('Failed to generate market insights', 500);
    }
  }

  /**
   * Analyze market for a specific crop
   * @private
   */
  async _analyzeCropMarket(cropType, location, language) {
    try {
      // Get recent eNAM prices
      const recentPrices = await ENAMPrice.findAll({
        where: {
          cropType: cropType.toLowerCase(),
          updatedAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        order: [['updatedAt', 'DESC']],
        limit: 30
      });

      if (recentPrices.length < 2) {
        return null;
      }

      // Calculate price trend
      const latestPrice = recentPrices[0].modalPrice;
      const oldestPrice = recentPrices[recentPrices.length - 1].modalPrice;
      const priceChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;

      // Get recent transaction volume
      const recentTransactions = await Transaction.count({
        where: {
          createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: { [Op.in]: ['confirmed', 'in_transit', 'delivered'] }
        },
        include: [
          {
            model: Listing,
            as: 'listing',
            where: { cropType: cropType.toLowerCase() },
            required: true
          }
        ]
      });

      // Generate insights
      const insights = {
        cropType,
        currentPrice: latestPrice,
        priceChange: Math.round(priceChange * 10) / 10,
        trend: priceChange > 5 ? 'increasing' : priceChange < -5 ? 'decreasing' : 'stable',
        demand: recentTransactions > 10 ? 'high' : recentTransactions > 5 ? 'medium' : 'low',
        recommendations: []
      };

      // Add recommendations
      if (insights.trend === 'increasing') {
        insights.recommendations.push({
          type: 'price_increase',
          message: `${cropType} prices are rising. Good time to sell.`,
          priority: 'high'
        });
      }

      if (insights.trend === 'decreasing') {
        insights.recommendations.push({
          type: 'price_drop',
          message: `${cropType} prices are falling. Consider selling soon.`,
          priority: 'medium'
        });
      }

      if (insights.demand === 'high') {
        insights.recommendations.push({
          type: 'high_demand',
          message: `High demand for ${cropType}. Buyers are actively looking.`,
          priority: 'high'
        });
      }

      // Translate to vendor's language
      if (language !== 'en') {
        for (const rec of insights.recommendations) {
          rec.message = await TranslationService.translateText(rec.message, 'en', language);
        }
      }

      return insights;
    } catch (error) {
      console.error('Error analyzing crop market:', error);
      return null;
    }
  }

  /**
   * Generate weekly market report for a vendor
   * 
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Weekly report
   */
  async getWeeklyReport(vendorId) {
    try {
      const vendor = await User.findByPk(vendorId);
      
      if (!vendor) {
        throw createError('Vendor not found', 404);
      }

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Get vendor's transactions this week
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          createdAt: { [Op.gte]: sevenDaysAgo },
          status: { [Op.in]: ['confirmed', 'in_transit', 'delivered'] }
        },
        include: [
          {
            model: Listing,
            as: 'listing',
            attributes: ['cropType', 'qualityTier']
          }
        ]
      });

      // Calculate summary
      const totalSales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
      const totalOrders = transactions.length;
      
      const cropSales = {};
      for (const transaction of transactions) {
        const crop = transaction.listing.cropType;
        cropSales[crop] = (cropSales[crop] || 0) + transaction.totalAmount;
      }

      const topCrop = Object.keys(cropSales).reduce((a, b) => 
        cropSales[a] > cropSales[b] ? a : b, Object.keys(cropSales)[0]
      );

      // Get market insights
      const insights = await this.generateMarketInsights(vendorId);

      const report = {
        period: {
          start: sevenDaysAgo,
          end: new Date()
        },
        summary: {
          totalSales,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0,
          topSellingCrop: topCrop || 'N/A'
        },
        salesByCrop: cropSales,
        marketInsights: insights.insights,
        generatedAt: new Date()
      };

      // Translate to vendor's language
      if (vendor.languagePreference !== 'en') {
        // Translation would happen here
      }

      return report;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error generating weekly report:', error);
      throw createError('Failed to generate weekly report', 500);
    }
  }

  /**
   * Get seasonal guidance for a crop
   * 
   * @param {string} cropType - Crop type
   * @param {string} language - Language preference
   * @returns {Promise<Object>} - Seasonal guidance
   */
  async getSeasonalGuidance(cropType, language = 'en') {
    try {
      const guidance = this.SEASONAL_GUIDANCE[cropType.toLowerCase()];

      if (!guidance) {
        return {
          cropType,
          message: 'Seasonal guidance not available for this crop',
          available: false
        };
      }

      const currentMonth = new Date().getMonth() + 1; // 1-12

      // Check if current month is planting or harvest season
      let currentSeason = null;
      let nextSeason = null;

      if (guidance.planting.months.includes(currentMonth)) {
        currentSeason = {
          type: 'planting',
          description: guidance.planting.description
        };
      } else if (guidance.harvest.months.includes(currentMonth)) {
        currentSeason = {
          type: 'harvest',
          description: guidance.harvest.description
        };
      }

      // Find next season
      const allSeasons = [
        { type: 'planting', months: guidance.planting.months, description: guidance.planting.description },
        { type: 'harvest', months: guidance.harvest.months, description: guidance.harvest.description }
      ];

      for (const season of allSeasons) {
        const nextMonth = season.months.find(m => m > currentMonth) || season.months[0];
        if (!nextSeason || nextMonth < nextSeason.month) {
          nextSeason = {
            type: season.type,
            month: nextMonth,
            description: season.description
          };
        }
      }

      const result = {
        cropType,
        currentMonth,
        currentSeason,
        nextSeason,
        available: true
      };

      // Translate to requested language
      if (language !== 'en') {
        if (currentSeason) {
          currentSeason.description = await TranslationService.translateText(
            currentSeason.description,
            'en',
            language
          );
        }
        if (nextSeason) {
          nextSeason.description = await TranslationService.translateText(
            nextSeason.description,
            'en',
            language
          );
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting seasonal guidance:', error);
      throw createError('Failed to get seasonal guidance', 500);
    }
  }

  /**
   * Send proactive notifications to vendors
   * This would be called by a cron job
   * 
   * @param {string} notificationType - Type of notification
   * @returns {Promise<Object>} - Notification result
   */
  async sendNotifications(notificationType = 'market_change') {
    try {
      // Get all active vendors
      const vendors = await User.findAll({
        where: {
          role: 'vendor',
          isActive: true
        }
      });

      const notifications = [];

      for (const vendor of vendors) {
        // Generate insights for vendor
        const insights = await this.generateMarketInsights(vendor.id);

        // Send notifications for high-priority insights
        for (const insight of insights.insights) {
          for (const rec of insight.recommendations) {
            if (rec.priority === 'high') {
              // TODO: Send SMS or push notification
              notifications.push({
                vendorId: vendor.id,
                message: rec.message,
                type: rec.type,
                sentAt: new Date()
              });
            }
          }
        }
      }

      return {
        success: true,
        notificationsSent: notifications.length,
        notifications
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw createError('Failed to send notifications', 500);
    }
  }
}

module.exports = new AdvisoryService();
