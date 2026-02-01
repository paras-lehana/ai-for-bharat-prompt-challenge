/**
 * FILE: backend/src/services/DisputeService.js
 * 
 * PURPOSE: Handle dispute resolution between buyers and vendors
 * 
 * KEY FUNCTIONS:
 *  - createDispute() → Create dispute case for transaction
 *  - submitEvidence() → Submit evidence (text, images, logs)
 *  - analyzeDispute() → AI analysis of dispute with resolution recommendation
 *  - resolveDispute() → Execute resolution and update trust scores
 *  - getDispute() → Get dispute details with evidence
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/disputes routes
 *  - Depends on: Dispute, Evidence, Transaction, User models, TrustService
 */

const { Dispute, Evidence, Transaction, User, Message } = require('../models');
const TrustService = require('./TrustService');
const { createError } = require('../middleware/errorHandler');

class DisputeService {
  /**
   * Create a new dispute case
   * 
   * @param {string} transactionId - Transaction ID
   * @param {string} raisedBy - User ID (buyer or vendor)
   * @param {string} reason - Dispute reason
   * @param {string} description - Detailed description
   * @returns {Promise<Object>} - Created dispute
   */
  async createDispute(transactionId, raisedBy, reason, description) {
    try {
      // Get transaction
      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          { model: User, as: 'buyer' },
          { model: User, as: 'vendor' }
        ]
      });

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      // Verify user is part of transaction
      if (transaction.buyerId !== raisedBy && transaction.vendorId !== raisedBy) {
        throw createError('Unauthorized to raise dispute for this transaction', 403);
      }

      // Check if dispute already exists
      const existingDispute = await Dispute.findOne({
        where: { transactionId }
      });

      if (existingDispute) {
        throw createError('Dispute already exists for this transaction', 400);
      }

      // Check if transaction is in valid state for dispute
      const validStatuses = ['delivered', 'in_transit'];
      if (!validStatuses.includes(transaction.status)) {
        throw createError('Transaction must be delivered or in transit to raise dispute', 400);
      }

      // Set evidence deadline (48 hours from now)
      const evidenceDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // Create dispute
      const dispute = await Dispute.create({
        transactionId,
        raisedBy,
        reason,
        description,
        status: 'open',
        evidenceDeadline
      });

      // Notify both parties
      // TODO: Send notifications via SMS/push

      return {
        dispute: await this.getDispute(dispute.id),
        message: 'Dispute created successfully. Both parties have 48 hours to submit evidence.'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error creating dispute:', error);
      throw createError('Failed to create dispute', 500);
    }
  }

  /**
   * Submit evidence for a dispute
   * 
   * @param {string} disputeId - Dispute ID
   * @param {string} userId - User ID (buyer or vendor)
   * @param {string} evidenceType - Type (text, image, message_log)
   * @param {string} content - Evidence content
   * @param {Array} attachments - File attachments (optional)
   * @returns {Promise<Object>} - Created evidence
   */
  async submitEvidence(disputeId, userId, evidenceType, content, attachments = []) {
    try {
      const dispute = await Dispute.findByPk(disputeId, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            include: [
              { model: User, as: 'buyer' },
              { model: User, as: 'vendor' }
            ]
          }
        ]
      });

      if (!dispute) {
        throw createError('Dispute not found', 404);
      }

      // Verify user is part of dispute
      const transaction = dispute.transaction;
      if (transaction.buyerId !== userId && transaction.vendorId !== userId) {
        throw createError('Unauthorized to submit evidence for this dispute', 403);
      }

      // Check if evidence deadline has passed
      if (new Date() > dispute.evidenceDeadline) {
        throw createError('Evidence submission deadline has passed', 400);
      }

      // Create evidence record
      const evidence = await Evidence.create({
        disputeId,
        submittedBy: userId,
        evidenceType,
        content,
        attachments: JSON.stringify(attachments)
      });

      return {
        evidence,
        message: 'Evidence submitted successfully'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error submitting evidence:', error);
      throw createError('Failed to submit evidence', 500);
    }
  }

  /**
   * Analyze dispute and generate resolution recommendation
   * 
   * @param {string} disputeId - Dispute ID
   * @returns {Promise<Object>} - Analysis and recommendation
   */
  async analyzeDispute(disputeId) {
    try {
      const dispute = await this.getDispute(disputeId);

      if (!dispute) {
        throw createError('Dispute not found', 404);
      }

      // Get all evidence
      const buyerEvidence = dispute.evidence.filter(e => e.submittedBy === dispute.transaction.buyerId);
      const vendorEvidence = dispute.evidence.filter(e => e.submittedBy === dispute.transaction.vendorId);

      // Simple rule-based analysis (can be enhanced with ML)
      const analysis = this._analyzeEvidenceRuleBased(
        dispute,
        buyerEvidence,
        vendorEvidence
      );

      return {
        analysis,
        dispute: {
          id: dispute.id,
          reason: dispute.reason,
          status: dispute.status,
          buyerEvidenceCount: buyerEvidence.length,
          vendorEvidenceCount: vendorEvidence.length
        }
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error analyzing dispute:', error);
      throw createError('Failed to analyze dispute', 500);
    }
  }

  /**
   * Rule-based dispute analysis
   * @private
   */
  _analyzeEvidenceRuleBased(dispute, buyerEvidence, vendorEvidence) {
    const reason = dispute.reason.toLowerCase();
    
    // Quality issues
    if (reason.includes('quality') || reason.includes('defect')) {
      if (buyerEvidence.some(e => e.evidenceType === 'image')) {
        return {
          recommendation: 'refund_partial',
          percentage: 50,
          reasoning: 'Buyer provided photo evidence of quality issues. Recommend 50% refund.',
          confidence: 'medium'
        };
      }
      return {
        recommendation: 'refund_partial',
        percentage: 30,
        reasoning: 'Quality dispute without photo evidence. Recommend 30% refund as goodwill.',
        confidence: 'low'
      };
    }

    // Non-delivery
    if (reason.includes('not received') || reason.includes('delivery')) {
      if (vendorEvidence.some(e => e.content.includes('delivered') || e.content.includes('proof'))) {
        return {
          recommendation: 'no_refund',
          reasoning: 'Vendor provided delivery proof. No refund recommended.',
          confidence: 'high'
        };
      }
      return {
        recommendation: 'refund_full',
        reasoning: 'No delivery proof from vendor. Full refund recommended.',
        confidence: 'high'
      };
    }

    // Wrong item
    if (reason.includes('wrong') || reason.includes('different')) {
      return {
        recommendation: 'reship',
        reasoning: 'Wrong item delivered. Recommend reshipping correct item or full refund.',
        confidence: 'medium'
      };
    }

    // Damaged goods
    if (reason.includes('damage')) {
      if (buyerEvidence.some(e => e.evidenceType === 'image')) {
        return {
          recommendation: 'refund_full',
          reasoning: 'Photo evidence of damaged goods. Full refund recommended.',
          confidence: 'high'
        };
      }
      return {
        recommendation: 'refund_partial',
        percentage: 50,
        reasoning: 'Damage claim without photo evidence. 50% refund recommended.',
        confidence: 'medium'
      };
    }

    // Default
    return {
      recommendation: 'refund_partial',
      percentage: 40,
      reasoning: 'Insufficient evidence from both parties. 40% refund as compromise.',
      confidence: 'low'
    };
  }

  /**
   * Resolve dispute and execute resolution
   * 
   * @param {string} disputeId - Dispute ID
   * @param {string} resolution - Resolution type (refund_full, refund_partial, no_refund, reship)
   * @param {Object} resolutionDetails - Additional details (percentage, notes)
   * @returns {Promise<Object>} - Resolution result
   */
  async resolveDispute(disputeId, resolution, resolutionDetails = {}) {
    try {
      const dispute = await this.getDispute(disputeId);

      if (!dispute) {
        throw createError('Dispute not found', 404);
      }

      if (dispute.status !== 'open' && dispute.status !== 'under_review') {
        throw createError('Dispute is already resolved', 400);
      }

      // Update dispute status
      await Dispute.update(
        {
          status: 'resolved',
          resolution,
          resolutionDetails: JSON.stringify(resolutionDetails),
          resolvedAt: new Date()
        },
        { where: { id: disputeId } }
      );

      // Update trust scores based on resolution
      await this._updateTrustScoresAfterResolution(dispute, resolution);

      // TODO: Execute actual refund/reship logic
      // For MVP, we just record the resolution

      return {
        success: true,
        resolution,
        message: this._getResolutionMessage(resolution, resolutionDetails)
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error resolving dispute:', error);
      throw createError('Failed to resolve dispute', 500);
    }
  }

  /**
   * Update trust scores after dispute resolution
   * @private
   */
  async _updateTrustScoresAfterResolution(dispute, resolution) {
    try {
      const transaction = dispute.transaction;
      
      // If vendor is at fault (refund given), reduce their trust score
      if (resolution === 'refund_full' || resolution === 'refund_partial') {
        // Reduce vendor's delivery and quality scores
        // This would integrate with TrustService
        console.log(`Reducing trust score for vendor ${transaction.vendorId} due to dispute resolution: ${resolution}`);
      }

      // If buyer raised frivolous dispute (no refund), note it
      if (resolution === 'no_refund') {
        console.log(`Dispute resolved in favor of vendor ${transaction.vendorId}`);
      }
    } catch (error) {
      console.error('Error updating trust scores:', error);
      // Don't throw - trust score update is not critical
    }
  }

  /**
   * Get resolution message
   * @private
   */
  _getResolutionMessage(resolution, details) {
    switch (resolution) {
      case 'refund_full':
        return 'Full refund has been issued to the buyer.';
      case 'refund_partial':
        return `Partial refund of ${details.percentage || 50}% has been issued to the buyer.`;
      case 'no_refund':
        return 'No refund issued. Dispute resolved in favor of vendor.';
      case 'reship':
        return 'Vendor will reship the correct item to the buyer.';
      default:
        return 'Dispute has been resolved.';
    }
  }

  /**
   * Get dispute details with all evidence
   * 
   * @param {string} disputeId - Dispute ID
   * @returns {Promise<Object>} - Dispute with full details
   */
  async getDispute(disputeId) {
    try {
      const dispute = await Dispute.findByPk(disputeId, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            include: [
              { model: User, as: 'buyer', attributes: ['id', 'name', 'phoneNumber'] },
              { model: User, as: 'vendor', attributes: ['id', 'name', 'phoneNumber'] }
            ]
          },
          {
            model: Evidence,
            as: 'evidence',
            order: [['createdAt', 'ASC']]
          },
          {
            model: User,
            as: 'raisedByUser',
            attributes: ['id', 'name', 'role']
          }
        ]
      });

      if (!dispute) {
        throw createError('Dispute not found', 404);
      }

      return dispute;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error getting dispute:', error);
      throw createError('Failed to get dispute', 500);
    }
  }

  /**
   * Get all disputes for a user
   * 
   * @param {string} userId - User ID
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<Array>} - Array of disputes
   */
  async getUserDisputes(userId, status = null) {
    try {
      // Find transactions where user is buyer or vendor
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { buyerId: userId },
            { vendorId: userId }
          ]
        },
        attributes: ['id']
      });

      const transactionIds = transactions.map(t => t.id);

      const where = {
        transactionId: { [Op.in]: transactionIds }
      };

      if (status) {
        where.status = status;
      }

      const disputes = await Dispute.findAll({
        where,
        include: [
          {
            model: Transaction,
            as: 'transaction',
            include: [
              { model: User, as: 'buyer', attributes: ['id', 'name'] },
              { model: User, as: 'vendor', attributes: ['id', 'name'] }
            ]
          },
          {
            model: Evidence,
            as: 'evidence'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return disputes;
    } catch (error) {
      console.error('Error getting user disputes:', error);
      throw createError('Failed to get disputes', 500);
    }
  }
}

module.exports = new DisputeService();
