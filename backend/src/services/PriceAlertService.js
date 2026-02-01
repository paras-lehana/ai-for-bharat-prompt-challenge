/**
 * FILE: backend/src/services/PriceAlertService.js
 * 
 * PURPOSE: Service for checking and triggering price alerts
 * 
 * RESPONSIBILITIES:
 *  - Check active price alerts against current prices
 *  - Trigger notifications when alert conditions are met
 *  - Get current prices from listings and eNAM data
 *  - Manage alert triggering frequency
 */

const PriceAlert = require('../models/PriceAlert');
const Listing = require('../models/Listing');
const ENAMPrice = require('../models/ENAMPrice');
const User = require('../models/User');
const { Op } = require('sequelize');

class PriceAlertService {
  /**
   * Check all active price alerts and trigger notifications
   */
  static async checkAllAlerts() {
    try {
      console.log('[PriceAlertService] Checking all active price alerts...');
      
      const alerts = await PriceAlert.findAll({
        where: { isActive: true },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'phone', 'languagePreference'] }]
      });
      
      console.log(`[PriceAlertService] Found ${alerts.length} active alerts to check`);
      
      const triggeredAlerts = [];
      
      for (const alert of alerts) {
        const result = await this.checkAlert(alert);
        if (result.triggered) {
          triggeredAlerts.push(result);
        }
      }
      
      console.log(`[PriceAlertService] Triggered ${triggeredAlerts.length} alerts`);
      
      return {
        checked: alerts.length,
        triggered: triggeredAlerts.length,
        alerts: triggeredAlerts
      };
    } catch (error) {
      console.error('[PriceAlertService] Error checking alerts:', error);
      throw error;
    }
  }
  
  /**
   * Check a single price alert
   */
  static async checkAlert(alert) {
    try {
      // Get current price for the crop
      const currentPrice = await this.getCurrentPrice(alert.cropType, alert.location);
      
      if (!currentPrice) {
        return { triggered: false, reason: 'No price data available' };
      }
      
      let shouldTrigger = false;
      
      // Check if alert condition is met
      if (alert.alertType === 'below' && currentPrice <= parseFloat(alert.targetPrice)) {
        shouldTrigger = true;
      } else if (alert.alertType === 'above' && currentPrice >= parseFloat(alert.targetPrice)) {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        // Check if we should throttle (don't trigger too frequently)
        if (alert.lastTriggered) {
          const hoursSinceLastTrigger = (Date.now() - new Date(alert.lastTriggered).getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastTrigger < 24) {
            // Don't trigger again within 24 hours
            return { 
              triggered: false, 
              reason: 'Already triggered within last 24 hours',
              lastTriggered: alert.lastTriggered
            };
          }
        }
        
        // Update last triggered timestamp
        alert.lastTriggered = new Date();
        await alert.save();
        
        // Send notification
        await this.sendNotification(alert, currentPrice);
        
        return {
          triggered: true,
          alert: alert.toJSON(),
          currentPrice,
          message: this.formatAlertMessage(alert, currentPrice)
        };
      }
      
      return { triggered: false, reason: 'Condition not met' };
    } catch (error) {
      console.error('[PriceAlertService] Error checking alert:', error);
      return { triggered: false, error: error.message };
    }
  }
  
  /**
   * Get current price for a crop
   */
  static async getCurrentPrice(cropType, location) {
    try {
      // First try to get from active listings
      const whereClause = { 
        cropType,
        status: 'available'
      };
      
      // Add location filter if specified
      if (location) {
        whereClause.locationAddress = { [Op.like]: `%${location}%` };
      }
      
      const listings = await Listing.findAll({
        where: whereClause,
        attributes: ['finalPrice'],
        limit: 20,
        order: [['createdAt', 'DESC']]
      });
      
      if (listings.length > 0) {
        // Calculate average price from recent listings
        const sum = listings.reduce((acc, listing) => acc + parseFloat(listing.finalPrice), 0);
        const avgPrice = sum / listings.length;
        console.log(`[PriceAlertService] Found ${listings.length} listings for ${cropType}, avg price: ₹${avgPrice.toFixed(2)}`);
        return avgPrice;
      }
      
      // Fallback to eNAM prices
      const enamPrice = await ENAMPrice.findOne({
        where: { cropType },
        order: [['fetchedAt', 'DESC']] // Updated from timestamp to fetchedAt
      });
      
      if (enamPrice) {
        console.log(`[PriceAlertService] Using eNAM price for ${cropType}: ₹${enamPrice.modalPrice}`);
        return parseFloat(enamPrice.modalPrice);
      }
      
      console.log(`[PriceAlertService] No price data found for ${cropType}`);
      return null;
    } catch (error) {
      console.error('[PriceAlertService] Error getting current price:', error);
      return null;
    }
  }
  
  /**
   * Send notification for triggered alert
   */
  static async sendNotification(alert, currentPrice) {
    try {
      const message = this.formatAlertMessage(alert, currentPrice);
      
      console.log(`[PriceAlertService] Notification for user ${alert.userId}:`, message);
      
      // For MVP, we just log the notification
      // In production, this would send SMS, push notification, or in-app notification
      // based on alert.notificationMethod
      
      switch (alert.notificationMethod) {
        case 'sms':
          // TODO: Integrate with SMS gateway
          console.log(`[PriceAlertService] Would send SMS to user ${alert.userId}`);
          break;
        case 'push':
          // TODO: Integrate with push notification service
          console.log(`[PriceAlertService] Would send push notification to user ${alert.userId}`);
          break;
        case 'both':
          console.log(`[PriceAlertService] Would send SMS and push to user ${alert.userId}`);
          break;
        case 'in-app':
        default:
          // In-app notifications would be fetched by frontend
          console.log(`[PriceAlertService] In-app notification ready for user ${alert.userId}`);
          break;
      }
      
      return true;
    } catch (error) {
      console.error('[PriceAlertService] Error sending notification:', error);
      return false;
    }
  }
  
  /**
   * Format alert message
   */
  static formatAlertMessage(alert, currentPrice) {
    const direction = alert.alertType === 'below' ? 'dropped to' : 'risen to';
    const emoji = alert.alertType === 'below' ? '📉' : '📈';
    
    return `${emoji} Price Alert! ${alert.cropType} has ${direction} ₹${currentPrice.toFixed(2)}/quintal (your target: ₹${alert.targetPrice})`;
  }
  
  /**
   * Get triggered alerts for a user (for in-app notifications)
   */
  static async getTriggeredAlertsForUser(userId) {
    try {
      // Get alerts triggered in the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const alerts = await PriceAlert.findAll({
        where: {
          userId,
          isActive: true,
          lastTriggered: {
            [Op.gte]: sevenDaysAgo
          }
        },
        order: [['lastTriggered', 'DESC']]
      });
      
      const notifications = [];
      
      for (const alert of alerts) {
        const currentPrice = await this.getCurrentPrice(alert.cropType, alert.location);
        if (currentPrice) {
          notifications.push({
            id: alert.id,
            message: this.formatAlertMessage(alert, currentPrice),
            cropType: alert.cropType,
            currentPrice,
            targetPrice: alert.targetPrice,
            alertType: alert.alertType,
            triggeredAt: alert.lastTriggered
          });
        }
      }
      
      return notifications;
    } catch (error) {
      console.error('[PriceAlertService] Error getting triggered alerts:', error);
      return [];
    }
  }
}

module.exports = PriceAlertService;
