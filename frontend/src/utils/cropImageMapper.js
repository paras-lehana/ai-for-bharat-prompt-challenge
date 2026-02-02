import { APP_VERSION } from '../../../config/version';

/**
 * Utility to map crop types to their corresponding image assets
 * Provides professional imagery for agricultural marketplace
 */

// Local fallback images (should be high quality professional photos)
const CROP_IMAGES = {
  'tomato': '/images/crops/tomato.jpg',
  'onion': '/images/crops/onion.jpg',
  'potato': '/images/crops/potato.jpg',
  'wheat': '/images/crops/wheat.jpg',
  'rice': '/images/crops/rice.jpg',
  'maize': '/images/crops/maize.jpeg',
  'corn': '/images/crops/corn.jpg',
  'cotton': '/images/crops/cotton.jpg',
  'sugarcane': '/images/crops/sugarcane.jpg',
  'groundnut': '/images/crops/groundnut.jpg',
  'soybean': '/images/crops/soybean.jpg',
  'mustard': '/images/crops/mustard.jpg',
  'default': '/images/crops/default.jpg'
};

// Hindi name mapping for crops (Robust Fallback)
const HINDI_CROP_NAMES = {
  'tomato': 'टमाटर',
  'onion': 'प्याज',
  'potato': 'आलू',
  'wheat': 'गेहूं',
  'rice': 'चावल',
  'maize': 'मक्का',
  'cotton': 'कपास',
  'sugarcane': 'गन्ना',
  'groundnut': 'मूंगफली',
  'soybean': 'सोयाबीन',
  'chilli': 'मिर्च',
  'garlic': 'लहसुन',
  'ginger': 'अदरक',
  'mustard': 'सरसों'
};
import { bustCache } from './cacheBuster';

/**
 * Get the professional image URL for a given crop type
 * @param {string} cropType - The type of crop (e.g., 'Tomato', 'Wheat')
 * @returns {string} The path to the image asset with cache busting
 */
export const getCropImageUrl = (cropType) => {
  if (!cropType) return bustCache(CROP_IMAGES.default);
  
  const type = cropType.toLowerCase();
  
  // Try exact match
  if (CROP_IMAGES[type]) return bustCache(CROP_IMAGES[type]);
  
  // Try fuzzy match (regex) as requested by user
  for (const key in CROP_IMAGES) {
    if (type.includes(key) || key.includes(type)) {
      return bustCache(CROP_IMAGES[key]);
    }
  }
  
  return bustCache(CROP_IMAGES.default);
};

/**
 * Get the translated name for a crop (Hindi fallback)
 * @param {string} cropType - The English crop name
 * @param {string} lang - Language code
 * @returns {string} Translated name or original
 */
export const getTranslatedCropName = (cropType, lang = 'en') => {
  if (lang !== 'hi') return cropType;
  
  if (!cropType) return '';
  const type = cropType.toLowerCase();
  
  // Find in mapping
  for (const key in HINDI_CROP_NAMES) {
    if (type.includes(key)) {
      return HINDI_CROP_NAMES[key];
    }
  }
  
  return cropType;
};

export default {
  getCropImageUrl,
  getTranslatedCropName,
  CROP_IMAGES
};
