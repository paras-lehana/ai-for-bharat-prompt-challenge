/**
 * FILE: backend/src/services/TrustService.js
 * 
 * PURPOSE: Trust score calculation and badge management
 * 
 * FORMULA: Trust Score = 0.4×delivery + 0.3×quality + 0.2×response + 0.1×fair_pricing
 */

const { Rating, TrustScore, Transaction, Message, User } = require('../models');
const { Op } = require('sequelize');

class TrustService {
  /**
   * Calculate trust score for a vendor
   * @param {number} vendorId - Vendor ID
   * @returns {Object} Trust score with breakdown
   */
  static async calculateTrustScore(vendorId) {
    try {
      // Get all ratings for this vendor
      const ratings = await Rating.findAll({
        where: { vendorId },
        include: [{ model: Transaction, as: 'transaction' }]
      });

      if (ratings.length === 0) {
        return {
          overallScore: 0,
          deliveryScore: 0,
          qualityScore: 0,
          responseScore: 0,
          fairPricingScore: 0,
          totalRatings: 0,
          breakdown: 'No ratings yet'
        };
      }

      // Calculate average scores
      const deliveryScore = this.calculateAverageScore(ratings, 'deliveryRating');
      const qualityScore = this.calculateAverageScore(ratings, 'qualityRating');
      const responseScore = await this.calculateResponseScore(vendorId);
      const fairPricingScore = await this.calculateFairPricingScore(vendorId);

      // Calculate weighted overall score
      const overallScore = (
        deliveryScore * 0.4 +
        qualityScore * 0.3 +
        responseScore * 0.2 +
        fairPricingScore * 0.1
      );

      // Update or create trust score record
      await TrustScore.upsert({
        vendorId,
        overallScore: Math.round(overallScore * 100) / 100,
        deliveryScore: Math.round(deliveryScore * 100) / 100,
        qualityScore: Math.round(qualityScore * 100) / 100,
        responseScore: Math.round(responseScore * 100) / 100,
        fairPricingScore: Math.round(fairPricingScore * 100) / 100,
        totalRatings: ratings.length,
        lastCalculated: new Date()
      });

      // Check and award badges
      await this.checkAndAwardBadges(vendorId, overallScore, ratings.length);

      return {
        overallScore: Math.round(overallScore * 100) / 100,
        deliveryScore: Math.round(deliveryScore * 100) / 100,
        qualityScore: Math.round(qualityScore * 100) / 100,
        responseScore: Math.round(responseScore * 100) / 100,
        fairPricingScore: Math.round(fairPricingScore * 100) / 100,
        totalRatings: ratings.length,
        breakdown: {
          delivery: `${(deliveryScore * 0.4).toFixed(2)} (40% weight)`,
          quality: `${(qualityScore * 0.3).toFixed(2)} (30% weight)`,
          response: `${(responseScore * 0.2).toFixed(2)} (20% weight)`,
          pricing: `${(fairPricingScore * 0.1).toFixed(2)} (10% weight)`
        }
      };
    } catch (error) {
      console.error('Error calculating trust score:', error);
      throw error;
    }
  }

