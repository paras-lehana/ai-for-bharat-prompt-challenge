/**
 * Offline Queue Manager
 * Handles queuing of actions when offline and syncing when online
 */

const QUEUE_KEY = 'offline_action_queue';

class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue();
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading offline queue:', error);
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  /**
   * Add an action to the queue
   * @param {Object} action - Action to queue
   * @param {string} action.type - Type of action (message, offer, etc.)
   * @param {string} action.endpoint - API endpoint
   * @param {string} action.method - HTTP method
   * @param {Object} action.data - Request data
   * @param {string} action.description - Human-readable description
   */
  addAction(action) {
    const queuedAction = {
      ...action,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    this.queue.push(queuedAction);
    this.saveQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue();
    }

    return queuedAction.id;
  }

  /**
   * Process all queued actions
   */
  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    const pendingActions = this.queue.filter(action => action.status === 'pending');

    for (const action of pendingActions) {
      try {
        await this.executeAction(action);
        action.status = 'completed';
        action.completedAt = new Date().toISOString();
      } catch (error) {
        console.error('Error processing queued action:', error);
        action.status = 'failed';
        action.error = error.message;
        action.retryCount = (action.retryCount || 0) + 1;

        // Remove from queue if failed too many times
        if (action.retryCount >= 3) {
          action.status = 'abandoned';
        }
      }
    }

    // Remove completed and abandoned actions
    this.queue = this.queue.filter(
      action => action.status !== 'completed' && action.status !== 'abandoned'
    );
    this.saveQueue();

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('queueProcessed', {
      detail: { remaining: this.queue.length }
    }));
  }

  /**
   * Execute a queued action
   */
  async executeAction(action) {
    const { endpoint, method, data } = action;

    // Import axios dynamically to avoid circular dependencies
    const axios = (await import('axios')).default;

    const response = await axios({
      method,
      url: endpoint,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  }

  /**
   * Get all queued actions
   */
  getQueue() {
    return [...this.queue];
  }

  /**
   * Get count of pending actions
   */
  getPendingCount() {
    return this.queue.filter(action => action.status === 'pending').length;
  }

  /**
   * Clear all queued actions
   */
  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Remove a specific action from queue
   */
  removeAction(actionId) {
    this.queue = this.queue.filter(action => action.id !== actionId);
    this.saveQueue();
  }
}

// Create singleton instance
const offlineQueue = new OfflineQueue();

export default offlineQueue;
