import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaBell, FaBellSlash, FaTrash, FaFilter } from 'react-icons/fa';
import { favoritesAPI } from '../utils/api';
import { getCropImageUrl } from '../utils/cropImageMapper';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('');
  const [availableCrops, setAvailableCrops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterFavorites();
  }, [favorites, cropFilter]);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      const favData = response.data;
      setFavorites(favData);
      
      // Extract unique crop types
      const crops = [...new Set(favData.map(f => f.listing?.cropType).filter(Boolean))];
      setAvailableCrops(crops.sort());
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFavorites = () => {
    if (!cropFilter) {
      setFilteredFavorites(favorites);
    } else {
      setFilteredFavorites(
        favorites.filter(f => 
          f.listing?.cropType?.toLowerCase().includes(cropFilter.toLowerCase())
        )
      );
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      await favoritesAPI.remove(listingId);
      setFavorites(favorites.filter(f => f.listingId !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const toggleNotifications = async (listingId, currentValue) => {
    try {
      await favoritesAPI.update(listingId, {
        notifyOnPriceChange: !currentValue
      });
      setFavorites(favorites.map(f => 
        f.listingId === listingId 
          ? { ...f, notifyOnPriceChange: !currentValue }
          : f
      ));
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaHeart className="text-red-500 text-2xl" />
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            {favorites.length}
          </span>
        </div>

        {/* Crop Filter */}
        {availableCrops.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FaFilter className="text-gray-500" />
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Crops ({favorites.length})</option>
              {availableCrops.map(crop => {
                const count = favorites.filter(f => f.listing?.cropType === crop).length;
                return (
                  <option key={crop} value={crop}>
                    {crop} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No favorites yet</p>
          <p className="text-gray-500 text-sm mt-2">Start adding listings to your favorites to see them here</p>
          <button
            onClick={() => navigate('/browse')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Browse Listings
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaFilter className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No favorites match this filter</p>
          <button
            onClick={() => setCropFilter('')}
            className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => {
            // Handle images
            let images = [];
            if (favorite.listing?.images) {
              if (Array.isArray(favorite.listing.images)) {
                images = favorite.listing.images;
              } else if (typeof favorite.listing.images === 'string') {
                try {
                  images = JSON.parse(favorite.listing.images);
                } catch (e) {
                  images = [];
                }
              }
            }
            const imageUrl = images[0] || getCropImageUrl(favorite.listing?.cropType);

            return (
              <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Image */}
                <div className="aspect-square bg-gray-200 overflow-hidden relative">
                  <img 
                    src={imageUrl}
                    alt={favorite.listing?.cropType}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/crops/wheat.jpg';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold capitalize">{favorite.listing?.cropType}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleNotifications(favorite.listingId, favorite.notifyOnPriceChange)}
                        className="text-gray-600 hover:text-blue-600 transition"
                        title={favorite.notifyOnPriceChange ? 'Notifications ON' : 'Notifications OFF'}
                      >
                        {favorite.notifyOnPriceChange ? <FaBell /> : <FaBellSlash />}
                      </button>
                      <button
                        onClick={() => removeFavorite(favorite.listingId)}
                        className="text-gray-600 hover:text-red-600 transition"
                        title="Remove from favorites"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{favorite.listing?.finalPrice || favorite.listing?.pricePerUnit}/{favorite.listing?.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Quantity:</span>
                      <span>{favorite.listing?.quantity} {favorite.listing?.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Quality:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        favorite.listing?.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                        favorite.listing?.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {favorite.listing?.qualityTier || favorite.listing?.quality}
                      </span>
                    </div>
                    {favorite.listing?.location && (
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span className="text-right">{favorite.listing.location}</span>
                      </div>
                    )}
                    {favorite.listing?.vendor && (
                      <div className="flex justify-between">
                        <span className="font-medium">Vendor:</span>
                        <span>{favorite.listing.vendor.name || 'N/A'}</span>
                      </div>
                    )}
                  </div>

                  {favorite.targetPrice && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                      <p className="text-blue-700">
                        <FaBell className="inline mr-1" />
                        Alert at ₹{favorite.targetPrice}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/listing/${favorite.listingId}`)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
