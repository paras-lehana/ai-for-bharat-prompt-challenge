import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingsAPI } from '../utils/api';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function BrowseListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cropType: '',
    qualityTier: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.search(filters);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">Browse Listings</h1>

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline mr-1" />
              Crop Type
            </label>
            <input
              type="text"
              value={filters.cropType}
              onChange={(e) => setFilters({ ...filters, cropType: e.target.value })}
              placeholder="e.g., tomato"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline mr-1" />
              Quality
            </label>
            <select
              value={filters.qualityTier}
              onChange={(e) => setFilters({ ...filters, qualityTier: e.target.value })}
              className="input-field"
            >
              <option value="">All</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="basic">Basic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="₹0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="₹1000"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-6xl">
                🌾
              </div>
              
              <h3 className="font-bold text-xl mb-2">{listing.cropType}</h3>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl font-bold text-primary-600">₹{listing.finalPrice}</span>
                <span className="text-gray-600">/{listing.unit}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                  listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {listing.qualityTier}
                </span>
                <span className="text-sm text-gray-600">{listing.quantity} {listing.unit}</span>
              </div>

              {listing.vendor && (
                <div className="text-sm text-gray-600 border-t pt-3">
                  <div>Vendor: {listing.vendor.name || 'Anonymous'}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">⭐⭐⭐⭐</span>
                    <span className="ml-1">(4.2)</span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
