/**
 * Cache Manager
 * Handles caching of listings, messages, and other data for offline access
 */

const CACHE_KEYS = {
  LISTINGS: 'cached_listings',
  MESSAGES: 'cached_messages',
  USER_PROFILE: 'cached_user_profile',
  NEGOTIATIONS: 'cached_negotiations',
  LAST_SYNC: 'last_sync_time'
};

const CACHE_EXPIRY = {
  LISTINGS: 30 * 60 * 1000, // 30 minutes
  MESSAGES: 15 * 60 * 1000, // 15 minutes
  USER_PROFILE: 60 * 60 * 1000, // 1 hour
  NEGOTIATIONS: 15 * 60 * 1000 // 15 minutes
};

class CacheManager {
  /**
   * Save data to cache with timestamp
   */
  set(key, data) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheEntry));
      return true;
    } catch (error) {
      console.error('Error saving to cache:', error);
      return false;
    }
  }

  /**
   * Get data from cache if not expired
   */
  get(key, expiryTime = null) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      
      // Check if expired
      if (expiryTime && Date.now() - cacheEntry.timestamp > expiryTime) {
        this.remove(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Remove data from cache
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from cache:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  clearAll() {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  /**
   * Cache listings
   */
  cacheListings(listings) {
    return this.set(CACHE_KEYS.LISTINGS, listings);
  }

  /**
   * Get cached listings
   */
  getCachedListings() {
    return this.get(CACHE_KEYS.LISTINGS, CACHE_EXPIRY.LISTINGS);
  }

  /**
   * Cache messages for a thread
   */
  cacheMessages(threadId, messages) {
    const allMessages = this.get(CACHE_KEYS.MESSAGES) || {};
    allMessages[threadId] = {
      messages,
      timestamp: Date.now()
    };
    return this.set(CACHE_KEYS.MESSAGES, allMessages);
  }

  /**
   * Get cached messages for a thread
   */
  getCachedMessages(threadId) {
    const allMessages = this.get(CACHE_KEYS.MESSAGES);
    if (!allMessages || !allMessages[threadId]) return null;

    const threadData = allMessages[threadId];
    
    // Check if expired
    if (Date.now() - threadData.timestamp > CACHE_EXPIRY.MESSAGES) {
      return null;
    }

    return threadData.messages;
  }

  /**
   * Cache user profile
   */
  cacheUserProfile(profile) {
    return this.set(CACHE_KEYS.USER_PROFILE, profile);
  }

  /**
   * Get cached user profile
   */
  getCachedUserProfile() {
    return this.get(CACHE_KEYS.USER_PROFILE, CACHE_EXPIRY.USER_PROFILE);
  }

  /**
   * Cache negotiations
   */
  cacheNegotiations(negotiations) {
    return this.set(CACHE_KEYS.NEGOTIATIONS, negotiations);
  }

  /**
   * Get cached negotiations
   */
  getCachedNegotiations() {
    return this.get(CACHE_KEYS.NEGOTIATIONS, CACHE_EXPIRY.NEGOTIATIONS);
  }

  /**
   * Update last sync time
   */
  updateLastSync() {
    return this.set(CACHE_KEYS.LAST_SYNC, Date.now());
  }

  /**
   * Get last sync time
   */
  getLastSync() {
    return this.get(CACHE_KEYS.LAST_SYNC);
  }

  /**
   * Check if cache is stale
   */
  isCacheStale(key, expiryTime) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return true;

      const cacheEntry = JSON.parse(cached);
      return Date.now() - cacheEntry.timestamp > expiryTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get cache size in bytes
   */
  getCacheSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Get cache size in human-readable format
   */
  getCacheSizeFormatted() {
    const bytes = this.getCacheSize();
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

export default cacheManager;
export { CACHE_KEYS, CACHE_EXPIRY };
