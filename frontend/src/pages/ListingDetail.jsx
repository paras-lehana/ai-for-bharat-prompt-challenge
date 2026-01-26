import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, negotiationsAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const response = await listingsAPI.getById(id);
      setListing(response.data);
      setOfferPrice(response.data.finalPrice);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    try {
      await negotiationsAPI.create({
        listingId: id,
        initialOfferPrice: parseFloat(offerPrice),
        message: offerMessage
      });
      alert('Offer sent successfully!');
      navigate('/negotiations');
    } catch (error) {
      console.error('Error making offer:', error);
      alert('Failed to send offer');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!listing) {
    return <div className="text-center py-12">Listing not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="card">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-9xl">
            🌾
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{listing.cropType}</h1>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                ₹{listing.finalPrice}
                <span className="text-lg text-gray-600">/{listing.unit}</span>
              </div>
              <div className="text-sm text-gray-600">
                Base: ₹{listing.basePrice} × {listing.qualityMultiplier} (quality) × {listing.demandAdjuster} (demand)
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Quality:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                  listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {listing.qualityTier}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{listing.quantity} {listing.unit}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{listing.locationAddress || 'Delhi'}</span>
              </div>
            </div>

            {listing.description && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-600">{listing.description}</p>
              </div>
            )}

            {/* Vendor Info */}
            {listing.vendor && (
              <div className="border-t pt-4 mb-6">
                <h3 className="font-bold mb-2">Vendor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">{listing.vendor.name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-600">
                      <span className="text-yellow-500">⭐⭐⭐⭐</span> (4.2)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {user?.role === 'buyer' && listing.vendorId !== user.id && (
              <div>
                {!showOfferForm ? (
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="btn-primary w-full"
                  >
                    Make an Offer
                  </button>
                ) : (
                  <form onSubmit={handleMakeOffer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Offer (₹/{listing.unit})
                      </label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="input-field"
                        rows="3"
                        placeholder="Any additional details..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button type="submit" className="btn-primary flex-1">
                        Send Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
