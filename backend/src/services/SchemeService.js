/**
 * FILE: backend/src/services/SchemeService.js
 * 
 * PURPOSE: Service for managing government agricultural schemes
 */

const GovernmentScheme = require('../models/GovernmentScheme');
const { Op } = require('sequelize');

class SchemeService {
  /**
   * Get all active schemes with optional filters
   */
  async getSchemes(filters = {}) {
    const query = {
      where: {
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    };

    if (filters.category) {
      query.where.category = filters.category;
    }

    if (filters.state && filters.state !== 'Central') {
      query.where[Op.or] = [
        { state: 'Central' },
        { state: filters.state }
      ];
    } else if (filters.state === 'Central') {
      query.where.state = 'Central';
    }

    return await GovernmentScheme.findAll(query);
  }

  /**
   * Get scheme by ID
   */
  async getSchemeById(id) {
    return await GovernmentScheme.findByPk(id);
  }

  /**
   * Search schemes by keyword
   */
  async searchSchemes(keyword) {
    return await GovernmentScheme.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * Create sample schemes for seeding
   */
  async seedSampleSchemes() {
    const count = await GovernmentScheme.count();
    if (count > 0) return;

    const samples = [
      {
        name: "PM-KISHAN (Pradhan Mantri Kisan Samman Nidhi)",
        category: "Direct Benefit Transfer",
        description: "An initiative by the Government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
        eligibility: "All landholding farmer families in the country.",
        benefits: "₹6,000 per year in three equal installments of ₹2,000 each.",
        applicationProcess: "Registration through PM-Kishan portal or CSC centers.",
        officialUrl: "https://pmkisan.gov.in/",
        state: "Central"
      },
      {
        name: "PM Fasal Bima Yojana (PMFBY)",
        category: "Insurance",
        description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders.",
        eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
        benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
        applicationProcess: "Online through PMFBY portal or through banks/CSC.",
        officialUrl: "https://pmfby.gov.in/",
        state: "Central"
      },
      {
        name: "Kisan Credit Card (KCC)",
        category: "Credit",
        description: "Provides farmers with timely access to credit for their cultivation and other needs.",
        eligibility: "Individual/joint borowers who are owner-cultivators, tenant farmers, oral lessees, sharecroppers.",
        benefits: "Simplified credit delivery system, low interest rates, flexible repayment.",
        applicationProcess: "Application through any commercial/rural/cooperative bank.",
        officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
        state: "Central"
      }
    ];

    await GovernmentScheme.bulkCreate(samples);
  }
}

module.exports = new SchemeService();
