/**
 * FILE: backend/src/services/PredictionService.js
 * 
 * PURPOSE: Service for predicting future crop prices
 * 
 * METHODOLOGY:
 *  - Uses historical price data (from listings and eNAM)
 *  - Implements Linear Regression for trend analysis
 *  - Adds seasonality factors based on month
 *  - Provides confidence intervals
 */

const Listing = require('../models/Listing');
const ENAMPrice = require('../models/ENAMPrice');
const { Op } = require('sequelize');

class PredictionService {
  /**
   * Predict price for a crop in a location for the next n days
   */
  static async predictPrice(cropType, location, days = 7) {
    try {
      // 1. Fetch historical data
      const historicalData = await this.getHistoricalData(cropType, location);
      
      if (historicalData.length < 5) {
        throw new Error(`Insufficient data for prediction of ${cropType} in ${location}`);
      }

      // 2. Prepare data for regression (x = timestamp, y = price)
      const dataPoints = historicalData.map(d => ({
        x: new Date(d.date).getTime(),
        y: d.price
      }));

      // 3. Calculate Linear Regression
      const { slope, intercept, r2 } = this.calculateLinearRegression(dataPoints);

      // 4. Generate Predictions
      const predictions = [];
      const today = new Date();
      
      for (let i = 1; i <= days; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const futureTimestamp = futureDate.getTime();
        
        let predictedPrice = slope * futureTimestamp + intercept;
        
        // 5. Apply Seasonality (Simple Mock)
        // Prices tend to drop during harvest (e.g., April/Oct for major crops)
        const month = futureDate.getMonth(); // 0-11
        const seasonalityFactor = this.getSeasonalityFactor(cropType, month);
        predictedPrice *= seasonalityFactor;

        // 6. Confidence Interval (Visual buffer)
        // R2 indicates fit; lower R2 means wider confidence interval
        const margin = predictedPrice * (1 - (r2 || 0.5)) * 0.2; // 20% max variance

        predictions.push({
          date: futureDate.toISOString().split('T')[0],
          price: Math.round(predictedPrice * 100) / 100,
          minPrice: Math.round((predictedPrice - margin) * 100) / 100,
          maxPrice: Math.round((predictedPrice + margin) * 100) / 100,
          confidence: Math.round((r2 || 0.5) * 100)
        });
      }

      return {
        cropType,
        location,
        model: 'Linear Regression + Seasonality',
        r2,
        history: historicalData.slice(-10), // Return last 10 historical points for chart context
        forecast: predictions
      };

    } catch (error) {
      console.error('[PredictionService] Error:', error);
      throw error;
    }
  }

  /**
   * Get unified historical data from Listings and ENAM
   */
  static async getHistoricalData(cropType, location) {
    // Fetch from Listings
    const listings = await Listing.findAll({
      where: { 
        cropType,
        status: { [Op.in]: ['sold', 'available'] }
      },
      attributes: ['createdAt', 'finalPrice'],
      order: [['createdAt', 'ASC']]
    });

    // Fetch from ENAM
    const enamPrices = await ENAMPrice.findAll({
      where: { cropType },
      attributes: ['fetchedAt', 'modalPrice'],
      order: [['fetchedAt', 'ASC']]
    });

    // Combine and Format
    const data = [];
    
    listings.forEach(l => {
      data.push({
        date: l.createdAt,
        price: parseFloat(l.finalPrice),
        source: 'local'
      });
    });

    enamPrices.forEach(e => {
      if (e.fetchedAt) {
        data.push({
          date: e.fetchedAt,
          price: parseFloat(e.modalPrice),
          source: 'enam'
        });
      }
    });

    // Sort by date
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Simple Linear Regression (Least Squares)
   */
  static calculateLinearRegression(data) {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    data.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const meanY = sumY / n;
    let ssTot = 0, ssRes = 0;
    data.forEach(p => {
      const predictedY = slope * p.x + intercept;
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - predictedY, 2);
    });
    const r2 = 1 - (ssRes / ssTot);

    return { slope, intercept, r2: isNaN(r2) ? 0.5 : r2 };
  }

  /**
   * Mock seasonality factor
   */
  static getSeasonalityFactor(cropType, month) {
    // Month 0 = Jan, 11 = Dec
    // Simple logic: demand higher in winter for some, higher in summer for others
    // For MVP, just return random small fluctuation or distinct pattern
    
    const baseFactors = {
      'wheat': [1.0, 1.0, 0.9, 0.85, 0.9, 1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 1.0], // Harvest in April (price drop)
      'rice': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.9], // Harvest in Oct/Nov
      'onion': [1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.1, 1.3, 1.4, 1.3, 1.1, 1.0] // Volatile
    };

    const defaultFactors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const factors = baseFactors[cropType.toLowerCase()] || defaultFactors;
    
    return factors[month];
  }
}

module.exports = PredictionService;
