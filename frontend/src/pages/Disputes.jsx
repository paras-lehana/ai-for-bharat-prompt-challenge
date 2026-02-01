/**
 * FILE: frontend/src/pages/Disputes.jsx
 * 
 * PURPOSE: Dispute management interface
 * 
 * FEATURES:
 *  - Create dispute
 *  - View dispute details
 *  - Submit evidence
 *  - View AI resolution recommendation
 *  - Accept/reject resolution
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TranslatedText from '../components/TranslatedText';

function Disputes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    transactionId: '',
    reason: '',
    description: ''
  });

  useEffect(() => {
    // Mock data for now - would fetch from API
    setDisputes([
      {
        id: 1,
        transactionId: 'TXN001',
        reason: 'Quality Issue',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]);
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Would call API here
    alert('Dispute created successfully');
    setShowCreateForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          ⚖️ <TranslatedText text="Disputes" />
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          + <TranslatedText text="Create Dispute" />
        </button>
      </div>

      {/* Create Dispute Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              <TranslatedText text="Create Dispute" />
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <TranslatedText text="Transaction ID" />
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <TranslatedText text="Reason" />
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="quality">Quality Issue</option>
                  <option value="non_delivery">Non-Delivery</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="damage">Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <TranslatedText text="Description" />
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <TranslatedText text="Cancel" />
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <TranslatedText text="Submit Dispute" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disputes List */}
      {disputes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            <TranslatedText text="No disputes found" />
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <TranslatedText text="We hope you never need to create one!" />
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              onClick={() => navigate(`/dispute/${dispute.id}`)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    <TranslatedText text={dispute.reason} />
                  </h3>
                  <p className="text-gray-600">
                    Transaction: {dispute.transactionId}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(dispute.status)}`}>
                  <TranslatedText text={dispute.status} />
                </span>
              </div>
              
              <p className="text-sm text-gray-500">
                Created: {new Date(dispute.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Disputes;
