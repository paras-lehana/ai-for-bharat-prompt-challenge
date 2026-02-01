/**
 * FILE: frontend/src/utils/api.js
 * 
 * PURPOSE: API client for backend communication
 * 
 * KEY FUNCTIONS:
 *  - All API calls to backend
 *  - Automatic token attachment
 *  - Error handling
 *  - Offline support with caching and queuing
 */

import axios from 'axios';
import cacheManager from './cacheManager';
import offlineQueue from './offlineQueue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors and offline scenarios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to handle offline requests
 * Queues the request if offline and returns cached data if available
 */
const handleOfflineRequest = async (requestFn, cacheKey, queueData) => {
  if (!navigator.onLine) {
    // Queue the request for later if it's a write operation
    if (queueData) {
      offlineQueue.addAction(queueData);
    }

    // Return cached data if available
    if (cacheKey) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return { data: cached, fromCache: true };
      }
    }

    throw new Error('No internet connection and no cached data available');
  }

  try {
    const response = await requestFn();
    
    // Cache successful responses
    if (cacheKey && response.data) {
      cacheManager.set(cacheKey, response.data);
    }

    return response;
  } catch (error) {
    // If request fails and we have cached data, return it
    if (cacheKey) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.warn('Request failed, returning cached data');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  sendOTP: (phoneNumber) => api.post('/auth/send-otp', { phoneNumber }),
  verifyOTP: (phoneNumber, otp, userData) => api.post('/auth/verify-otp', { phoneNumber, otp, ...userData }),
  getMe: () => handleOfflineRequest(
    () => api.get('/auth/me'),
    'cached_user_profile'
  ),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Listings APIs with offline support
export const listingsAPI = {
  search: (params) => handleOfflineRequest(
    () => api.get('/listings/search', { params }),
    'cached_listings'
  ),
  getById: (id) => handleOfflineRequest(
    () => api.get(`/listings/${id}`),
    `cached_listing_${id}`
  ),
  create: (data) => {
    if (!navigator.onLine) {
      offlineQueue.addAction({
        type: 'create_listing',
        endpoint: '/api/listings',
        method: 'POST',
        data,
        description: `Create listing for ${data.cropType}`
      });
      return Promise.resolve({ data: { queued: true }, fromQueue: true });
    }
    return api.post('/listings', data);
  },
  update: (id, data) => {
    if (!navigator.onLine) {
      offlineQueue.addAction({
        type: 'update_listing',
        endpoint: `/api/listings/${id}`,
        method: 'PUT',
        data,
        description: `Update listing ${id}`
      });
      return Promise.resolve({ data: { queued: true }, fromQueue: true });
    }
    return api.put(`/listings/${id}`, data);
  },
  delete: (id) => api.delete(`/listings/${id}`)
};

// Negotiations APIs with offline support
export const negotiationsAPI = {
  create: (data) => {
    if (!navigator.onLine) {
      offlineQueue.addAction({
        type: 'create_negotiation',
        endpoint: '/api/negotiations',
        method: 'POST',
        data,
        description: `Make offer on listing ${data.listingId}`
      });
      return Promise.resolve({ data: { queued: true }, fromQueue: true });
    }
    return api.post('/negotiations', data);
  },
  getById: (id) => handleOfflineRequest(
    () => api.get(`/negotiations/${id}`),
    `cached_negotiation_${id}`
  ),
  counterOffer: (id, data) => {
    if (!navigator.onLine) {
      offlineQueue.addAction({
        type: 'counter_offer',
        endpoint: `/api/negotiations/${id}/counter`,
        method: 'POST',
        data,
        description: `Counter offer on negotiation ${id}`
      });
      return Promise.resolve({ data: { queued: true }, fromQueue: true });
    }
    return api.post(`/negotiations/${id}/counter`, data);
  },
  accept: (id) => api.post(`/negotiations/${id}/accept`),
  reject: (id) => api.post(`/negotiations/${id}/reject`),
  withdraw: (id) => api.post(`/negotiations/${id}/reject`),
  getMyNegotiations: () => handleOfflineRequest(
    () => api.get('/negotiations/my/all'),
    'cached_negotiations'
  )
};

// Voice APIs
export const voiceAPI = {
  query: (audioBase64, languageCode) => api.post('/voice/query', { audioBase64, languageCode }),
  transcribe: (audioBase64, languageCode) => api.post('/voice/transcribe', { audioBase64, languageCode }),
  synthesize: (text, languageCode) => api.post('/voice/synthesize', { text, languageCode })
};

// Prices APIs
export const pricesAPI = {
  getCurrent: (cropType, location) => api.get('/prices/current', { params: { cropType, location } }),
  calculate: (data) => api.post('/prices/calculate', data)
};

// Vendors APIs
export const vendorsAPI = {
  getNearby: (params) => api.get('/vendors/nearby', { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  getListings: (id) => api.get(`/vendors/${id}/listings`)
};

// Ratings APIs
export const ratingsAPI = {
  create: (data) => api.post('/ratings', data),
  getByUser: (userId) => api.get(`/ratings/${userId}`)
};

// Messages APIs with offline support
export const messagesAPI = {
  sendMessage: (data) => {
    if (!navigator.onLine) {
      offlineQueue.addAction({
        type: 'send_message',
        endpoint: '/api/messages',
        method: 'POST',
        data,
        description: `Send message to ${data.recipientId}`
      });
      return Promise.resolve({ data: { queued: true }, fromQueue: true });
    }
    return api.post('/messages', data);
  },
  getThread: (userId, recipientId) => {
    const threadId = `${userId}_${recipientId}`;
    return handleOfflineRequest(
      () => api.get(`/messages/thread/${userId}/${recipientId}`),
      `cached_messages_${threadId}`
    );
  },
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  getConversations: () => handleOfflineRequest(
    () => api.get('/messages/conversations'),
    'cached_conversations'
  )
};

// Discovery APIs
export const discoveryAPI = {
  getNearby: (params) => api.get('/discovery/nearby', { params }),
  getAggregation: (listingId) => api.get(`/discovery/aggregation/${listingId}`)
};

// Transactions APIs
export const transactionsAPI = {
  getById: (id) => api.get(`/transactions/${id}`),
  confirm: (id) => api.put(`/transactions/${id}/confirm`),
  ship: (id) => api.put(`/transactions/${id}/ship`),
  deliver: (id) => api.put(`/transactions/${id}/deliver`),
  getByBuyer: (buyerId) => api.get(`/transactions/buyer/${buyerId}`),
  getByVendor: (vendorId) => api.get(`/transactions/vendor/${vendorId}`)
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: (vendorId) => api.get(`/analytics/dashboard/${vendorId}`),
  getPricing: (vendorId) => api.get(`/analytics/pricing/${vendorId}`),
  getNegotiations: (vendorId) => api.get(`/analytics/negotiations/${vendorId}`),
  trackShare: (data) => api.post('/analytics/share', data),
  getShareStats: (listingId) => api.get(`/analytics/shares/${listingId}`),
  getShareHistory: () => api.get('/analytics/shares/user/history')
};

// Advisory APIs
export const advisoryAPI = {
  getInsights: (vendorId) => api.get(`/advisory/insights/${vendorId}`),
  getWeekly: (vendorId) => api.get(`/advisory/weekly/${vendorId}`),
  getSeasonal: (cropType) => api.get(`/advisory/seasonal/${cropType}`)
};

// Favorites APIs
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (listingId) => api.delete(`/favorites/${listingId}`),
  check: (listingId) => api.get(`/favorites/check/${listingId}`),
  update: (listingId, data) => api.patch(`/favorites/${listingId}`, data)
};

// Saved Searches APIs
export const savedSearchesAPI = {
  getAll: () => api.get('/saved-searches'),
  create: (data) => api.post('/saved-searches', data),
  update: (id, data) => api.put(`/saved-searches/${id}`, data),
  execute: (id) => api.get(`/saved-searches/${id}/execute`),
  delete: (id) => api.delete(`/saved-searches/${id}`)
};

// Share APIs
export const shareAPI = {
  generateQR: (listingId) => api.get(`/share/qr/${listingId}`),
  downloadQR: (listingId) => api.get(`/share/qr/${listingId}/download`, { responseType: 'blob' }),
  trackShare: (data) => api.post('/share/track', data)
};

// Weather APIs
export const weatherAPI = {
  getCurrent: (location) => api.get(`/weather/current/${location}`),
  getForecast: (location) => api.get(`/weather/forecast/${location}`),
  getAdvisory: (location, crop) => api.get(`/weather/advisory/${location}`, { params: { crop } })
};

// Prediction APIs
export const predictionAPI = {
  getForecast: (cropType, location, days) => api.get(`/predictions/${cropType}/${location}`, { params: { days } })
};

// Quality APIs
export const qualityAPI = {
  assess: (data) => api.post('/quality/assess', data)
};

// Logistics APIs
export const logisticsAPI = {
  getEstimates: (data) => api.post('/logistics/estimate', data),
  book: (data) => api.post('/logistics/book', data)
};

// Community APIs
export const communityAPI = {
  getPosts: (params) => api.get('/community', { params }),
  getPost: (id) => api.get(`/community/${id}`),
  createPost: (data) => api.post('/community', data),
  addComment: (postId, data) => api.post(`/community/${postId}/comments`, data),
  likePost: (postId) => api.post(`/community/${postId}/like`)
};

// Integration APIs (eNAM, ODOP, GeM)
export const integrationAPI = {
  // ODOP
  checkODOP: (cropType, district) => api.get('/integration/odop/check', { params: { cropType, district } }),
  getODOPDistricts: (cropType) => api.get('/integration/odop/districts', { params: { cropType } }),
  
  // GeM
  getGeMGuide: (language = 'en') => api.get('/integration/gem/guide', { params: { language } }),
  
  // eNAM
  syncTransaction: (transactionId) => api.post('/integration/enam/sync', { transactionId }),
  updateENAMPreference: (enabled) => api.put('/integration/enam/preference', { enabled }),
  getENAMStatus: () => api.get('/integration/enam/status')
};

export default api;
