/**
 * FILE: frontend/src/pages/Settings.jsx
 * 
 * PURPOSE: User settings page including eNAM data sync preferences
 * 
 * FEATURES:
 *  - eNAM data sync toggle
 *  - Profile settings
 *  - Language preferences
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI, integrationAPI } from '../utils/api';
import { FaSync, FaLanguage, FaUser, FaFileExport, FaExternalLinkAlt, FaMoon, FaSun, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, setUser } = useAuth();
  const { theme, autoMode, setAutoThemeMode, timeBasedMode, setTimeBasedThemeMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enamSyncEnabled, setEnamSyncEnabled] = useState(false);
  const [enamLoading, setEnamLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadENAMStatus();
  }, []);

  const loadENAMStatus = async () => {
    try {
      const response = await integrationAPI.getENAMStatus();
      setEnamSyncEnabled(response.data.enamDataSync || false);
    } catch (error) {
      console.error('Error loading eNAM status:', error);
    }
  };

  const handleENAMToggle = async () => {
    setEnamLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const newValue = !enamSyncEnabled;
      await integrationAPI.updateENAMPreference(newValue);
      setEnamSyncEnabled(newValue);
      setMessage({
        type: 'success',
        text: `eNAM data sync ${newValue ? 'enabled' : 'disabled'} successfully!`
      });
    } catch (error) {
      console.error('Error updating eNAM preference:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update eNAM sync preference. Please try again.'
      });
    } finally {
      setEnamLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData(e.target);
      const updates = {
        name: formData.get('name'),
        languagePreference: formData.get('language')
      };

      const response = await authAPI.updateProfile(updates);
      setUser(response.data);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-blue-600 dark:text-blue-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user?.name || ''}
              className="input-field"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLanguage className="inline mr-2" />
              Language Preference
            </label>
            <select
              name="language"
              defaultValue={user?.languagePreference || 'en'}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          {theme === 'dark' ? (
            <FaMoon className="text-indigo-600 dark:text-indigo-400 text-2xl" />
          ) : (
            <FaSun className="text-yellow-600 text-2xl" />
          )}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Theme Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Choose your preferred theme or enable automatic switching based on system settings or time of day.
            </p>
          </div>

          {/* Auto Dark Mode (System Preference) */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Auto Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow system preference (light/dark mode)
              </p>
            </div>
            <button
              onClick={() => setAutoThemeMode(!autoMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                autoMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  autoMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Time-Based Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <FaClock className="text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-800 dark:text-white">Time-Based Mode</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dark mode from 6 PM to 6 AM automatically
              </p>
            </div>
            <button
              onClick={() => setTimeBasedThemeMode(!timeBasedMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                timeBasedMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  timeBasedMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Status Messages */}
          {autoMode && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <p className="text-sm text-indigo-800 dark:text-indigo-400">
                ✓ Theme automatically follows your system preference. Toggle manually to disable.
              </p>
            </div>
          )}

          {timeBasedMode && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm text-purple-800 dark:text-purple-400">
                ✓ Theme switches automatically based on time of day (Dark: 6 PM - 6 AM). Toggle manually to disable.
              </p>
            </div>
          )}

          {!autoMode && !timeBasedMode && (
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💡 Tip: Use the theme toggle button in the navigation bar to switch between light and dark mode manually.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* eNAM Integration Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FaSync className="text-green-600 dark:text-green-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">eNAM Integration</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What is eNAM Data Sync?</h3>
            <p className="text-sm text-blue-800">
              When enabled, your transaction data will be automatically synced with the 
              Electronic National Agriculture Market (eNAM) platform. This helps improve 
              market transparency and provides you with better price insights.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Enable eNAM Data Sync</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your transaction data with eNAM
              </p>
            </div>
            <button
              onClick={handleENAMToggle}
              disabled={enamLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                enamSyncEnabled ? 'bg-green-600' : 'bg-gray-300'
              } ${enamLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  enamSyncEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {enamSyncEnabled && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ Your transactions are being synced with eNAM. You can disable this anytime.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Government Platform Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaFileExport className="text-purple-600 dark:text-purple-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Government Platforms</h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/gem-guide')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-left">
              <h3 className="font-semibold text-orange-900">GeM Registration Guide</h3>
              <p className="text-sm text-orange-700">
                Learn how to register on Government e-Marketplace
              </p>
            </div>
            <FaExternalLinkAlt className="text-orange-600" />
          </button>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <h3 className="font-semibold text-blue-900">ODOP Products</h3>
            </div>
            <p className="text-sm text-blue-700">
              Your listings for ODOP-registered products are automatically highlighted 
              with special badges to attract more buyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
