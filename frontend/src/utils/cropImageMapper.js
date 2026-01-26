/**
 * Crop Image Mapper
 * Maps crop names (including Hindi/regional names) to correct image files
 */

const CROP_IMAGE_MAP = {
  // Tomato
  'tomato': 'tomato.jpg',
  'टमाटर': 'tomato.jpg',
  'टोमॅटो': 'tomato.jpg',
  'தக்காளி': 'tomato.jpg',
  'టమాటా': 'tomato.jpg',
  'ಟೊಮೇಟೊ': 'tomato.jpg',
  
  // Onion
  'onion': 'onion.jpg',
  'प्याज': 'onion.jpg',
  'कांदा': 'onion.jpg',
  'வெங்காயம்': 'onion.jpg',
  'ఉల్లిపాయ': 'onion.jpg',
  'ಈರುಳ್ಳಿ': 'onion.jpg',
  
  // Potato
  'potato': 'potato.jpg',
  'आलू': 'potato.jpg',
  'बटाटा': 'potato.jpg',
  'உருளைக்கிழங்கு': 'potato.jpg',
  'బంగాళాదుంప': 'potato.jpg',
  'ಆಲೂಗಡ್ಡೆ': 'potato.jpg',
  
  // Rice
  'rice': 'rice.jpg',
  'चावल': 'rice.jpg',
  'तांदूळ': 'rice.jpg',
  'அரிசி': 'rice.jpg',
  'బియ్యం': 'rice.jpg',
  'ಅಕ್ಕಿ': 'rice.jpg',
  
  // Wheat
  'wheat': 'wheat.jpg',
  'गेहूं': 'wheat.jpg',
  'गहू': 'wheat.jpg',
  'கோதுமை': 'wheat.jpg',
  'గోధుమ': 'wheat.jpg',
  'ಗೋಧಿ': 'wheat.jpg',
  
  // Maize/Corn
  'maize': 'maize.jpeg',
  'corn': 'maize.jpeg',
  'मक्का': 'maize.jpeg',
  'मका': 'maize.jpeg',
  'சோளம்': 'maize.jpeg',
  'మొక్కజొన్న': 'maize.jpeg',
  'ಜೋಳ': 'maize.jpeg',
  
  // Groundnut/Peanut
  'groundnut': 'groundnut.jpg',
  'peanut': 'groundnut.jpg',
  'मूंगफली': 'groundnut.jpg',
  'शेंगदाणा': 'groundnut.jpg',
  'கடலை': 'groundnut.jpg',
  'వేరుశెనగ': 'groundnut.jpg',
  'ಕಡಲೆಕಾಯಿ': 'groundnut.jpg',
  
  // Cotton
  'cotton': 'cotton.png',
  'कपास': 'cotton.png',
  'कापूस': 'cotton.png',
  'பருத்தி': 'cotton.png',
  'పత్తి': 'cotton.png',
  'ಹತ್ತಿ': 'cotton.png',
  
  // Soybean
  'soybean': 'soybean.jpg',
  'soya': 'soybean.jpg',
  'सोयाबीन': 'soybean.jpg',
  'सोयाबीन': 'soybean.jpg',
  'சோயா': 'soybean.jpg',
  'సోయాబీన్': 'soybean.jpg',
  'ಸೋಯಾಬೀನ್': 'soybean.jpg',
  
  // Sugarcane
  'sugarcane': 'sugarcane.webp',
  'गन्ना': 'sugarcane.webp',
  'ऊस': 'sugarcane.webp',
  'கரும்பு': 'sugarcane.webp',
  'చెరకు': 'sugarcane.webp',
  'ಕಬ್ಬು': 'sugarcane.webp',
};

/**
 * Get crop image filename from crop name
 * @param {string} cropName - Crop name in any language
 * @returns {string} Image filename
 */
export function getCropImage(cropName) {
  if (!cropName) return 'wheat.jpg'; // Default fallback
  
  // Normalize the crop name
  const normalized = cropName.toLowerCase().trim();
  
  // Direct match
  if (CROP_IMAGE_MAP[normalized]) {
    return CROP_IMAGE_MAP[normalized];
  }
  
  // Partial match using regex
  for (const [key, value] of Object.entries(CROP_IMAGE_MAP)) {
    // Check if the crop name contains the key or vice versa
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Try to match by first few characters (for typos)
  const firstThree = normalized.substring(0, 3);
  for (const [key, value] of Object.entries(CROP_IMAGE_MAP)) {
    if (key.startsWith(firstThree)) {
      return value;
    }
  }
  
  // Default fallback
  return 'wheat.jpg';
}

/**
 * Get full image URL for a crop
 * @param {string} cropName - Crop name in any language
 * @returns {string} Full image URL
 */
export function getCropImageUrl(cropName) {
  const filename = getCropImage(cropName);
  return `/images/crops/${filename}`;
}

/**
 * Get all available crops with their images
 * @returns {Array} Array of crop objects
 */
export function getAllCrops() {
  return [
    { name: 'Tomato', hindi: 'टमाटर', image: 'tomato.jpg' },
    { name: 'Onion', hindi: 'प्याज', image: 'onion.jpg' },
    { name: 'Potato', hindi: 'आलू', image: 'potato.jpg' },
    { name: 'Rice', hindi: 'चावल', image: 'rice.jpg' },
    { name: 'Wheat', hindi: 'गेहूं', image: 'wheat.jpg' },
    { name: 'Maize', hindi: 'मक्का', image: 'maize.jpeg' },
    { name: 'Groundnut', hindi: 'मूंगफली', image: 'groundnut.jpg' },
    { name: 'Cotton', hindi: 'कपास', image: 'cotton.png' },
    { name: 'Soybean', hindi: 'सोयाबीन', image: 'soybean.jpg' },
    { name: 'Sugarcane', hindi: 'गन्ना', image: 'sugarcane.webp' },
  ];
}

export default {
  getCropImage,
  getCropImageUrl,
  getAllCrops,
};
