/**
 * FILE: frontend/src/pages/Transactions.jsx
 * 
 * PURPOSE: Transaction history and management
 * 
 * FEATURES:
 *  - View all transactions
 *  - Filter by status
 *  - Transaction details
 *  - Status updates (confirm, ship, deliver)
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { transactionsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TranslatedText from '../components/TranslatedText';
import PageSummarizer from '../components/PageSummarizer';

function Transactions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = user.role === 'vendor'
        ? await transactionsAPI.getByVendor(user.id)
        : await transactionsAPI.getByBuyer(user.id);

      setTransactions(response.data.transactions || []);

      setError(null);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.status === filter);

  if (!user || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          <TranslatedText text="My Transactions" />
        </h1>

        <div className="flex gap-2 w-full sm:w-auto">
          {filteredTransactions.length > 0 && (
            <div className="w-full sm:w-auto">
              <PageSummarizer pageType="transactions" data={filteredTransactions} />
            </div>
          )}
          <button
            onClick={() => navigate('/analytics')}
            className="w-full sm:w-auto px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[48px] flex items-center justify-center gap-2"
          >
            📊 <TranslatedText text="Analytics" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {['all', 'pending', 'confirmed', 'in_transit', 'delivered', 'disputed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 sm:py-3 rounded-lg whitespace-nowrap transition-colors min-h-[44px] text-sm sm:text-base ${filter === status
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <TranslatedText text={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} />
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            <TranslatedText text="No transactions found" />
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => navigate(`/transaction/${transaction.id}`)}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {transaction.listingTitle || 'Transaction'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {user.role === 'vendor' ? 'Buyer' : 'Vendor'}: {transaction.otherPartyName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(transaction.status)}`}>
                  <TranslatedText text={(transaction.status || 'pending').replace('_', ' ')} />
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslatedText text="Quantity" />
                  </p>
                  <p className="font-semibold">{transaction.quantity || 0} {transaction.unit || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslatedText text="Price" />
                  </p>
                  <p className="font-semibold">₹{transaction.agreedPrice || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslatedText text="Total" />
                  </p>
                  <p className="font-semibold text-green-600">
                    ₹{((transaction.quantity || 0) * (transaction.agreedPrice || 0)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <TranslatedText text="Date" />
                  </p>
                  <p className="font-semibold">
                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
                <div className={`flex items-center whitespace-nowrap ${transaction.status !== 'pending' ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-1">✓</span>
                  <TranslatedText text="Created" />
                </div>
                <div className="flex-1 h-0.5 min-w-[10px] bg-gray-300"></div>
                <div className={`flex items-center whitespace-nowrap ${['confirmed', 'in_transit', 'delivered'].includes(transaction.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-1">✓</span>
                  <TranslatedText text="Confirmed" />
                </div>
                <div className="flex-1 h-0.5 min-w-[10px] bg-gray-300"></div>
                <div className={`flex items-center whitespace-nowrap ${['in_transit', 'delivered'].includes(transaction.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-1">✓</span>
                  <TranslatedText text="Shipped" />
                </div>
                <div className="flex-1 h-0.5 min-w-[10px] bg-gray-300"></div>
                <div className={`flex items-center whitespace-nowrap ${transaction.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-1">✓</span>
                  <TranslatedText text="Delivered" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;
