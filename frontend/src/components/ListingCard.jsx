import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckSquare } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getCropImageUrl, getTranslatedCropName } from '../utils/cropImageMapper';
import { useTranslation } from 'react-i18next';
import { bustCache } from '../utils/cacheBuster';

const ListingCard = ({ listing, isNew, onToggleFavorite, onToggleComparison, isFavorite, isInComparison, currentLanguage, odpBadge }) => {
    const { t } = useTranslation();

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
        <Link to={`/listing/${listing.id}`} className={`card hover:shadow-lg transition-all duration-300 overflow-hidden group ${isNew ? 'ring-2 ring-green-400' : ''}`}>
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={listing.cropType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = '/images/crops/default.jpg';
                    }}
                />

                {isNew && (
                    <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm animate-pulse z-20">
                        NEW
                    </div>
                )}

                {/* Comparison Checkbox */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleComparison(e, listing); }}
                    className={`absolute top-2 right-2 p-2 rounded-lg shadow-lg hover:scale-110 transition-transform z-10 ${isInComparison ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
                >
                    <FiCheckSquare size={18} />
                </button>

                {/* Favorite Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(listing.id); }}
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform z-10"
                >
                    {isFavorite ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <FaRegHeart className="text-gray-600 text-lg" />
                    )}
                </button>

                {/* ODOP Badge */}
                {odpBadge?.isODOP && (
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 z-10">
                        <span>🏆</span>
                        <span>ODOP</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800">
                        {getTranslatedCropName(listing.cropType, currentLanguage)}
                    </h3>
                </div>

                {/* Price info */}
                <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary-600">₹{Math.round(listing.finalPrice)}</span>
                        <span className="text-xs text-gray-500">/{listing.unit}</span>
                    </div>
                    {listing.basePrice !== listing.finalPrice && (
                        <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-xs text-gray-400 line-through">₹{Math.round(listing.basePrice)}</span>
                            <span className="text-[10px] font-semibold text-green-600">
                                {Math.round(((listing.basePrice - listing.finalPrice) / listing.basePrice) * 100)}% {t('OFF')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${listing.qualityTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                        listing.qualityTier === 'standard' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {t(`Quality: ${listing.qualityTier}`)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                        {listing.quantity} {listing.unit}
                    </span>
                </div>

                {listing.vendor && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-[10px]">
                                {listing.vendor.name?.charAt(0) || 'V'}
                            </div>
                            <span className="text-xs font-medium text-gray-600 truncate max-w-[80px]">{listing.vendor.name || 'Vendor'}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-xs font-bold text-gray-600">4.5</span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ListingCard;
