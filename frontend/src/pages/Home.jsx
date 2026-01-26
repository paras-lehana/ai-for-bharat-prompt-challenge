import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { listingsAPI, voiceAPI } from '../utils/api';
import { FiMic, FiSearch, FiTrendingUp, FiUsers, FiShield, FiGlobe } from 'react-icons/fi';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [voiceQuery, setVoiceQuery] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState(null);

  useEffect(() => {
    loadFeaturedListings();
  }, []);

  const loadFeaturedListings = async () => {
    try {
      const response = await listingsAPI.search({ limit: 4 });
      setFeaturedListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleVoiceQuery = async () => {
    setVoiceQuery(true);
    try {
      // Mock voice query for MVP
      const response = await voiceAPI.query('mock-audio', user.languagePreference);
      setVoiceResponse(response.data);
    } catch (error) {
      console.error('Voice query error:', error);
    } finally {
      setVoiceQuery(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome, {user?.name || 'Farmer'}! 🌾
        </h1>
        <p className="text-lg mb-6">
          Trade in Your Language. Negotiate Fairly. Earn More.
        </p>
        
        {/* Voice Query Button */}
        <button
          onClick={handleVoiceQuery}
          disabled={voiceQuery}
          className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 min-h-[56px]"
        >
          <FiMic className="w-6 h-6" />
          <span>{voiceQuery ? 'Listening...' : '🎤 Ask Price'}</span>
        </button>

        {voiceResponse && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm mb-2">Response:</p>
            <p className="font-medium">{voiceResponse.text}</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">1,000+</div>
          <div className="text-sm text-gray-600">Active Listings</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">500+</div>
          <div className="text-sm text-gray-600">Vendors</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">₹50L</div>
          <div className="text-sm text-gray-600">Traded</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">6</div>
          <div className="text-sm text-gray-600">Languages</div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Multilingual Mandi?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <FiMic className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Voice Queries</h3>
            <p className="text-gray-600 text-sm">Ask prices in your language. No reading required.</p>
          </div>
          
          <div className="card">
            <FiTrendingUp className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
            <p className="text-gray-600 text-sm">Transparent quality-based pricing formula.</p>
          </div>
          
          <div className="card">
            <FiUsers className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Find Peers</h3>
            <p className="text-gray-600 text-sm">Discover vendors nearby. Collaborate on bulk orders.</p>
          </div>
          
          <div className="card">
            <FiShield className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Trust System</h3>
            <p className="text-gray-600 text-sm">Transparent ratings and AI dispute resolution.</p>
          </div>
          
          <div className="card">
            <FiGlobe className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">eNAM Integration</h3>
            <p className="text-gray-600 text-sm">Live prices from government platforms.</p>
          </div>
          
          <div className="card">
            <FiSearch className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Smart Search</h3>
            <p className="text-gray-600 text-sm">Find products by quality, location, price.</p>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-4xl">
                🌾
              </div>
              <h3 className="font-bold text-lg mb-2">{listing.cropType}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-primary-600">₹{listing.finalPrice}</span>
                <span className="text-sm text-gray-600">/{listing.unit}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  {listing.qualityTier}
                </span>
                <span>{listing.quantity} {listing.unit}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of farmers trading in their local language
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse" className="btn-primary">
            Browse Listings
          </Link>
          {user?.role === 'vendor' && (
            <Link to="/create-listing" className="btn-secondary">
              List Your Product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
