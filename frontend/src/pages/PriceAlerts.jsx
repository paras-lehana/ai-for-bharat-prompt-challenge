import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaCheck, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PriceAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    cropType: '',
    targetPrice: '',
    alertType: 'below',
    location: '',
    notificationMethod: 'in-app'
  });

  // Available crops (should match backend data)
  const crops = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Groundnut', 
    'Sugarcane', 'Soybean', 'Onion', 'Potato', 'Tomato'
  ];

  useEffect(() => {
    fetchAlerts();
    fetchNotifications();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/price-alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load price alerts');
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/price-alerts/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/price-alerts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset form and refresh alerts
      setFormData({
        cropType: '',
        targetPrice: '',
        alertType: 'below',
        location: '',
        notificationMethod: 'in-app'
      });
      setShowCreateForm(false);
      fetchAlerts();
    } catch (err) {
      console.error('Error creating alert:', err);
      setError(err.response?.data?.error || 'Failed to create alert');
    }
  };

  const handleUpdateAlert = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/price-alerts/${editingAlert.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingAlert(null);
      setFormData({
        cropType: '',
        targetPrice: '',
        alertType: 'below',
        location: '',
        notificationMethod: 'in-app'
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error updating alert:', err);
      setError(err.response?.data?.error || 'Failed to update alert');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/price-alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error deleting alert:', err);
      setError('Failed to delete alert');
    }
  };

  const handleToggleActive = async (alert) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/price-alerts/${alert.id}`, 
        { isActive: !alert.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAlerts();
    } catch (err) {
      console.error('Error toggling alert:', err);
      setError('Failed to update alert');
    }
  };

  const startEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      cropType: alert.cropType,
      targetPrice: alert.targetPrice,
      alertType: alert.alertType,
      location: alert.location || '',
      notificationMethod: alert.notificationMethod
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingAlert(null);
    setFormData({
      cropType: '',
      targetPrice: '',
      alertType: 'below',
      location: '',
      notificationMethod: 'in-app'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading price alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaBell className="text-3xl text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Price Alerts</h1>
                <p className="text-gray-600">Get notified when crop prices reach your target</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setEditingAlert(null);
                setFormData({
                  cropType: '',
                  targetPrice: '',
                  alertType: 'below',
                  location: '',
                  notificationMethod: 'in-app'
                });
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create Alert</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">Recent Triggered Alerts</h3>
            <div className="space-y-2">
              {notifications.map((notif, index) => (
                <div key={index} className="text-yellow-700 text-sm">
                  {notif.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingAlert) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingAlert ? 'Edit Alert' : 'Create New Alert'}
            </h2>
            <form onSubmit={editingAlert ? handleUpdateAlert : handleCreateAlert}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Crop Type *</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Crop</option>
                    {crops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Target Price (₹/quintal) *</label>
                  <input
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 2000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Alert Type *</label>
                  <select
                    value={formData.alertType}
                    onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="below">Alert when price drops below target</option>
                    <option value="above">Alert when price rises above target</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location (Optional)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Notification Method</label>
                  <select
                    value={formData.notificationMethod}
                    onChange={(e) => setFormData({ ...formData, notificationMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="in-app">In-App Notification</option>
                    <option value="sms">SMS (Coming Soon)</option>
                    <option value="push">Push Notification (Coming Soon)</option>
                    <option value="both">SMS + Push (Coming Soon)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                >
                  <FaCheck />
                  <span>{editingAlert ? 'Update Alert' : 'Create Alert'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    cancelEdit();
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Alerts</h2>
          
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No price alerts yet</p>
              <p className="text-gray-500 mt-2">Create your first alert to get notified about price changes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 transition ${
                    alert.isActive ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{alert.cropType}</h3>
                        {alert.alertType === 'below' ? (
                          <FaArrowDown className="text-red-500" />
                        ) : (
                          <FaArrowUp className="text-green-500" />
                        )}
                        <span className="text-gray-600">
                          {alert.alertType === 'below' ? 'Below' : 'Above'} ₹{alert.targetPrice}/quintal
                        </span>
                        {!alert.isActive && (
                          <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded">Inactive</span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {alert.location && (
                          <p>📍 Location: {alert.location}</p>
                        )}
                        <p>🔔 Notification: {alert.notificationMethod}</p>
                        {alert.lastTriggered && (
                          <p>⏰ Last triggered: {new Date(alert.lastTriggered).toLocaleString()}</p>
                        )}
                        <p>📅 Created: {new Date(alert.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(alert)}
                        className={`px-4 py-2 rounded-lg transition ${
                          alert.isActive
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        title={alert.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {alert.isActive ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => startEdit(alert)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAlerts;
