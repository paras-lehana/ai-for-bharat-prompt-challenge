# Smart Crop Image Mapping

## Overview
Intelligent crop name to image file mapping that handles:
- Multiple languages (Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)
- Variations and typos
- Partial matches
- Fallback to default image

## Available Crop Images

```
frontend/public/images/crops/
├── tomato.jpg
├── onion.jpg
├── potato.jpg
├── rice.jpg
├── wheat.jpg
├── maize.jpeg
├── groundnut.jpg
├── cotton.png
├── soybean.jpg
└── sugarcane.webp
```

## Supported Crop Names

### Tomato (tomato.jpg)
- English: tomato
- Hindi: टमाटर
- Marathi: टोमॅटो
- Tamil: தக்காளி
- Telugu: టమాటా
- Kannada: ಟೊಮೇಟೊ

### Onion (onion.jpg)
- English: onion
- Hindi: प्याज
- Marathi: कांदा
- Tamil: வெங்காயம்
- Telugu: ఉల్లిపాయ
- Kannada: ಈರುಳ್ಳಿ

### Potato (potato.jpg)
- English: potato
- Hindi: आलू
- Marathi: बटाटा
- Tamil: உருளைக்கிழங்கு
- Telugu: బంగాళాదుంప
- Kannada: ಆಲೂಗಡ್ಡೆ

### Rice (rice.jpg)
- English: rice
- Hindi: चावल
- Marathi: तांदूळ
- Tamil: அரிசி
- Telugu: బియ్యం
- Kannada: ಅಕ್ಕಿ

### Wheat (wheat.jpg)
- English: wheat
- Hindi: गेहूं, गहू
- Marathi: गहू
- Tamil: கோதுமை
- Telugu: గోధుమ
- Kannada: ಗೋಧಿ

### Maize/Corn (maize.jpeg)
- English: maize, corn
- Hindi: मक्का
- Marathi: मका
- Tamil: சோளம்
- Telugu: మొక్కజొన్న
- Kannada: ಜೋಳ

### Groundnut/Peanut (groundnut.jpg)
- English: groundnut, peanut
- Hindi: मूंगफली
- Marathi: शेंगदाणा
- Tamil: கடலை
- Telugu: వేరుశెనగ
- Kannada: ಕಡಲೆಕಾಯಿ

### Cotton (cotton.png)
- English: cotton
- Hindi: कपास
- Marathi: कापूस
- Tamil: பருத்தி
- Telugu: పత్తి
- Kannada: ಹತ್ತಿ

### Soybean (soybean.jpg)
- English: soybean, soya
- Hindi: सोयाबीन
- Marathi: सोयाबीन
- Tamil: சோயா
- Telugu: సోయాబీన్
- Kannada: ಸೋಯಾಬೀನ್

### Sugarcane (sugarcane.webp)
- English: sugarcane
- Hindi: गन्ना
- Marathi: ऊस
- Tamil: கரும்பு
- Telugu: చెరకు
- Kannada: ಕಬ್ಬು

## Matching Algorithm

The mapper uses a 3-tier matching system:

### 1. Direct Match
Exact match with normalized (lowercase, trimmed) crop name
```javascript
"टमाटर" → tomato.jpg
"onion" → onion.jpg
```

### 2. Partial Match
Checks if crop name contains the key or vice versa
```javascript
"टमाटर fresh" → tomato.jpg (contains "टमाटर")
"toma" → tomato.jpg (tomato contains "toma")
```

### 3. Fuzzy Match
Matches first 3 characters for typos
```javascript
"tom" → tomato.jpg
"टमा" → tomato.jpg
```

### 4. Fallback
If no match found, returns default wheat.jpg

## Usage

### Import the Mapper
```javascript
import { getCropImageUrl } from '../utils/cropImageMapper';
```

### Get Image URL
```javascript
// Returns: /images/crops/tomato.jpg
const imageUrl = getCropImageUrl('टमाटर');

// Returns: /images/crops/maize.jpeg
const imageUrl = getCropImageUrl('मक्का');

// Returns: /images/crops/wheat.jpg (fallback)
const imageUrl = getCropImageUrl('unknown crop');
```

### Use in Components
```javascript
<img 
  src={getCropImageUrl(listing.cropType)} 
  alt={listing.cropType}
  onError={(e) => {
    e.target.src = '/images/crops/wheat.jpg';
  }}
/>
```

## Files Updated

1. **frontend/src/utils/cropImageMapper.js** - New mapper utility
2. **frontend/src/pages/BrowseListings.jsx** - Uses mapper
3. **frontend/src/pages/Home.jsx** - Uses mapper
4. **frontend/src/pages/ListingDetail.jsx** - Uses mapper

## Benefits

1. **Multilingual Support** - Works with Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi
2. **Typo Tolerant** - Handles minor spelling variations
3. **Fallback Safe** - Always returns a valid image
4. **Maintainable** - Easy to add new crops and languages
5. **Performance** - Simple lookup, no API calls

## Adding New Crops

To add a new crop:

1. Add image to `frontend/public/images/crops/`
2. Update `CROP_IMAGE_MAP` in `cropImageMapper.js`:

```javascript
// Example: Adding Carrot
'carrot': 'carrot.jpg',
'गाजर': 'carrot.jpg',
'கேரட்': 'carrot.jpg',
'క్యారెట్': 'carrot.jpg',
```

3. Update `getAllCrops()` function:

```javascript
{ name: 'Carrot', hindi: 'गाजर', image: 'carrot.jpg' },
```

## Testing

Test the mapper with different inputs:

```javascript
console.log(getCropImageUrl('टमाटर'));      // tomato.jpg
console.log(getCropImageUrl('tomato'));     // tomato.jpg
console.log(getCropImageUrl('toma'));       // tomato.jpg (partial)
console.log(getCropImageUrl('unknown'));    // wheat.jpg (fallback)
```

## Example Voice Commands

When user says:
- "टमाटर दस रुपये" → Shows tomato.jpg
- "मक्का बीस रुपये" → Shows maize.jpeg
- "मूंगफली पंद्रह रुपये" → Shows groundnut.jpg

All images are automatically matched based on the crop name!
