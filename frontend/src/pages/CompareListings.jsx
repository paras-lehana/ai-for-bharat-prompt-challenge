/**
 * FILE: frontend/src/pages/CompareListings.jsx
 * 
 * PURPOSE: Side-by-side comparison of selected listings
 * Shows price, quality, distance, trust score with highlighting
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { getCropImageUrl } from '../utils/cropImageMapper';
import { FiX, FiMessageCircle, FiDollarSign, FiMapPin, FiStar, FiPackage } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function CompareListings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { comparisonListings, removeFromComparison, clearComparison } = useComparison();
  const [sortBy, setSortBy] = useState('price');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if no listings to compare
  useEffect(() => {
    if (comparisonListings.length === 0) {
      navigate('/browse');
    }
  }, [comparisonListings.length, navigate]);

  // Calculate best values for highlighting
  const getBestValues = () => {
    if (comparisonListings.length === 0) return {};

    const prices = comparisonListings.map(l => l.finalPrice);
    const qualities = comparisonListings.map(l => {
      const qualityMap = { premium: 3, standard: 2, basic: 1 };
      return qualityMap[l.qualityTier] || 0;
    });
    const trustScores = comparisonListings.map(l => l.vendor?.trustScore || 0);
    const distances = comparisonListings.map(l => l.distance || 999);

    return {
      lowestPrice: Math.min(...prices),
      highestQuality: Math.max(...qualities),
      highestTrust: Math.max(...trustScores),
      closestDistance: Math.min(...distances)
    };
  };

  const bestValues = getBestValues();

  // Get highlight class based on value
  const getHighlightClass = (value, bestValue, type = 'good') => {
    if (value === bestValue) {
      return type === 'good' ? 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400' : 'bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-400';
    }
    return '';
  };

  // Get quality tier numeric value
  const getQualityValue = (tier) => {
    const qualityMap = { premium: 3, standard: 2, basic: 1 };
    return qualityMap[tier] || 0;
  };

  // Handle make offer
  const handleMakeOffer = (listingId) => {
    navigate(`/listing/${listingId}?action=offer`);
  };

  // Handle contact vendor
  const handleContactVendor = (vendorId) => {
    navigate(`/messages/${vendorId}`);
  };

  if (comparisonListings.length === 0) {
    return null;
  }

  // Desktop table view
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-4 text-left font-semibold border-b-2 border-gray-300 dark:border-gray-600">
              Criteria
            </th>
            {comparisonListings.map((listing) => (
              <th key={listing.id} className="p-4 text-center border-b-2 border-gray-300 dark:border-gray-600 relative">
                <button
                  onClick={() => removeFromComparison(listing.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  title="Remove from comparison"
                >
                  <FiX size={16} />
                </button>
                <div className="mt-6">
                  <img
                    src={listing.images?.[0] || getCropImageUrl(listing.cropType)}
                    alt={listing.cropType}
                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    onError={(e) => {
                      e.target.src = '/images/crops/wheat.jpg';
                    }}
                  />
                  <div className="font-bold text-lg">{listing.cropType}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold flex items-center gap-2">
              <FiDollarSign className="text-green-600" />
              Price per {comparisonListings[0]?.unit || 'unit'}
            </td>
            {comparisonListings.map((listing) => (
              <td
                key={listing.id}
                className={`p-4 text-center border-2 ${getHighlightClass(listing.finalPrice, bestValues.lowestPrice)}`}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ₹{listing.finalPrice}
                </div>
                {listing.finalPrice === bestValues.lowestPrice && (
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                    ✓ Best Price
                  </div>
                )}
              </td>
            ))}
          </tr>

          {/* Quality Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold flex items-center gap-2">
              <FiStar className="text-yellow-600" />
              Quality Tier
            </td>
            {comparisonListings.map((listing) => (
              <td
                key={listing.id}
                className={`p-4 text-center border-2 ${getHighlightClass(getQualityValue(listing.qualityTier), bestValues.highestQuality)}`}
              >
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {listing.qualityTier.charAt(0).toUpperCase() + listing.qualityTier.slice(1)}
                </span>
                {getQualityValue(listing.qualityTier) === bestValues.highestQuality && (
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                    ✓ Highest Quality
                  </div>
                )}
              </td>
            ))}
          </tr>

          {/* Quantity Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold flex items-center gap-2">
              <FiPackage className="text-blue-600" />
              Available Quantity
            </td>
            {comparisonListings.map((listing) => (
              <td key={listing.id} className="p-4 text-center">
                <div className="text-lg font-semibold">
                  {listing.quantity} {listing.unit}
                </div>
              </td>
            ))}
          </tr>

          {/* Vendor Trust Score Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold flex items-center gap-2">
              <FiStar className="text-orange-600" />
              Vendor Trust Score
            </td>
            {comparisonListings.map((listing) => {
              const trustScore = listing.vendor?.trustScore || 4.2;
              return (
                <td
                  key={listing.id}
                  className={`p-4 text-center border-2 ${getHighlightClass(trustScore, bestValues.highestTrust)}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-lg font-semibold">{trustScore.toFixed(1)}</span>
                  </div>
                  {trustScore === bestValues.highestTrust && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      ✓ Highest Trust
                    </div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Distance Row */}
          {comparisonListings.some(l => l.distance) && (
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-semibold flex items-center gap-2">
                <FiMapPin className="text-red-600" />
                Distance
              </td>
              {comparisonListings.map((listing) => {
                const distance = listing.distance || 999;
                return (
                  <td
                    key={listing.id}
                    className={`p-4 text-center border-2 ${distance < 999 ? getHighlightClass(distance, bestValues.closestDistance) : ''}`}
                  >
                    {distance < 999 ? (
                      <>
                        <div className="text-lg font-semibold">{distance} km</div>
                        {distance === bestValues.closestDistance && (
                          <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                            ✓ Closest
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-500">N/A</div>
                    )}
                  </td>
                );
              })}
            </tr>
          )}

          {/* Vendor Name Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold">Vendor</td>
            {comparisonListings.map((listing) => (
              <td key={listing.id} className="p-4 text-center">
                <Link
                  to={`/vendor/${listing.vendorId}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {listing.vendor?.name || 'Anonymous'}
                </Link>
              </td>
            ))}
          </tr>

          {/* Location Row */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-4 font-semibold">Location</td>
            {comparisonListings.map((listing) => (
              <td key={listing.id} className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {listing.locationDistrict || listing.locationState || 'Not specified'}
              </td>
            ))}
          </tr>

          {/* Actions Row */}
          <tr>
            <td className="p-4 font-semibold">Quick Actions</td>
            {comparisonListings.map((listing) => (
              <td key={listing.id} className="p-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleMakeOffer(listing.id)}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                    <FiDollarSign />
                    Make Offer
                  </button>
                  <button
                    onClick={() => handleContactVendor(listing.vendorId)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle />
                    Contact
                  </button>
                  <Link
                    to={`/listing/${listing.id}`}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center"
                  >
                    View Details
                  </Link>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Mobile card view
  const renderCardView = () => (
    <div className="space-y-6">
      {comparisonListings.map((listing) => {
        const trustScore = listing.vendor?.trustScore || 4.2;
        const distance = listing.distance || 999;
        
        return (
          <div key={listing.id} className="card relative">
            <button
              onClick={() => removeFromComparison(listing.id)}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition z-10"
            >
              <FiX size={20} />
            </button>

            <img
              src={listing.images?.[0] || getCropImageUrl(listing.cropType)}
              alt={listing.cropType}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = '/images/crops/wheat.jpg';
              }}
            />

            <h3 className="text-2xl font-bold mb-4">{listing.cropType}</h3>

            <div className="space-y-3">
              {/* Price */}
              <div className={`p-3 rounded-lg border-2 ${getHighlightClass(listing.finalPrice, bestValues.lowestPrice)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiDollarSign className="text-green-600" />
                    Price
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₹{listing.finalPrice}
                    </div>
                    {listing.finalPrice === bestValues.lowestPrice && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        ✓ Best Price
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quality */}
              <div className={`p-3 rounded-lg border-2 ${getHighlightClass(getQualityValue(listing.qualityTier), bestValues.highestQuality)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiStar className="text-yellow-600" />
                    Quality
                  </span>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.qualityTier.charAt(0).toUpperCase() + listing.qualityTier.slice(1)}
                    </span>
                    {getQualityValue(listing.qualityTier) === bestValues.highestQuality && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                        ✓ Highest Quality
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiPackage className="text-blue-600" />
                    Quantity
                  </span>
                  <span className="font-semibold">{listing.quantity} {listing.unit}</span>
                </div>
              </div>

              {/* Trust Score */}
              <div className={`p-3 rounded-lg border-2 ${getHighlightClass(trustScore, bestValues.highestTrust)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiStar className="text-orange-600" />
                    Trust Score
                  </span>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{trustScore.toFixed(1)}</span>
                    </div>
                    {trustScore === bestValues.highestTrust && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        ✓ Highest Trust
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Distance */}
              {distance < 999 && (
                <div className={`p-3 rounded-lg border-2 ${getHighlightClass(distance, bestValues.closestDistance)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiMapPin className="text-red-600" />
                      Distance
                    </span>
                    <div className="text-right">
                      <span className="font-semibold">{distance} km</span>
                      {distance === bestValues.closestDistance && (
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          ✓ Closest
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vendor</div>
                <Link
                  to={`/vendor/${listing.vendorId}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {listing.vendor?.name || 'Anonymous'}
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleMakeOffer(listing.id)}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
              >
                <FiDollarSign />
                Make Offer
              </button>
              <button
                onClick={() => handleContactVendor(listing.vendorId)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiMessageCircle />
                Contact Vendor
              </button>
              <Link
                to={`/listing/${listing.id}`}
                className="block w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Compare Listings</h1>
          <button
            onClick={clearComparison}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Clear All
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Comparing {comparisonListings.length} listing{comparisonListings.length !== 1 ? 's' : ''} side-by-side
        </p>
      </div>

      {/* Legend */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Legend:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span>Best Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span>Standard</span>
          </div>
        </div>
      </div>

      {/* Comparison View */}
      <div className="card">
        {isMobile ? renderCardView() : renderTableView()}
      </div>

      {/* Back to Browse */}
      <div className="mt-6 text-center">
        <Link
          to="/browse"
          className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Back to Browse Listings
        </Link>
      </div>
    </div>
  );
}
