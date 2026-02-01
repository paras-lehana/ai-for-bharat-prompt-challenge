import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listingsAPI, integrationAPI, savedSearchesAPI, favoritesAPI } from '../utils/api';
import { FiSearch, FiFilter, FiSave, FiCheckSquare } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import PageSummarizer from '../components/PageSummarizer';
import ListingCard from '../components/ListingCard';

export default function BrowseListings() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison, count: comparisonCount } = useComparison();
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

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchCrop = queryParams.get('search');

  useEffect(() => {
    if (searchCrop && searchCrop !== filters.cropType) {
      setFilters(prev => ({ ...prev, cropType: searchCrop }));
      return;
    }
    loadListings();
    loadFavorites();
  }, [filters, search]);

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

      const badgePromises = listingsData.map(async (listing) => {
        if (listing.locationDistrict && listing.cropType) {
          try {
            const badgeResponse = await integrationAPI.checkODOP(listing.cropType, listing.locationDistrict);
            return { listingId: listing.id, badge: badgeResponse.data };
          } catch (error) {
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
    if (!searchName.trim()) return;
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
      setShowSaveModal(false);
      setSearchName('');
    } catch (error) {
      console.error('Error saving search:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasActiveFilters = () => filters.cropType || filters.qualityTier || filters.minPrice || filters.maxPrice;

  const toggleFavorite = async (listingId) => {
    try {
      if (favorites[listingId]) {
        await favoritesAPI.remove(listingId);
        setFavorites(prev => ({ ...prev, [listingId]: false }));
      } else {
        await favoritesAPI.add({ listingId });
        setFavorites(prev => ({ ...prev, [listingId]: true }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleComparison = (e, listing) => {
    if (isInComparison(listing.id)) {
      removeFromComparison(listing.id);
    } else {
      const result = addToComparison(listing);
      if (!result.success) alert(result.message);
    }
  };

  const newlyAddedLimit = 600000; // 10 minutes
  const newlyAdded = listings.filter(l => (Date.now() - new Date(l.createdAt).getTime()) < newlyAddedLimit);
  const recentHarvest = listings.filter(l => (Date.now() - new Date(l.createdAt).getTime()) >= newlyAddedLimit);

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('listings.browseListings')}</h1>
        <div className="flex gap-3">
          {comparisonCount > 0 && (
            <button onClick={() => navigate('/compare')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <FiCheckSquare /> Compare ({comparisonCount})
            </button>
          )}
          {hasActiveFilters() && (
            <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <FiSave /> Save Search
            </button>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Save This Search</h2>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Premium Wheat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
              <button onClick={handleSaveSearch} disabled={saving || !searchName.trim()} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><FiSearch className="inline mr-1" /> {t('listings.cropType')}</label>
            <input type="text" value={filters.cropType} onChange={(e) => setFilters({ ...filters, cropType: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><FiFilter className="inline mr-1" /> {t('listings.qualityTier')}</label>
            <select value={filters.qualityTier} onChange={(e) => setFilters({ ...filters, qualityTier: e.target.value })} className="input-field">
              <option value="">{t('common.filter')}</option>
              <option value="premium">{t('listings.quality.premium')}</option>
              <option value="standard">{t('listings.quality.standard')}</option>
              <option value="basic">{t('listings.quality.basic')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('listings.minPrice')}</label>
            <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('listings.maxPrice')}</label>
            <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto"></div></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-gray-600">{t('listings.noListings')}</div>
      ) : (
        <div className="space-y-8">
          {newlyAdded.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 sm:p-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h2 className="text-xl font-bold text-green-800">Newly Added (Just Now)</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newlyAdded.map(l => (
                  <ListingCard
                    key={`new-${l.id}`}
                    listing={l}
                    isNew={true}
                    onToggleFavorite={toggleFavorite}
                    onToggleComparison={toggleComparison}
                    isFavorite={favorites[l.id]}
                    isInComparison={isInComparison(l.id)}
                    currentLanguage={currentLanguage}
                    odpBadge={odpBadges[l.id]}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            {recentHarvest.length > 0 && <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Recent Harvest</h2>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentHarvest.map(l => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onToggleFavorite={toggleFavorite}
                  onToggleComparison={toggleComparison}
                  isFavorite={favorites[l.id]}
                  isInComparison={isInComparison(l.id)}
                  currentLanguage={currentLanguage}
                  odpBadge={odpBadges[l.id]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {listings.length > 0 && <PageSummarizer pageType="browse" data={{ count: listings.length, criteria: filters }} />}
    </div>
  );
}
