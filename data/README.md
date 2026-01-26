# Data Assets Configuration

This directory contains all configuration files and data assets for the Multilingual Mandi application.

## Files Overview

### 1. `assets-config.json`
**Central configuration file for all application assets, images, and settings.**

This is the single source of truth for:
- Crop definitions with multilingual names
- Quality tier configurations
- Language settings
- Unit conversions
- Trust badge requirements
- Pricing formulas
- API configurations
- Feature flags

### 2. `mock_enam_prices.json`
**Mock market price data for testing and development.**

Contains sample eNAM (National Agriculture Market) price data for various crops across different mandis.

---

## Using `assets-config.json`

### Loading in Backend (Node.js)

```javascript
const assetsConfig = require('../data/assets-config.json');

// Get all crops
const crops = assetsConfig.crops;

// Get crop by ID
const wheat = crops.find(c => c.id === 'wheat');

// Get crop display name in Hindi
const wheatHindi = wheat.displayName.hi; // "गेहूं"

// Get quality multiplier
const premiumMultiplier = assetsConfig.qualityTiers
  .find(q => q.id === 'premium').multiplier; // 1.2

// Get language configuration
const languages = assetsConfig.languages;
const hindiConfig = languages.find(l => l.code === 'hi');
console.log(hindiConfig.sarvamCode); // "hi-IN"
```

### Loading in Frontend (React)

```javascript
import assetsConfig from '../data/assets-config.json';

// Get crop image URL
const getCropImage = (cropId) => {
  const crop = assetsConfig.crops.find(c => c.id === cropId);
  return crop?.imageUrl || '/images/crops/default.jpg';
};

// Get localized crop name
const getCropName = (cropId, languageCode) => {
  const crop = assetsConfig.crops.find(c => c.id === cropId);
  return crop?.displayName[languageCode] || crop?.name;
};

// Example usage in component
function CropCard({ cropId }) {
  const crop = assetsConfig.crops.find(c => c.id === cropId);
  const userLang = 'hi'; // from user context
  
  return (
    <div>
      <img src={crop.imageUrl} alt={crop.name} />
      <h3>{crop.displayName[userLang]}</h3>
      <p>Category: {crop.category}</p>
      <p>Avg Price: ₹{crop.averagePrice}/{crop.defaultUnit}</p>
    </div>
  );
}
```

---

## Configuration Sections

### 1. Crops Configuration

Each crop has:
- `id`: Unique identifier (lowercase, used in URLs and database)
- `name`: English name
- `displayName`: Multilingual names (en, hi, mr, ta, te)
- `category`: grain, vegetable, cash_crop, pulse, oilseed
- `defaultUnit`: kg, quintal, ton
- `imageUrl`: Path to crop image
- `imageSource`: local or external
- `averagePrice`: Typical market price (₹)
- `season`: Array of growing seasons

**Adding a new crop:**

```json
{
  "id": "banana",
  "name": "Banana",
  "displayName": {
    "en": "Banana",
    "hi": "केला",
    "mr": "केळी",
    "ta": "வாழைப்பழம்",
    "te": "అరటిపండు"
  },
  "category": "fruit",
  "defaultUnit": "dozen",
  "imageUrl": "/images/crops/banana.jpg",
  "imageSource": "local",
  "averagePrice": 50,
  "season": ["summer", "monsoon"]
}
```

### 2. Quality Tiers Configuration

Defines pricing multipliers for different quality grades:
- **Premium**: 1.2x (20% above base price)
- **Standard**: 1.0x (base price)
- **Basic**: 0.85x (15% below base price)

**Modifying multipliers:**

```json
{
  "id": "premium",
  "multiplier": 1.3  // Change to 30% above base
}
```

### 3. Languages Configuration

Supported languages with SARVAM API codes:
- Maps language codes (hi, mr, ta) to SARVAM codes (hi-IN, mr-IN, ta-IN)
- Includes native names for language selector UI
- `enabled` flag to turn languages on/off

**Adding a new language:**

