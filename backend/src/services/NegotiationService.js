/**
 * FILE: backend/src/services/NegotiationService.js
 * 
 * PURPOSE: Manage negotiation sessions between buyers and vendors
 * 
 * KEY FUNCTIONS:
 *  - createNegotiation() → Start new negotiation with initial offer
 *  - submitCounterOffer() → Submit counter-offer in negotiation
 *  - acceptOffer() → Accept current offer and create transaction
 *  - rejectOffer() → Reject offer and end negotiation
 *  - analyzeOffer() → AI analysis of offer with counter-offer suggestion
 *  - expireNegotiations() → Expire negotiations after 24 hours
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/negotiations routes
 *  - Depends on: Negotiation, Offer, Listing, Transaction models, PricingService, AIService
 */

const { Negotiation, Offer, Listing, Transaction, User } = require('../models');
const PricingService = require('./PricingService');
const AIService = require('./AIService');
const { createError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class NegotiationService {
  /**
   * Create a new negotiation session
   * 
   * @param {string} buyerId - Buyer user ID
   * @param {string} listingId - Listing ID
   * @param {number} initialOffer - Initial offer amount
   * @returns {Promise<Object>} - Created negotiation with AI analysis
   */
  async createNegotiation(buyerId, listingId, initialOffer) {
    try {
      // Get listing
      const listing = await Listing.findByPk(listingId, {
        include: [{ model: User, as: 'vendor' }]
      });

      if (!listing) {
        throw createError('Listing not found', 404);
      }

      if (listing.status !== 'active') {
        throw createError('Listing is not available for negotiation', 400);
      }

      if (listing.vendorId === buyerId) {
        throw createError('Cannot negotiate on your own listing', 400);
      }

      // Check for existing active negotiation
      const existingNegotiation = await Negotiation.findOne({
        where: {
          buyerId,
          listingId,
          status: 'active'
        }
      });

      if (existingNegotiation) {
        throw createError('You already have an active negotiation for this listing', 400);
      }

      // Validate offer price
      const validation = PricingService.validateOfferPrice(initialOffer, listing.finalPrice);
      if (!validation.valid) {
        throw createError(validation.reason, 400);
      }

      // Set expiration (24 hours from now)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create negotiation
      const negotiation = await Negotiation.create({
        buyerId,
        vendorId: listing.vendorId,
        listingId,
        currentOffer: initialOffer,
        status: 'active',
        expiresAt
      });

      // Create initial offer record
      await Offer.create({
        negotiationId: negotiation.id,
        userId: buyerId,
        amount: initialOffer,
        type: 'buyer_offer'
      });

      // Generate AI counter-offer suggestion for vendor
      const counterOfferSuggestion = PricingService.generateCounterOffer(
        initialOffer,
        listing.finalPrice
      );

      // Get eNAM price for context
      const enamPrice = await PricingService.getENAMPrice(
        listing.cropType,
        listing.locationDistrict
      );

      return {
        negotiation: await this.getNegotiation(negotiation.id),
        counterOfferSuggestion,
        marketContext: {
          listingPrice: listing.finalPrice,
          enamPrice: enamPrice.modalPrice,
          offerPercentage: ((initialOffer / listing.finalPrice) * 100).toFixed(1)
        }
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error creating negotiation:', error);
      throw createError('Failed to create negotiation', 500);
    }
  }

  /**
   * Submit a counter-offer in an existing negotiation
   * 
   * @param {string} negotiationId - Negotiation ID
   * @param {string} userId - User ID (buyer or vendor)
   * @param {number} offerAmount - Counter-offer amount
   * @returns {Promise<Object>} - Updated negotiation with AI analysis
   */
  async submitCounterOffer(negotiationId, userId, offerAmount) {
    try {
      const negotiation = await Negotiation.findByPk(negotiationId, {
        include: [
          { model: Listing, as: 'listing' },
          { model: User, as: 'buyer' },
          { model: User, as: 'vendor' }
        ]
      });

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      if (negotiation.status !== 'active') {
        throw createError('Negotiation is not active', 400);
      }

      // Check if user is part of this negotiation
      if (negotiation.buyerId !== userId && negotiation.vendorId !== userId) {
        throw createError('Unauthorized to participate in this negotiation', 403);
      }

      // Check expiration
      if (new Date() > negotiation.expiresAt) {
        await negotiation.update({ status: 'expired' });
        throw createError('Negotiation has expired', 400);
      }

      // Determine offer type
      const offerType = userId === negotiation.buyerId ? 'buyer_offer' : 'vendor_counter';

      // Create offer record
      await Offer.create({
        negotiationId,
        userId,
        amount: offerAmount,
        type: offerType
      });

      // Update current offer
      await negotiation.update({ currentOffer: offerAmount });

      // Generate counter-offer suggestion for the other party
      const isVendorOffer = userId === negotiation.vendorId;
      const counterOfferSuggestion = PricingService.generateCounterOffer(
        offerAmount,
        negotiation.listing.finalPrice
      );

      return {
        negotiation: await this.getNegotiation(negotiationId),
        counterOfferSuggestion,
        message: `Counter-offer of ₹${offerAmount} submitted successfully`
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error submitting counter-offer:', error);
      throw createError('Failed to submit counter-offer', 500);
    }
  }

  /**
   * Accept the current offer and create transaction
   * 
   * @param {string} negotiationId - Negotiation ID
   * @param {string} userId - User ID (must be buyer or vendor)
   * @returns {Promise<Object>} - Created transaction
   */
  async acceptOffer(negotiationId, userId) {
    try {
      const negotiation = await Negotiation.findByPk(negotiationId, {
        include: [
          { model: Listing, as: 'listing' },
          { model: User, as: 'buyer' },
          { model: User, as: 'vendor' }
        ]
      });

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      if (negotiation.status !== 'active') {
        throw createError('Negotiation is not active', 400);
      }

      // Check if user is part of this negotiation
      if (negotiation.buyerId !== userId && negotiation.vendorId !== userId) {
        throw createError('Unauthorized to accept this offer', 403);
      }

      // Update negotiation status
      await negotiation.update({ status: 'accepted' });

      // Create transaction
      const transaction = await Transaction.create({
        buyerId: negotiation.buyerId,
        vendorId: negotiation.vendorId,
        listingId: negotiation.listingId,
        negotiationId: negotiation.id,
        finalPrice: negotiation.currentOffer,
        quantity: negotiation.listing.quantity,
        unit: negotiation.listing.unit,
        status: 'pending',
        paymentStatus: 'pending'
      });

      // Update listing status
      await negotiation.listing.update({ status: 'sold' });

      return {
        transaction,
        message: 'Offer accepted! Transaction created successfully'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error accepting offer:', error);
      throw createError('Failed to accept offer', 500);
    }
  }

  /**
   * Reject the current offer and end negotiation
   * 
   * @param {string} negotiationId - Negotiation ID
   * @param {string} userId - User ID (must be buyer or vendor)
   * @param {string} reason - Optional rejection reason
   * @returns {Promise<Object>} - Success message
   */
  async rejectOffer(negotiationId, userId, reason = null) {
    try {
      const negotiation = await Negotiation.findByPk(negotiationId);

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      if (negotiation.status !== 'active') {
        throw createError('Negotiation is not active', 400);
      }

      // Check if user is part of this negotiation
      if (negotiation.buyerId !== userId && negotiation.vendorId !== userId) {
        throw createError('Unauthorized to reject this offer', 403);
      }

      // Update negotiation status
      await negotiation.update({
        status: 'rejected',
        rejectionReason: reason
      });

      return {
        success: true,
        message: 'Offer rejected. Negotiation ended.'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error rejecting offer:', error);
      throw createError('Failed to reject offer', 500);
    }
  }

  /**
   * Withdraw from negotiation (buyer only)
   * 
   * @param {string} negotiationId - Negotiation ID
   * @param {string} buyerId - Buyer user ID
   * @returns {Promise<Object>} - Success message
   */
  async withdrawNegotiation(negotiationId, buyerId) {
    try {
      const negotiation = await Negotiation.findByPk(negotiationId);

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      if (negotiation.buyerId !== buyerId) {
        throw createError('Only the buyer can withdraw from negotiation', 403);
      }

      if (negotiation.status !== 'active') {
        throw createError('Negotiation is not active', 400);
      }

      await negotiation.update({ status: 'withdrawn' });

      return {
        success: true,
        message: 'Successfully withdrawn from negotiation'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error withdrawing negotiation:', error);
      throw createError('Failed to withdraw negotiation', 500);
    }
  }

  /**
   * Get negotiation details with offers history
   * 
   * @param {string} negotiationId - Negotiation ID
   * @returns {Promise<Object>} - Negotiation with full details
   */
  async getNegotiation(negotiationId) {
    try {
      const negotiation = await Negotiation.findByPk(negotiationId, {
        include: [
          {
            model: Listing,
            as: 'listing',
            attributes: ['id', 'cropType', 'quantity', 'unit', 'finalPrice', 'qualityTier', 'images']
          },
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'phoneNumber', 'languagePreference']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'phoneNumber', 'languagePreference']
          },
          {
            model: Offer,
            as: 'offers',
            order: [['createdAt', 'ASC']]
          }
        ]
      });

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      return negotiation;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error getting negotiation:', error);
      throw createError('Failed to get negotiation', 500);
    }
  }

  /**
   * Get all negotiations for a user (buyer or vendor)
   * 
   * @param {string} userId - User ID
   * @param {string} role - User role (buyer or vendor)
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<Array>} - Array of negotiations
   */
  async getUserNegotiations(userId, role, status = null) {
    try {
      const where = role === 'buyer' ? { buyerId: userId } : { vendorId: userId };
      
      if (status) {
        where.status = status;
      }

      const negotiations = await Negotiation.findAll({
        where,
        include: [
          {
            model: Listing,
            as: 'listing',
            attributes: ['id', 'cropType', 'quantity', 'unit', 'finalPrice', 'qualityTier', 'images']
          },
          {
            model: User,
            as: role === 'buyer' ? 'vendor' : 'buyer',
            attributes: ['id', 'name', 'phoneNumber']
          },
          {
            model: Offer,
            as: 'offers',
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return negotiations;
    } catch (error) {
      console.error('Error getting user negotiations:', error);
      throw createError('Failed to get negotiations', 500);
    }
  }

  /**
   * Expire negotiations that are past 24 hours
   * Should be run as a cron job
   * 
   * @returns {Promise<number>} - Number of negotiations expired
   */
  async expireNegotiations() {
    try {
      const now = new Date();

      const [count] = await Negotiation.update(
        { status: 'expired' },
        {
          where: {
            status: 'active',
            expiresAt: { [Op.lt]: now }
          }
        }
      );

      console.log(`Expired ${count} negotiations`);
      return count;
    } catch (error) {
      console.error('Error expiring negotiations:', error);
      return 0;
    }
  }

  /**
   * Analyze offer and generate AI insights
   * 
   * @param {string} negotiationId - Negotiation ID
   * @returns {Promise<Object>} - AI analysis and suggestions
   */
  async analyzeOffer(negotiationId) {
    try {
      const negotiation = await this.getNegotiation(negotiationId);

      const analysis = PricingService.generateCounterOffer(
        negotiation.currentOffer,
        negotiation.listing.finalPrice
      );

      // Get market context
      const enamPrice = await PricingService.getENAMPrice(
        negotiation.listing.cropType,
        negotiation.listing.locationDistrict
      );

      return {
        analysis,
        marketContext: {
          enamPrice: enamPrice.modalPrice,
          listingPrice: negotiation.listing.finalPrice,
          currentOffer: negotiation.currentOffer,
          offerPercentage: ((negotiation.currentOffer / negotiation.listing.finalPrice) * 100).toFixed(1)
        }
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error analyzing offer:', error);
      throw createError('Failed to analyze offer', 500);
    }
  }
}

module.exports = new NegotiationService();