  /**
   * Calculate average score for a rating field
   */
  static calculateAverageScore(ratings, field) {
    const validRatings = ratings.filter(r => r[field] != null);
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, r) => acc + r[field], 0);
    return sum / validRatings.length;
  }

  /**
   * Calculate response time score from messages
   * @param {number} vendorId - Vendor ID
   * @returns {number} Response score (0-5)
   */
  static async calculateResponseScore(vendorId) {
    try {
      // Get recent messages where vendor is recipient
      const messages = await Message.findAll({
        where: {
          recipientId: vendorId,
          createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        },
        order: [['createdAt', 'ASC']],
        limit: 100
      });

      if (messages.length === 0) return 4.0; // Default neutral score

      // Calculate average response time
      let totalResponseTime = 0;
      let responseCount = 0;

      for (let i = 0; i < messages.length - 1; i++) {
        const currentMsg = messages[i];
        const nextMsg = messages[i + 1];

        // If next message is from vendor, calculate response time
        if (nextMsg.senderId === vendorId) {
          const responseTime = (new Date(nextMsg.createdAt) - new Date(currentMsg.createdAt)) / (1000 * 60); // minutes
          totalResponseTime += responseTime;
          responseCount++;
        }
      }

      if (responseCount === 0) return 4.0;

      const avgResponseTime = totalResponseTime / responseCount;

      // Convert response time to score (0-5)
      // < 30 min: 5.0
      // 30-60 min: 4.5
      // 1-2 hours: 4.0
      // 2-4 hours: 3.5
      // 4-8 hours: 3.0
      // > 8 hours: 2.5

      if (avgResponseTime < 30) return 5.0;
      if (avgResponseTime < 60) return 4.5;
      if (avgResponseTime < 120) return 4.0;
      if (avgResponseTime < 240) return 3.5;
      if (avgResponseTime < 480) return 3.0;
      return 2.5;
    } catch (error) {
      console.error('Error calculating response score:', error);
      return 4.0; // Default
    }
  }

  /**
   * Calculate fair pricing score
   * @param {number} vendorId - Vendor ID
   * @returns {number} Fair pricing score (0-5)
   */
  static async calculateFairPricingScore(vendorId) {
    try {
      // Get vendor's completed transactions
      const transactions = await Transaction.findAll({
        where: {
          vendorId,
          status: 'delivered'
        },
        limit: 50
      });

      if (transactions.length === 0) return 4.0; // Default neutral

      // Calculate how often vendor's prices are close to market average
      // This is simplified - in production, compare with actual market data
      let fairPriceCount = 0;

      for (const transaction of transactions) {
        // Assume fair if transaction completed (buyer accepted the price)
        fairPriceCount++;
      }

      // Score based on completion rate
      const fairPriceRatio = fairPriceCount / transactions.length;
      return fairPriceRatio * 5;
    } catch (error) {
      console.error('Error calculating fair pricing score:', error);
      return 4.0;
    }
  }

  /**
   * Check and award badges based on trust score and transaction count
   * @param {number} vendorId - Vendor ID
   * @param {number} trustScore - Overall trust score
   * @param {number} transactionCount - Number of transactions
   */
  static async checkAndAwardBadges(vendorId, trustScore, transactionCount) {
    try {
      const user = await User.findByPk(vendorId);
      if (!user) return;

      const badges = [];

      // Trusted Vendor: Score ≥ 4.5 and 20+ transactions
      if (trustScore >= 4.5 && transactionCount >= 20) {
        badges.push('trusted_vendor');
      }

      // Verified Seller: Score ≥ 4.0 and 50+ transactions
      if (trustScore >= 4.0 && transactionCount >= 50) {
        badges.push('verified_seller');
      }

      // Rising Star: Score ≥ 4.5 and 5-19 transactions
      if (trustScore >= 4.5 && transactionCount >= 5 && transactionCount < 20) {
        badges.push('rising_star');
      }

      // Quality Champion: Quality score ≥ 4.8
      const trustScoreRecord = await TrustScore.findOne({ where: { vendorId } });
      if (trustScoreRecord && trustScoreRecord.qualityScore >= 4.8) {
        badges.push('quality_champion');
      }

      // Fast Responder: Response score ≥ 4.8
      if (trustScoreRecord && trustScoreRecord.responseScore >= 4.8) {
        badges.push('fast_responder');
      }

      // Update user badges
      await user.update({ badges: badges.join(',') });

      // Flag low trust accounts
      if (trustScore < 3.0 && transactionCount >= 10) {
        await user.update({ flaggedForReview: true });
        console.log(`⚠️ Vendor ${vendorId} flagged for review (low trust score: ${trustScore})`);
      }

      return badges;
    } catch (error) {
      console.error('Error awarding badges:', error);
    }
  }

  /**
   * Submit a rating for a transaction
   * @param {Object} ratingData - Rating data
   * @returns {Object} Created rating
   */
  static async submitRating(ratingData) {
    try {
      const { transactionId, buyerId, vendorId, deliveryRating, qualityRating, comment } = ratingData;

      // Check if rating already exists
      const existing = await Rating.findOne({ where: { transactionId } });
      if (existing) {
        throw new Error('Rating already submitted for this transaction');
      }

      // Create rating
      const rating = await Rating.create({
        transactionId,
        buyerId,
        vendorId,
        deliveryRating,
        qualityRating,
        comment
      });

      // Recalculate trust score
      await this.calculateTrustScore(vendorId);

      return rating;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  /**
   * Get vendor reputation summary
   * @param {number} vendorId - Vendor ID
   * @returns {Object} Reputation summary
   */
  static async getVendorReputation(vendorId) {
    try {
      const trustScore = await TrustScore.findOne({ where: { vendorId } });
      const user = await User.findByPk(vendorId);
      const transactionCount = await Transaction.count({
        where: { vendorId, status: 'delivered' }
      });

      const recentRatings = await Rating.findAll({
        where: { vendorId },
        order: [['createdAt', 'DESC']],
        limit: 10,
        include: [{ model: User, as: 'buyer', attributes: ['name'] }]
      });

      return {
        vendorId,
        vendorName: user?.name,
        trustScore: trustScore || { overallScore: 0, totalRatings: 0 },
        badges: user?.badges ? user.badges.split(',') : [],
        transactionCount,
        recentRatings: recentRatings.map(r => ({
          deliveryRating: r.deliveryRating,
          qualityRating: r.qualityRating,
          comment: r.comment,
          buyerName: r.buyer?.name,
          createdAt: r.createdAt
        })),
        flaggedForReview: user?.flaggedForReview || false
      };
    } catch (error) {
      console.error('Error getting vendor reputation:', error);
      throw error;
    }
  }
}

module.exports = TrustService;
