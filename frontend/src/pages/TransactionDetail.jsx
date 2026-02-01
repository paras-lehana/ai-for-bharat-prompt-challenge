/**
 * FILE: frontend/src/pages/TransactionDetail.jsx
 * 
 * PURPOSE: Detailed transaction view with action buttons
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { transactionsAPI, ratingsAPI, logisticsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TranslatedText from '../components/TranslatedText';

function TransactionDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState({ delivery: 5, quality: 5 });
  const [shippingEstimates, setShippingEstimates] = useState(null);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadShippingEstimates = async () => {
    setActionLoading(true);
    try {
      // Mock data for MVP
      const estimates = await logisticsAPI.getEstimates({
        origin: 'Pune',  // ideally transaction.vendor.location
        destination: 'Mumbai', // ideally transaction.buyer.location
        weight: transaction.quantity * 10 // Mock weight
      });
      setShippingEstimates(estimates.data);
    } catch (err) {
      console.error(err);
      alert('Could not fetch shipping estimates');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookShipment = async (provider) => {
    if (!window.confirm(`Book shipment with ${provider}?`)) return;

    setActionLoading(true);
    try {
      await logisticsAPI.book({ provider, transactionId: id });

      // Auto mark as shipped after booking
      await transactionsAPI.ship(id);

      alert(`Success! Shipment booked with ${provider}. Tracking ID generated.`);
      await loadTransaction();
      setShippingEstimates(null);
    } catch (err) {
      alert('Booking failed');
    } finally {
      setActionLoading(false);
    }
  };

  const loadTransaction = async () => {
    try {
      const response = await transactionsAPI.getById(id);
      setTransaction(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load transaction');
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await transactionsAPI.confirm(id);
      await loadTransaction();
    } catch (err) {
      setError('Failed to confirm transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async () => {
    setActionLoading(true);
    try {
      await transactionsAPI.ship(id);
      await loadTransaction();
    } catch (err) {
      setError('Failed to mark as shipped');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    setActionLoading(true);
    try {
      await transactionsAPI.deliver(id);
      await loadTransaction();
      setShowRating(true);
    } catch (err) {
      setError('Failed to confirm delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const submitRating = async () => {
    try {
      await ratingsAPI.create({
        vendorId: transaction.vendorId,
        transactionId: transaction.id,
        deliveryRating: rating.delivery,
        qualityRating: rating.quality
      });
      setShowRating(false);
      navigate('/transactions');
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Transaction not found
        </div>
      </div>
    );
  }

  const isVendor = user.role === 'vendor';
  const canConfirm = isVendor && transaction.status === 'pending';
  const canShip = isVendor && transaction.status === 'confirmed';
  const canDeliver = !isVendor && transaction.status === 'in_transit';

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/transactions')}
        className="mb-6 text-blue-500 hover:text-blue-700 flex items-center gap-2"
      >
        ← <TranslatedText text="Back to Transactions" />
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{transaction.listingTitle}</h1>
            <p className="text-gray-600">
              Transaction ID: {transaction.id}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${transaction.status === 'delivered' ? 'bg-green-100 text-green-800' :
            transaction.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
              transaction.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
            }`}>
            <TranslatedText text={transaction.status.replace('_', ' ')} />
          </span>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText text="Transaction Details" />
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Quantity" />
                </p>
                <p className="font-semibold">{transaction.quantity} {transaction.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Price per unit" />
                </p>
                <p className="font-semibold">₹{transaction.agreedPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Total Amount" />
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(transaction.quantity * transaction.agreedPrice).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Created" />
                </p>
                <p className="font-semibold">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText text="Parties Involved" />
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Vendor" />
                </p>
                <p className="font-semibold">{transaction.vendorName}</p>
                <p className="text-sm text-gray-600">{transaction.vendorPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Buyer" />
                </p>
                <p className="font-semibold">{transaction.buyerName}</p>
                <p className="text-sm text-gray-600">{transaction.buyerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Estimates UI */}
        {transaction.status === 'confirmed' && isVendor && (
          <div className="mb-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Available Shipping Carriers (AI Estimated)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hardcoded or Fetched estimates logic would go here. For now, on-click load. */}
              {!shippingEstimates ? (
                <button
                  onClick={loadShippingEstimates}
                  disabled={actionLoading}
                  className="col-span-1 md:col-span-3 py-3 border-2 border-dashed border-blue-300 rounded text-blue-600 hover:bg-blue-50"
                >
                  + View Shipping Options
                </button>
              ) : (
                shippingEstimates.estimates.map((est, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
                    onClick={() => handleBookShipment(est.provider)}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{est.provider}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase">{est.type}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">₹{est.cost}</div>
                    <div className="text-sm text-gray-500">Est: {est.estimatedDays} days</div>
                    <button className="mt-3 w-full btn-secondary text-sm">Book</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {canConfirm && (
            <button
              onClick={handleConfirm}
              disabled={actionLoading}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors font-semibold"
            >
              ✓ <TranslatedText text="Confirm Order" />
            </button>
          )}

          {canShip && !shippingEstimates && (
            // Fallback manual ship if no digital booking
            <button
              onClick={handleShip}
              disabled={actionLoading}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-semibold"
            >
              📦 <TranslatedText text="Mark as Shipped (Manual)" />
            </button>
          )}

          {canDeliver && (
            <button
              onClick={handleDeliver}
              disabled={actionLoading}
              className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors font-semibold"
            >
              ✓ <TranslatedText text="Confirm Delivery" />
            </button>
          )}
        </div>

        {/* Rating Modal */}
        {showRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">
                <TranslatedText text="Rate this transaction" />
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <TranslatedText text="Delivery Rating" />
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating({ ...rating, delivery: star })}
                        className={`text-3xl ${star <= rating.delivery ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <TranslatedText text="Quality Rating" />
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating({ ...rating, quality: star })}
                        className={`text-3xl ${star <= rating.quality ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <TranslatedText text="Skip" />
                </button>
                <button
                  onClick={submitRating}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <TranslatedText text="Submit Rating" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionDetail;
