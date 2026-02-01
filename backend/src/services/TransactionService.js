/**
 * FILE: backend/src/services/TransactionService.js
 * 
 * PURPOSE: Transaction lifecycle management
 * 
 * KEY FUNCTIONS:
 *  - createTransaction() → Create transaction from negotiation
 *  - updateStatus() → Update transaction status
 *  - confirmTransaction() → Vendor confirms order
 *  - markAsShipped() → Mark as in transit
 *  - confirmDelivery() → Buyer confirms delivery
 *  - getTransactionHistory() → Get user's transactions
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/transactions routes, NegotiationService
 *  - Depends on: Transaction, User, Listing, Negotiation models
 */

const { Transaction, User, Listing, Negotiation, Rating } = require('../models');
const { Op } = require('sequelize');
const { createError } = require('../middleware/errorHandler');

class TransactionService {
  /**
   * Transaction status flow:
   * pending → confirmed → in_transit → delivered → (disputed)
   */
  static STATUS_FLOW = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_transit', 'cancelled'],
    in_transit: ['delivered', 'disputed'],
    delivered: ['disputed'],
    disputed: ['resolved'],
    cancelled: [],
    resolved: []
  };

  /**
   * Create transaction from negotiation acceptance
   * 
   * @param {string} negotiationId - Negotiation ID
   * @param {number} finalPrice - Agreed price
   * @param {number} quantity - Quantity
   * @returns {Promise<Object>} - Created transaction
   */
  async createTransaction(negotiationId, finalPrice, quantity) {
    try {
      // Get negotiation details
      const negotiation = await Negotiation.findByPk(negotiationId, {
        include: [
          {
            model: Listing,
            as: 'listing',
            include: [{ model: User, as: 'vendor' }]
          },
          { model: User, as: 'buyer' }
        ]
      });

      if (!negotiation) {
        throw createError('Negotiation not found', 404);
      }

      if (negotiation.status !== 'accepted') {
        throw createError('Negotiation must be accepted to create transaction', 400);
      }

      // Check if transaction already exists
      const existing = await Transaction.findOne({
        where: { negotiationId }
      });

      if (existing) {
        return existing;
      }

      // Create transaction
      const transaction = await Transaction.create({
        negotiationId,
        listingId: negotiation.listingId,
        buyerId: negotiation.buyerId,
        vendorId: negotiation.listing.vendorId,
        quantity,
        pricePerUnit: finalPrice,
        totalAmount: finalPrice * quantity,
        status: 'pending'
      });

      // TODO: Send notification to vendor for confirmation

      return await this.getTransaction(transaction.id);
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error creating transaction:', error);
      throw createError('Failed to create transaction', 500);
    }
  }

  /**
   * Get transaction with full details
   * 
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} - Transaction details
   */
  async getTransaction(transactionId) {
    try {
      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'phoneNumber', 'location']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'phoneNumber', 'location']
          },
          {
            model: Listing,
            as: 'listing',
            attributes: ['id', 'cropType', 'qualityTier', 'unit']
          },
          {
            model: Negotiation,
            as: 'negotiation',
            attributes: ['id', 'initialOffer', 'finalOffer']
          }
        ]
      });

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      return transaction;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error getting transaction:', error);
      throw createError('Failed to get transaction', 500);
    }
  }

  /**
   * Vendor confirms transaction
   * 
   * @param {string} transactionId - Transaction ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} - Updated transaction
   */
  async confirmTransaction(transactionId, vendorId) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      if (transaction.vendorId !== vendorId) {
        throw createError('Unauthorized to confirm this transaction', 403);
      }

      if (transaction.status !== 'pending') {
        throw createError('Transaction must be in pending status', 400);
      }

      // Update status
      await transaction.update({
        status: 'confirmed',
        confirmedAt: new Date()
      });

      // TODO: Send notification to buyer

      return await this.getTransaction(transactionId);
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error confirming transaction:', error);
      throw createError('Failed to confirm transaction', 500);
    }
  }

  /**
   * Mark transaction as shipped
   * 
   * @param {string} transactionId - Transaction ID
   * @param {string} vendorId - Vendor ID
   * @param {Object} shippingDetails - Shipping details (optional)
   * @returns {Promise<Object>} - Updated transaction
   */
  async markAsShipped(transactionId, vendorId, shippingDetails = {}) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      if (transaction.vendorId !== vendorId) {
        throw createError('Unauthorized to update this transaction', 403);
      }

      if (transaction.status !== 'confirmed') {
        throw createError('Transaction must be confirmed before shipping', 400);
      }

      // Update status
      await transaction.update({
        status: 'in_transit',
        shippedAt: new Date(),
        shippingDetails: JSON.stringify(shippingDetails)
      });

      // TODO: Send notification to buyer with tracking info

      return await this.getTransaction(transactionId);
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error marking as shipped:', error);
      throw createError('Failed to mark as shipped', 500);
    }
  }

  /**
   * Buyer confirms delivery
   * 
   * @param {string} transactionId - Transaction ID
   * @param {string} buyerId - Buyer ID
   * @returns {Promise<Object>} - Updated transaction
   */
  async confirmDelivery(transactionId, buyerId) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      if (transaction.buyerId !== buyerId) {
        throw createError('Unauthorized to confirm delivery', 403);
      }

      if (transaction.status !== 'in_transit') {
        throw createError('Transaction must be in transit', 400);
      }

      // Update status
      await transaction.update({
        status: 'delivered',
        deliveredAt: new Date()
      });

      // Update listing inventory
      await this._updateListingInventory(transaction.listingId, transaction.quantity);

      // TODO: Trigger rating prompt for buyer

      return await this.getTransaction(transactionId);
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error confirming delivery:', error);
      throw createError('Failed to confirm delivery', 500);
    }
  }

  /**
   * Update listing inventory after transaction completion
   * @private
   */
  async _updateListingInventory(listingId, quantitySold) {
    try {
      const listing = await Listing.findByPk(listingId);
      
      if (listing) {
        const newQuantity = listing.quantity - quantitySold;
        
        await listing.update({
          quantity: newQuantity,
          status: newQuantity <= 0 ? 'sold' : 'active'
        });
      }
    } catch (error) {
      console.error('Error updating listing inventory:', error);
      // Don't throw - inventory update is not critical
    }
  }

  /**
   * Cancel transaction
   * 
   * @param {string} transactionId - Transaction ID
   * @param {string} userId - User ID (buyer or vendor)
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} - Updated transaction
   */
  async cancelTransaction(transactionId, userId, reason) {
    try {
      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      if (transaction.buyerId !== userId && transaction.vendorId !== userId) {
        throw createError('Unauthorized to cancel this transaction', 403);
      }

      if (!['pending', 'confirmed'].includes(transaction.status)) {
        throw createError('Cannot cancel transaction in current status', 400);
      }

      // Update status
      await transaction.update({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: userId
      });

      return await this.getTransaction(transactionId);
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error cancelling transaction:', error);
      throw createError('Failed to cancel transaction', 500);
    }
  }

  /**
   * Get transaction history for a user
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options (status, dateRange)
   * @param {number} limit - Limit (default: 50)
   * @param {number} offset - Offset (default: 0)
   * @returns {Promise<Array>} - Array of transactions
   */
  async getTransactionHistory(userId, filters = {}, limit = 50, offset = 0) {
    try {
      const where = {
        [Op.or]: [
          { buyerId: userId },
          { vendorId: userId }
        ]
      };

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.startDate && filters.endDate) {
        where.createdAt = {
          [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
        };
      }

      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name']
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name']
          },
          {
            model: Listing,
            as: 'listing',
            attributes: ['id', 'cropType', 'qualityTier']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw createError('Failed to get transaction history', 500);
    }
  }

  /**
   * Generate transaction summary for accounting
   * 
   * @param {string} userId - User ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Object>} - Transaction summary
   */
  async getTransactionSummary(userId, startDate, endDate) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { buyerId: userId },
            { vendorId: userId }
          ],
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          },
          status: { [Op.in]: ['delivered', 'in_transit'] }
        }
      });

      const summary = {
        totalTransactions: transactions.length,
        totalRevenue: 0,
        totalExpenses: 0,
        byStatus: {},
        byCrop: {}
      };

      for (const transaction of transactions) {
        // Calculate revenue/expenses
        if (transaction.vendorId === userId) {
          summary.totalRevenue += transaction.totalAmount;
        } else {
          summary.totalExpenses += transaction.totalAmount;
        }

        // Count by status
        summary.byStatus[transaction.status] = (summary.byStatus[transaction.status] || 0) + 1;
      }

      return summary;
    } catch (error) {
      console.error('Error generating transaction summary:', error);
      throw createError('Failed to generate transaction summary', 500);
    }
  }

  /**
   * Export transactions to CSV format
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<string>} - CSV data
   */
  async exportToCSV(userId, filters = {}) {
    try {
      const transactions = await this.getTransactionHistory(userId, filters, 1000, 0);

      // Generate CSV
      const headers = ['Date', 'Transaction ID', 'Type', 'Crop', 'Quantity', 'Price', 'Total', 'Status'];
      const rows = transactions.map(t => [
        t.createdAt.toISOString().split('T')[0],
        t.id,
        t.buyerId === userId ? 'Purchase' : 'Sale',
        t.listing.cropType,
        t.quantity,
        t.pricePerUnit,
        t.totalAmount,
        t.status
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

      return csv;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw createError('Failed to export transactions', 500);
    }
  }
}

module.exports = new TransactionService();