```json
{
  "code": "as",
  "name": "Assamese",
  "nativeName": "অসমীয়া",
  "sarvamCode": "as-IN",
  "enabled": true
}
```

### 4. Units Configuration

Weight/volume units with conversions:
- Kilogram (kg) - base unit
- Quintal (qtl) - 100 kg
- Ton - 1000 kg

Includes multilingual display names.

### 5. Trust Badges Configuration

Badge requirements and display:
- **Trusted Vendor**: Score ≥ 4.5, 20+ transactions
- **Verified Seller**: Score ≥ 4.0, 50+ transactions

**Adding a new badge:**

```json
{
  "id": "super_seller",
  "name": "Super Seller",
  "displayName": {
    "en": "Super Seller",
    "hi": "सुपर विक्रेता"
  },
  "icon": "⭐",
  "requirements": {
    "minScore": 4.8,
    "minTransactions": 100
  },
  "color": "#FF6B6B"
}
```

### 6. Pricing Configuration

Core pricing algorithm settings:
- Demand adjuster range: 0.8 to 1.3
- Trust score weights (delivery: 40%, quality: 30%, response: 20%, fair pricing: 10%)
- Negotiation expiry: 24 hours
- Dispute evidence deadline: 48 hours

### 7. API Configuration

API endpoints and model settings:
- **SARVAM**: STT model (saaras:v3), TTS model (bulbul:v1)
- **OpenRouter**: Default model and alternatives

**Changing AI model:**

```json
{
  "openrouter": {
    "defaultModel": "qwen/qwen-2.5-72b-instruct"
  }
}
```

### 8. Feature Flags

Enable/disable features without code changes:

```json
{
  "voiceInterface": true,
  "realTimeMessaging": true,
  "offlineSupport": false,  // Disable offline mode
  "disputeResolution": true
}
```

---

## Image Management

### Current Crop Images

All images are stored in `frontend/public/images/crops/`:

| Crop | Filename | Format |
|------|----------|--------|
| Wheat | wheat.jpg | JPG |
| Rice | rice.jpg | JPG |
| Tomato | tomato.jpg | JPG |
| Onion | onion.jpg | JPG |
| Potato | potato.jpg | JPG |
| Cotton | cotton.png | PNG |
| Maize | maize.jpeg | JPEG |
| Soybean | soybean.jpg | JPG |
| Groundnut | groundnut.jpg | JPG |
| Sugarcane | sugarcane.webp | WEBP |

### Adding New Crop Images

**Method 1: Manual**
1. Add image to `frontend/public/images/crops/`
2. Name it `{cropId}.jpg` (e.g., `banana.jpg`)
3. Update `assets-config.json`:
   ```json
   {
     "id": "banana",
     "imageUrl": "/images/crops/banana.jpg"
   }
   ```

**Method 2: Download Script**
1. Add URL to `imageDownloadSources` in `assets-config.json`:
   ```json
   {
     "imageDownloadSources": {
       "banana": "https://example.com/banana.jpg"
     }
   }
   ```
2. Run download script:
   ```bash
   node download-crop-images.js
   ```

### Image Fallback

Always implement fallback for missing images:

```javascript
<img 
  src={crop.imageUrl}
  onError={(e) => e.target.src = '/images/crops/default.jpg'}
  alt={crop.name}
/>
```

---

## Database Seeding

The `assets-config.json` file should be used by the seed script to ensure consistency.

### Example: Using Config in Seed Script

```javascript
const assetsConfig = require('../data/assets-config.json');

async function seedListings() {
  for (const crop of assetsConfig.crops) {
    for (const quality of assetsConfig.qualityTiers) {
      await Listing.create({
        cropType: crop.name,
        qualityTier: quality.id,
        pricePerUnit: crop.averagePrice * quality.multiplier,
        unit: crop.defaultUnit,
        images: JSON.stringify([crop.imageUrl])
      });
    }
  }
}
```

---

## Validation

### Crop ID Validation

```javascript
function isValidCrop(cropId) {
  return assetsConfig.crops.some(c => c.id === cropId);
}
```

### Quality Tier Validation

