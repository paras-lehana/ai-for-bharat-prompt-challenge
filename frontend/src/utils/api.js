/**
 * FILE: frontend/src/utils/api.js
 * 
 * PURPOSE: API client for backend communication
 * 
 * KEY FUNCTIONS:
 *  - All API calls to backend
 *  - Automatic token attachment
 *  - Error handling
 */

import axios from 'axios';

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

// Handle errors
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

// Auth APIs
export const authAPI = {
  sendOTP: (phoneNumber) => api.post('/auth/send-otp', { phoneNumber }),
  verifyOTP: (phoneNumber, otp, userData) => api.post('/auth/verify-otp', { phoneNumber, otp, ...userData }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Listings APIs
export const listingsAPI = {
  search: (params) => api.get('/listings/search', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`)
};

// Negotiations APIs
export const negotiationsAPI = {
  create: (data) => api.post('/negotiations', data),
  getById: (id) => api.get(`/negotiations/${id}`),
  counterOffer: (id, data) => api.post(`/negotiations/${id}/counter`, data),
  accept: (id) => api.post(`/negotiations/${id}/accept`),
  reject: (id) => api.post(`/negotiations/${id}/reject`)
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

// Messages APIs
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getThread: (userId, recipientId) => api.get(`/messages/thread/${userId}/${recipientId}`),
  markRead: (id) => api.put(`/messages/${id}/read`)
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
  getNegotiations: (vendorId) => api.get(`/analytics/negotiations/${vendorId}`)
};

// Advisory APIs
export const advisoryAPI = {
  getInsights: (vendorId) => api.get(`/advisory/insights/${vendorId}`),
  getWeekly: (vendorId) => api.get(`/advisory/weekly/${vendorId}`),
  getSeasonal: (cropType) => api.get(`/advisory/seasonal/${cropType}`)
};

export default api;
