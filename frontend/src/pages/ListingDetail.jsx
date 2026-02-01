import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, negotiationsAPI, integrationAPI, favoritesAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ShareButton from '../components/ShareButton';
import QRCodeDisplay from '../components/QRCodeDisplay';
import PricePredictionChart from '../components/PricePredictionChart';
import WeatherWidget from '../components/WeatherWidget';
import TranslatedText from '../components/TranslatedText';
import { getCropImageUrl, getTranslatedCropName } from '../utils/cropImageMapper';
import { useTranslation } from 'react-i18next';
import PageSummarizer from '../components/PageSummarizer';

import { bustCache } from '../utils/cacheBuster';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [odpBadge, setOdpBadge] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadListing();
    checkFavoriteStatus();
  }, [id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesAPI.check(id);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const loadListing = async () => {
    try {
      const response = await listingsAPI.getById(id);
      const listingData = response.data;
      setListing(listingData);
      setOfferPrice(Math.round(listingData.finalPrice));

      // Check ODOP status
      if (listingData.locationDistrict && listingData.cropType) {
        try {
          const badgeResponse = await integrationAPI.checkODOP(listingData.cropType, listingData.locationDistrict);
          if (badgeResponse.data.isODOP) {
            setOdpBadge(badgeResponse.data.badge);
          }
        } catch (error) {
          console.error('Error checking ODOP:', error);
        }
      }
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

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add({ listingId: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!listing) {
    return <div className="text-center py-12">Listing not found</div>;
  }

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
  const imageUrl = bustCache(images[0]) || getCropImageUrl(listing.cropType);

  return (
    <div className="container py-6 sm:py-8 pb-24 md:pb-8">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Image */}
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
            <img
              src={imageUrl}
              alt={listing.cropType}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const currentSrc = e.target.src;
                const fallbackSrc = getCropImageUrl(listing.cropType);

                // If we've already tried the fallback or if we're hitting a loop, set to default
                if (currentSrc.includes(fallbackSrc) || currentSrc.includes('default.jpg')) {
                  e.target.src = '/images/crops/default.jpg';
                  return;
                }

                // Try specific crop local image
                e.target.src = fallbackSrc;
              }}
            />
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform z-10"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-2xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-2xl" />
              )}
            </button>
            {/* ODOP Badge */}
            {odpBadge && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span>ODOP</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              {getTranslatedCropName(listing.cropType, i18n.language)}
            </h1>

            {/* ODOP Description */}
            {odpBadge && (
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-orange-800">
                    <TranslatedText text={odpBadge.displayName[i18n.language] || odpBadge.displayName['en']} />
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  <TranslatedText text={odpBadge.description[i18n.language] || odpBadge.description['en']} />
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                ₹{Math.round(listing.finalPrice)}
                <span className="text-base sm:text-lg text-gray-600">/<TranslatedText text={listing.unit} /></span>
              </div>
              {listing.basePrice !== listing.finalPrice && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                  <div className="flex justify-between mb-1 whitespace-nowrap">
                    <span className="text-gray-600"><TranslatedText text="Base Price" />:</span>
                    <span className="font-medium">₹{Math.round(listing.basePrice)}</span>
                  </div>
                  <div className="flex justify-between mb-1 whitespace-nowrap">
                    <span className="text-gray-600"><TranslatedText text="Quality Multiplier" />:</span>
                    <span className="font-medium">×{listing.qualityMultiplier}</span>
                  </div>
                  <div className="flex justify-between mb-1 whitespace-nowrap">
                    <span className="text-gray-600"><TranslatedText text="Demand Adjuster" />:</span>
                    <span className="font-medium">×{listing.demandAdjuster}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 whitespace-nowrap">
                    <span className="text-gray-700 font-medium"><TranslatedText text="Final Price" />:</span>
                    <span className="font-bold text-primary-600">₹{Math.round(listing.finalPrice)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600"><TranslatedText text="Quality" />:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                  listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  <TranslatedText text={listing.qualityTier} />
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600"><TranslatedText text="Quantity" />:</span>
                <span className="font-medium">{listing.quantity} <TranslatedText text={listing.unit} /></span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600"><TranslatedText text="Location" />:</span>
                <span className="font-medium"><TranslatedText text={listing.locationAddress || 'Delhi'} /></span>
              </div>
            </div>

            {listing.description && (
              <div className="mb-6">
                <h3 className="font-bold mb-2"><TranslatedText text="Description" /></h3>
                <p className="text-gray-600"><TranslatedText text={listing.description} /></p>
              </div>
            )}

            {/* Vendor Info */}
            {listing.vendor && (
              <div className="border-t pt-4 mb-6">
                <h3 className="font-bold mb-2"><TranslatedText text="Vendor" /></h3>
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

            {/* Price Prediction */}
            <div className="mb-6">
              <PricePredictionChart cropType={listing.cropType} location={listing.locationAddress || "Pune"} />
            </div>

            {/* Weather Forecast */}
            <div className="mb-6">
              <WeatherWidget location={listing.locationAddress || "Pune"} />
            </div>

            {/* Actions */}
            {user?.role === 'buyer' && listing.vendorId !== user.id && (
              <div className="space-y-3">
                {!showOfferForm ? (
                  <>
                    <button
                      onClick={() => setShowOfferForm(true)}
                      className="btn-primary w-full text-base sm:text-lg"
                    >
                      <TranslatedText text="Make an Offer" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <ShareButton listing={listing} />
                      <QRCodeDisplay listingId={listing.id} cropType={listing.cropType} />
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleMakeOffer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Offer (₹/{listing.unit})
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
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
                        className="input-field resize-none"
                        rows="3"
                        placeholder="Any additional details..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="submit" className="btn-primary flex-1 order-1">
                        Send Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="btn-secondary flex-1 order-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Share button for vendors viewing their own listing */}
            {user?.role === 'vendor' && listing.vendorId === user.id && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  This is your listing. Share it to reach more buyers!
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ShareButton listing={listing} />
                  <QRCodeDisplay listingId={listing.id} cropType={listing.cropType} />
                </div>
              </div>
            )}

            {/* Share button for non-authenticated users or other cases */}
            {(!user || (user.role === 'buyer' && listing.vendorId === user.id)) && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <ShareButton listing={listing} />
                  <QRCodeDisplay listingId={listing.id} cropType={listing.cropType} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {listing && <PageSummarizer pageType="listing_detail" data={listing} />}
    </div>
  );
}
