import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorsAPI } from '../utils/api';

export default function VendorProfile() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorData();
  }, [id]);

  const loadVendorData = async () => {
    try {
      const response = await vendorsAPI.getById(id);
      setVendor(response.data.vendor);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!vendor) {
    return <div className="text-center py-12">Vendor not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Vendor Info */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold">{vendor.name || 'Anonymous Vendor'}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-yellow-500">⭐⭐⭐⭐</span>
              <span>(4.2 rating)</span>
              <span>•</span>
              <span>15 transactions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{listings.length}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">98%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">2h</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            ✓ Verified Seller
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            ⭐ Trusted Vendor
          </span>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-2xl font-bold mb-4">Active Listings</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <Link key={listing.id} to={`/listing/${listing.id}`} className="card hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">{listing.cropType}</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary-600">₹{listing.finalPrice}</span>
              <span className="text-sm text-gray-600">{listing.quantity} {listing.unit}</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {listing.qualityTier}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12 card">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600">No active listings</p>
        </div>
      )}
    </div>
  );
}
