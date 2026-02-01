import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listingsAPI, integrationAPI, savedSearchesAPI, favoritesAPI } from '../utils/api';
import { FiSearch, FiFilter, FiSave, FiCheckSquare } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getCropImageUrl } from '../utils/cropImageMapper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';

export default function BrowseListings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { comparisonListings, addToComparison, removeFromComparison, isInComparison, count: comparisonCount } = useComparison();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [odpBadges, setOdpBadges] = useState({});
  const [favorites, setFavorites] = useState({});
  const [filters, setFilters] = useState({
    cropType: '',
    qualityTier: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadListings();
    loadFavorites();
  }, [filters]);

  const loadFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      const favMap = {};
      response.data.forEach(fav => {
        favMap[fav.listingId] = true;
      });
      setFavorites(favMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.search(filters);
      const listingsData = response.data.listings || [];
      setListings(listingsData);
      
      // Check ODOP status for each listing
      const badgePromises = listingsData.map(async (listing) => {
        if (listing.locationDistrict && listing.cropType) {
          try {
            const badgeResponse = await integrationAPI.checkODOP(listing.cropType, listing.locationDistrict);
            return { listingId: listing.id, badge: badgeResponse.data };
          } catch (error) {
            console.error('Error checking ODOP for listing:', listing.id, error);
            return { listingId: listing.id, badge: null };
          }
        }
        return { listingId: listing.id, badge: null };
      });
      
      const badgeResults = await Promise.all(badgePromises);
      const badgeMap = {};
      badgeResults.forEach(result => {
        if (result.badge) {
          badgeMap[result.listingId] = result.badge;
        }
      });
      setOdpBadges(badgeMap);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      alert('Please enter a name for this search');
      return;
    }

    setSaving(true);
    try {
      await savedSearchesAPI.create({
        name: searchName,
        searchCriteria: {
          crop: filters.cropType,
          quality: filters.qualityTier,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        },
        notifyOnMatch: true
      });
      
      alert('Search saved successfully!');
      setShowSaveModal(false);
      setSearchName('');
    } catch (error) {
      console.error('Error saving search:', error);
      alert('Failed to save search. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasActiveFilters = () => {
    return filters.cropType || filters.qualityTier || filters.minPrice || filters.maxPrice;
  };

  const toggleFavorite = async (e, listingId) => {
    e.preventDefault(); // Prevent navigation to listing detail
    e.stopPropagation();
    
    try {
      if (favorites[listingId]) {
        await favoritesAPI.remove(listingId);
        setFavorites({ ...favorites, [listingId]: false });
      } else {
        await favoritesAPI.add({ listingId });
        setFavorites({ ...favorites, [listingId]: true });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  };

  const toggleComparison = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInComparison(listing.id)) {
      removeFromComparison(listing.id);
    } else {
      const result = addToComparison(listing);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('listings.browseListings')}</h1>
        
        <div className="flex gap-3">
          {comparisonCount > 0 && (
            <button
              onClick={() => navigate('/compare')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FiCheckSquare />
              Compare ({comparisonCount})
            </button>
          )}
          
          {hasActiveFilters() && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiSave />
              Save Search
            </button>
          )}
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Save This Search</h2>
            <p className="text-gray-600 mb-4">
              Give this search a name so you can quickly access it later.
            </p>
            
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Premium Wheat in Punjab"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSearchName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={saving || !searchName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline mr-1" />
              {t('listings.cropType')}
            </label>
            <input
              type="text"
              value={filters.cropType}
              onChange={(e) => setFilters({ ...filters, cropType: e.target.value })}
              placeholder={t('listings.searchPlaceholder')}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline mr-1" />
              {t('listings.qualityTier')}
            </label>
            <select
              value={filters.qualityTier}
              onChange={(e) => setFilters({ ...filters, qualityTier: e.target.value })}
              className="input-field"
            >
              <option value="">{t('common.filter')}</option>
              <option value="premium">{t('listings.quality.premium')}</option>
              <option value="standard">{t('listings.quality.standard')}</option>
              <option value="basic">{t('listings.quality.basic')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('listings.minPrice')}
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
              {t('listings.maxPrice')}
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
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('listings.noListings')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            // Handle images - could be array or JSON string
            let images = [];
            if (listing.images) {
              if (Array.isArray(listing.images)) {
                images = listing.images;
              } else if (typeof listing.images === 'string') {
                try {
                  images = JSON.parse(listing.images);
                } catch (e) {
                  images = [];
                }
              }
            }
            const imageUrl = images[0] || getCropImageUrl(listing.cropType);
            
            return (
              <Link key={listing.id} to={`/listing/${listing.id}`} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  <img 
                    src={imageUrl} 
                    alt={listing.cropType}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/crops/wheat.jpg';
                    }}
                  />
                  {/* Comparison Checkbox */}
                  <button
                    onClick={(e) => toggleComparison(e, listing)}
                    className={`absolute top-2 right-2 p-2 rounded-lg shadow-lg hover:scale-110 transition-transform z-10 ${
                      isInComparison(listing.id) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-gray-600'
                    }`}
                    title={isInComparison(listing.id) ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    <FiCheckSquare size={20} />
                  </button>
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, listing.id)}
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform z-10"
                    title={favorites[listing.id] ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites[listing.id] ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-gray-600 text-xl" />
                    )}
                  </button>
                  {/* ODOP Badge */}
                  {odpBadges[listing.id]?.isODOP && (
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <span>🏆</span>
                      <span>ODOP</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xl mb-2">{listing.cropType}</h3>
                
                {/* ODOP Description */}
                {odpBadges[listing.id]?.isODOP && odpBadges[listing.id]?.badge && (
                  <div className="mb-3 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    {odpBadges[listing.id].badge.description[user?.languagePreference || 'en']}
                  </div>
                )}
                
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary-600">₹{listing.finalPrice}</span>
                    <span className="text-gray-600">/{listing.unit}</span>
                  </div>
                  {listing.basePrice !== listing.finalPrice && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 line-through">₹{listing.basePrice}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {Math.round(((listing.finalPrice - listing.basePrice) / listing.basePrice) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                    listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`listings.quality.${listing.qualityTier}`)}
                  </span>
                  <span className="text-sm text-gray-600">{listing.quantity} {listing.unit}</span>
                </div>

                {listing.vendor && (
                  <div className="text-sm text-gray-600 border-t pt-3">
                    <div>{t('listings.vendor')}: {listing.vendor.name || 'Anonymous'}</div>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">⭐⭐⭐⭐</span>
                      <span className="ml-1">(4.2)</span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