```javascript
function isValidQuality(qualityId) {
  return assetsConfig.qualityTiers.some(q => q.id === qualityId);
}
```

### Language Validation

```javascript
function isValidLanguage(langCode) {
  const lang = assetsConfig.languages.find(l => l.code === langCode);
  return lang && lang.enabled;
}
```

---

## Best Practices

### 1. Always Use Config File
❌ **Don't hardcode:**
```javascript
const crops = ['wheat', 'rice', 'tomato'];
```

✅ **Do use config:**
```javascript
const crops = assetsConfig.crops.map(c => c.id);
```

### 2. Centralize Translations
❌ **Don't scatter translations:**
```javascript
const wheatHindi = "गेहूं"; // in component
```

✅ **Do use config:**
```javascript
const wheatHindi = assetsConfig.crops
  .find(c => c.id === 'wheat').displayName.hi;
```

### 3. Use Feature Flags
❌ **Don't comment out code:**
```javascript
// if (voiceEnabled) {
//   enableVoice();
// }
```

✅ **Do use feature flags:**
```javascript
if (assetsConfig.featureFlags.voiceInterface) {
  enableVoice();
}
```

### 4. Version Control
- Always update `version` and `lastUpdated` when modifying config
- Document changes in git commit messages
- Keep backup before major changes

---

## Migration Guide

### From Hardcoded Values to Config

**Before:**
```javascript
// In PricingService.js
const QUALITY_MULTIPLIERS = {
  premium: 1.2,
  standard: 1.0,
  basic: 0.85
};
```

**After:**
```javascript
// In PricingService.js
const assetsConfig = require('../data/assets-config.json');

const QUALITY_MULTIPLIERS = assetsConfig.qualityTiers.reduce((acc, tier) => {
  acc[tier.id] = tier.multiplier;
  return acc;
}, {});
```

---

## Troubleshooting

### Issue: Crop image not loading
**Solution:** Check `imageUrl` in config matches actual file path

### Issue: Language not working
**Solution:** Verify `enabled: true` and `sarvamCode` is correct

### Issue: Wrong price calculation
**Solution:** Check `qualityTier.multiplier` and `pricingConfig.demandAdjusterRange`

### Issue: Badge not showing
**Solution:** Verify vendor meets `requirements.minScore` and `requirements.minTransactions`

---

## API Reference

### Get Crop by ID
```javascript
function getCrop(cropId) {
  return assetsConfig.crops.find(c => c.id === cropId);
}
```

### Get Localized Name
```javascript
function getLocalizedName(cropId, langCode) {
  const crop = getCrop(cropId);
  return crop?.displayName[langCode] || crop?.name;
}
```

### Calculate Final Price
```javascript
function calculatePrice(basePrice, qualityId) {
  const quality = assetsConfig.qualityTiers.find(q => q.id === qualityId);
  return basePrice * quality.multiplier;
}
```

### Check Feature Enabled
```javascript
function isFeatureEnabled(featureName) {
  return assetsConfig.featureFlags[featureName] === true;
}
```

---

## Support

For questions or issues:
1. Check this README
2. Review `assets-config.json` structure
3. Check `docs/ASSETS_CONFIGURATION.md` for detailed guide
4. Refer to seed script examples in `backend/src/utils/seed.js`

---

## Changelog

### Version 1.0.0 (2026-01-26)
- Initial configuration file created
- Added 10 crops with multilingual names
- Added 3 quality tiers
- Added 11 language configurations
- Added trust badge definitions
- Added pricing and API configurations
- Added feature flags

---

## Quick Reference

```javascript
// Load config
const config = require('./data/assets-config.json');

// Get all crops
config.crops

// Get crop names in Hindi
config.crops.map(c => c.displayName.hi)

// Get quality multipliers
config.qualityTiers.map(q => ({ id: q.id, mult: q.multiplier }))

// Get enabled languages
config.languages.filter(l => l.enabled)

// Check feature flag
config.featureFlags.voiceInterface

// Get API settings
config.apiConfig.sarvam.sttModel
```
