/**
 * FILE: backend/src/utils/cronJobs.js
 * 
 * PURPOSE: Scheduled tasks for the application
 * 
 * RESPONSIBILITIES:
 *  - Check price alerts periodically
 *  - Send advisory notifications
 *  - Clean up expired data
 */

const cron = require('node-cron');
const PriceAlertService = require('../services/PriceAlertService');

/**
 * Initialize all cron jobs
 */
function initializeCronJobs() {
  console.log('[CronJobs] Initializing scheduled tasks...');
  
  // Check price alerts every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[CronJobs] Running hourly price alert check...');
    try {
      const result = await PriceAlertService.checkAllAlerts();
      console.log(`[CronJobs] Price alert check complete: ${result.triggered} alerts triggered out of ${result.checked} checked`);
    } catch (error) {
      console.error('[CronJobs] Error in price alert check:', error);
    }
  });
  
  // For testing: also check every 5 minutes in development
  if (process.env.NODE_ENV === 'development') {
    cron.schedule('*/5 * * * *', async () => {
      console.log('[CronJobs] Running development price alert check (every 5 minutes)...');
      try {
        const result = await PriceAlertService.checkAllAlerts();
        console.log(`[CronJobs] Dev check complete: ${result.triggered} alerts triggered`);
      } catch (error) {
        console.error('[CronJobs] Error in dev price alert check:', error);
      }
    });
  }
  
  console.log('[CronJobs] Scheduled tasks initialized successfully');
}

module.exports = { initializeCronJobs };
