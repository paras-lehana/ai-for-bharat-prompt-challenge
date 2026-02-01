/**
 * FILE: frontend/src/pages/Analytics.jsx
 * 
 * PURPOSE: Analytics dashboard for vendors
 * 
 * FEATURES:
 *  - Sales metrics and trends
 *  - Best-selling crops
 *  - Pricing analytics
 *  - Negotiation success rates
 *  - Buyer demographics
 */

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { analyticsAPI, advisoryAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TranslatedText from '../components/TranslatedText';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const { user } = useContext(AuthContext);
  
  const [dashboard, setDashboard] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [negotiations, setNegotiations] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.role === 'vendor') {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    try {
      const [dashboardRes, pricingRes, negotiationsRes, insightsRes] = await Promise.all([
        analyticsAPI.getDashboard(user.id),
        analyticsAPI.getPricing(user.id),
        analyticsAPI.getNegotiations(user.id),
        advisoryAPI.getInsights(user.id)
      ]);
      
      setDashboard(dashboardRes.data);
      setPricing(pricingRes.data);
      setNegotiations(negotiationsRes.data);
      setInsights(insightsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics');
      setLoading(false);
    }
  };

  if (user.role !== 'vendor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <TranslatedText text="Analytics is only available for vendors" />
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        📊 <TranslatedText text="Analytics Dashboard" />
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm opacity-90 mb-2">
            <TranslatedText text="Total Sales" />
          </p>
          <p className="text-2xl sm:text-3xl font-bold">₹{dashboard?.totalSales?.toFixed(2) || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm opacity-90 mb-2">
            <TranslatedText text="Active Listings" />
          </p>
          <p className="text-2xl sm:text-3xl font-bold">{dashboard?.activeListings || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm opacity-90 mb-2">
            <TranslatedText text="Pending Negotiations" />
          </p>
          <p className="text-2xl sm:text-3xl font-bold">{dashboard?.pendingNegotiations || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm opacity-90 mb-2">
            <TranslatedText text="Trust Score" />
          </p>
          <p className="text-2xl sm:text-3xl font-bold">{dashboard?.trustScore?.toFixed(1) || 'N/A'}</p>
        </div>
      </div>

      {/* Market Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            💡 <TranslatedText text="Market Insights" />
          </h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'price_increase' ? 'bg-green-50 border-green-500' :
                  insight.type === 'high_demand' ? 'bg-blue-50 border-blue-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}
              >
                <p className="font-semibold mb-1">{insight.title}</p>
                <p className="text-sm text-gray-700">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Trends */}
      {dashboard?.salesTrends && dashboard.salesTrends.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            📈 <TranslatedText text="Sales Trends" />
          </h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <LineChart data={dashboard.salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Best Selling Crops */}
        {dashboard?.bestSellingCrops && dashboard.bestSellingCrops.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              🌾 <TranslatedText text="Best Selling Crops" />
            </h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <BarChart data={dashboard.bestSellingCrops}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Quality Tier Performance */}
        {dashboard?.qualityTierPerformance && dashboard.qualityTierPerformance.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              ⭐ <TranslatedText text="Quality Tier Performance" />
            </h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={250}>
                <PieChart>
                  <Pie
                    data={dashboard.qualityTierPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.tier}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboard.qualityTierPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Analytics */}
      {pricing && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            💰 <TranslatedText text="Pricing Analytics" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Your Average Price" />
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{pricing.averagePrice?.toFixed(2) || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Regional Average" />
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{pricing.regionalAverage?.toFixed(2) || 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Price Difference" />
              </p>
              <p className={`text-2xl font-bold ${
                (pricing.averagePrice - pricing.regionalAverage) > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {((pricing.averagePrice - pricing.regionalAverage) / pricing.regionalAverage * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Analytics */}
      {negotiations && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            🤝 <TranslatedText text="Negotiation Analytics" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Success Rate" />
              </p>
              <p className="text-2xl font-bold text-green-600">
                {negotiations.successRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Average Discount" />
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {negotiations.averageDiscount?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <TranslatedText text="Total Negotiations" />
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {negotiations.totalNegotiations || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
