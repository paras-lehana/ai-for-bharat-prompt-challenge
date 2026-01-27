# API Modification Guide

## Overview

This guide explains how to modify different aspects of the Multilingual Mandi application, including APIs, photos, text content, and configurations.

## Table of Contents

1. [Modifying APIs](#modifying-apis)
2. [Changing Photos/Images](#changing-photosimages)
3. [Updating Text Content](#updating-text-content)
4. [Modifying Translations](#modifying-translations)
5. [Changing Pricing Logic](#changing-pricing-logic)
6. [Updating Trust Score Calculations](#updating-trust-score-calculations)
7. [Modifying Voice Interface](#modifying-voice-interface)

---

## Modifying APIs

### Backend API Endpoints

**Location**: `backend/src/routes/`

Each route file handles a specific domain:

- **auth.js** - Authentication (OTP, login, profile)
- **listings.js** - Product listings CRUD
- **negotiations.js** - Negotiation management
- **prices.js** - Price queries and calculations
- **voice.js** - Voice interface endpoints
- **vendors.js** - Vendor discovery
- **ratings.js** - Rating submission
- **disputes.js** - Dispute resolution
- **messages.js** - Messaging
- **transactions.js** - Transaction management
- **advisory.js** - Market advisory
- **analytics.js** - Analytics dashboard

### Adding a New API Endpoint

**Example**: Add a new endpoint to get vendor statistics

1. **Open the appropriate route file** (e.g., `backend/src/routes/vendors.js`)

```javascript
// backend/src/routes/vendors.js

// Add new endpoint
router.get('/:id/statistics', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Your logic here
    const stats = await VendorService.getStatistics(id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

2. **Create service method** (if needed) in `backend/src/services/`

3. **Test the endpoint** using the test scripts in `tests/`

### Modifying Existing Endpoints

**Example**: Change the listing search logic

**File**: `backend/src/routes/listings.js`

```javascript
// Find the search endpoint
router.get('/search', async (req, res) => {
  // Modify query parameters
  const { cropType, location, minPrice, maxPrice, qualityTier } = req.query;
  
  // Add your custom logic
  const customFilter = {
    // Your modifications here
  };
  
  // Rest of the code...
});
```

### External API Integration

#### SARVAM API (Speech-to-Text, Text-to-Speech)

**File**: `backend/src/services/TranslationService.js`

**Methods**:
- `transcribeAudio(audioData, language)` - Convert speech to text
- `synthesizeSpeech(text, language)` - Convert text to speech

**Configuration**: Set in `.env`
```env
SARVAM_API_KEY=your-api-key
SARVAM_API_URL=https://api.sarvam.ai
```

**Modifying SARVAM Integration**:

```javascript
// backend/src/services/TranslationService.js

static async transcribeAudio(audioData, language = 'hi') {
  // Modify request parameters
  const response = await axios.post(
    `${process.env.SARVAM_API_URL}/speech-to-text`,
    formData,
    {
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        // Add custom headers here
      },
      // Modify timeout, retry logic, etc.
      timeout: 15000
    }
  );
  
  // Modify response processing
  return response.data.transcript;
}
```

#### OpenRouter AI (Intent Extraction, Negotiation Analysis)

**File**: `backend/src/services/AIService.js`

**Methods**:
- `processVoiceQuery(transcribedText, language)` - Extract intent from voice
- `analyzeNegotiation(listingPrice, offerPrice, marketData)` - Suggest counter-offers
- `generateListingDescription(cropType, quantity, qualityTier, location)` - Generate descriptions

**Configuration**: Set in `.env`
```env
OPENROUTER_API_KEY=your-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

**Modifying OpenRouter Integration**:

```javascript
// backend/src/services/AIService.js

static async processVoiceQuery(transcribedText, language = 'en') {
  // Modify the system prompt
  const response = await axios.post(
    `${process.env.OPENROUTER_API_URL}/chat/completions`,
    {
      model: process.env.OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: `Your custom system prompt here...`
        },
        {
          role: 'user',
          content: transcribedText
        }
      ],
      // Modify parameters
      temperature: 0.3,
      max_tokens: 200
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // Add custom headers
      }
    }
  );
  
  // Modify response parsing
  const parsed = JSON.parse(response.data.choices[0].message.content);
  return parsed;
}
```

---

## Changing Photos/Images

### Crop Images

**Location**: `frontend/public/images/crops/`

**Current Images**:
- wheat.jpg
- rice.jpg
- tomato.jpg
- onion.jpg
- potato.jpg
- cotton.png
- maize.jpeg
- soybean.jpg
- groundnut.jpg
- sugarcane.webp

### Adding New Crop Images

1. **Add image file** to `frontend/public/images/crops/`
   - Recommended format: JPG, PNG, or WebP
   - Recommended size: 400x400px to 800x800px
   - File naming: `cropname.jpg` (lowercase, no spaces)

2. **Update assets configuration** in `data/assets-config.json`

```json
{
  "crops": [
    {
      "id": "newcrop",
      "name": "New Crop",
      "displayName": {
        "en": "New Crop",
        "hi": "नई फसल"
      },
      "category": "vegetable",
      "defaultUnit": "kg",
      "imageUrl": "/images/crops/newcrop.jpg",
      "imageSource": "local",
      "averagePrice": 50,
      "season": ["winter"]
    }
  ]
}
```

3. **Update crop image mapper** in `frontend/src/utils/cropImageMapper.js`

```javascript
const cropImages = {
  // ... existing crops
  newcrop: '/images/crops/newcrop.jpg'
};
```

4. **Update seed data** in `backend/src/utils/seed.js` (if needed)

```javascript
const listings = [
  {
    cropType: 'newcrop',
    images: JSON.stringify(['/images/crops/newcrop.jpg']),
    // ... other fields
  }
];
```

### Changing Existing Images

1. **Replace the image file** in `frontend/public/images/crops/`
   - Keep the same filename to avoid breaking references
   - Or update all references if changing filename

2. **Clear browser cache** to see changes immediately

### Placeholder Images

**Location**: `frontend/public/images/`

- `placeholder-crop.jpg` - Default crop image
- `placeholder-user.jpg` - Default user avatar

To change placeholders, replace these files with your own images.

---

## Updating Text Content

### Frontend Text Content

#### Page-Level Text

**Location**: `frontend/src/pages/`

**Example**: Modify Home page text

```javascript
// frontend/src/pages/Home.jsx

<h1 className="text-4xl font-bold">
  Your Custom Title Here
</h1>

<p className="text-lg">
  Your custom description here
</p>
```

#### Component-Level Text

**Location**: `frontend/src/components/`

**Example**: Modify navigation labels

```javascript
// frontend/src/components/NavBar.jsx

const navItems = [
  { name: 'Custom Home', path: '/', icon: FaHome },
  { name: 'Custom Browse', path: '/browse', icon: FaSearch },
  // ... modify as needed
];
```

### Backend Text Content

#### Error Messages

**Location**: `backend/src/middleware/errorHandler.js`

```javascript
// Modify error messages
const errorMessages = {
  VALIDATION_ERROR: 'Your custom validation error message',
  NOT_FOUND: 'Your custom not found message',
  // ... add more
};
```

#### API Response Messages

**Location**: Individual route files in `backend/src/routes/`

```javascript
// Example: backend/src/routes/listings.js

res.json({
  success: true,
  message: 'Your custom success message',
  data: listing
});
```

### Notification Messages

**Location**: `backend/src/services/TranslationService.js`

```javascript
// Modify notification templates
static getNotificationMessage(notificationType, lang, data = {}) {
  const templates = {
    new_offer: {
      en: `Your custom message: ₹${data.amount}`,
      hi: `आपका कस्टम संदेश: ₹${data.amount}`,
      // ... other languages
    },
    // ... other notification types
  };
}
```

---

## Modifying Translations

### Translation Configuration

**Location**: `data/assets-config.json`

**Supported Languages**:
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English",
      "sarvamCode": "en-IN",
      "enabled": true
    },
    // ... other languages
  ]
}
```

### Adding a New Language

1. **Add language to configuration** in `data/assets-config.json`

```json
{
  "code": "gu",
  "name": "Gujarati",
  "nativeName": "ગુજરાતી",
  "sarvamCode": "gu-IN",
  "enabled": true
}
```

2. **Add translations** in `backend/src/services/TranslationService.js`

```javascript
static UI_TRANSLATIONS = {
  'Login with Phone': {
    // ... existing languages
    gu: 'ફોન સાથે લોગિન કરો'
  },
  // ... other phrases
};
```

3. **Add crop names** in `data/assets-config.json`

```json
{
  "id": "wheat",
  "displayName": {
    "en": "Wheat",
    "hi": "गेहूं",
    "gu": "ઘઉં"
  }
}
```

### Modifying Existing Translations

**File**: `backend/src/services/TranslationService.js`

```javascript
// Update UI translations
static UI_TRANSLATIONS = {
  'Login with Phone': {
    hi: 'Your new Hindi translation',
    mr: 'Your new Marathi translation',
    // ... update as needed
  }
};
```

### Translation API

The system uses **Google Translate unofficial API** as primary, with **MyMemory API** as fallback.

**File**: `backend/src/services/TranslationService.js`

```javascript
static async translateText(text, sourceLang = 'en', targetLang) {
  // Modify translation logic here
  // Add custom translation providers
  // Adjust fallback behavior
}
```

---

## Changing Pricing Logic

### Pricing Formula

**Current Formula**: `Final_Price = Base_Price × Quality_Multiplier × Demand_Adjuster`

**Location**: `backend/src/services/PricingService.js`

### Modifying Quality Multipliers

```javascript
// backend/src/services/PricingService.js

static QUALITY_MULTIPLIERS = {
  premium: 1.3,    // Change from 1.2 to 1.3 (30% premium)
  standard: 1.0,   // Keep at 1.0
  basic: 0.80      // Change from 0.85 to 0.80 (20% discount)
};
```

### Modifying Demand Adjuster Logic

```javascript
// backend/src/services/PricingService.js

static async getDemandAdjuster(cropType, location) {
  // Get recent transactions
  const recentTransactions = await Transaction.count({
    where: {
      createdAt: { [Op.gte]: sevenDaysAgo },
      status: { [Op.in]: ['confirmed', 'in_transit', 'delivered'] }
    }
  });

  // Modify demand calculation logic
  if (recentTransactions < 5) return 0.80;   // Very low demand
  if (recentTransactions < 20) return 0.90;  // Low demand
  if (recentTransactions < 50) return 1.00;  // Normal demand
  if (recentTransactions < 100) return 1.10; // High demand
  return 1.20;                                // Very high demand
}
```

### Modifying Price Breakdown Display

```javascript
// backend/src/services/PricingService.js

static getPriceBreakdown(basePrice, qualityMultiplier, demandAdjuster, finalPrice, qualityTier) {
  return {
    title: "Your Custom Title",
    steps: [
      {
        label: "Your Custom Label",
        value: `₹${basePrice}`,
        description: "Your custom description"
      },
      // ... modify steps
    ],
    fairRange: {
      min: Math.round(finalPrice * 0.90 * 100) / 100,  // Change range
      max: Math.round(finalPrice * 1.10 * 100) / 100
    }
  };
}
```

### Adding New Pricing Factors

```javascript
// backend/src/services/PricingService.js

static async calculateFinalPrice(basePrice, qualityTier, cropType, location) {
  const qualityMultiplier = this.QUALITY_MULTIPLIERS[qualityTier] || 1.0;
  const demandAdjuster = await this.getDemandAdjuster(cropType, location);
  
  // Add new factor: seasonal multiplier
  const seasonalMultiplier = this.getSeasonalMultiplier(cropType);
  
  // Update formula
  const finalPrice = basePrice * qualityMultiplier * demandAdjuster * seasonalMultiplier;
  
  return {
    basePrice,
    qualityMultiplier,
    demandAdjuster,
    seasonalMultiplier,  // Add to response
    finalPrice: Math.round(finalPrice * 100) / 100,
    breakdown: this.getPriceBreakdown(/* ... */)
  };
}

// Add new method
static getSeasonalMultiplier(cropType) {
  const currentMonth = new Date().getMonth();
  // Your seasonal logic here
  return 1.0;
}
```

---

## Updating Trust Score Calculations

### Trust Score Formula

**Current Formula**: `Trust Score = 0.4×delivery + 0.3×quality + 0.2×response + 0.1×fair_pricing`

**Location**: `backend/src/services/TrustService.js`

### Modifying Weight Distribution

```javascript
// backend/src/services/TrustService.js

static async calculateTrustScore(vendorId) {
  // ... get scores
  
  // Modify weights
  const overallScore = (
    deliveryScore * 0.35 +    // Change from 0.4
    qualityScore * 0.35 +     // Change from 0.3
    responseScore * 0.20 +    // Keep at 0.2
    fairPricingScore * 0.10   // Keep at 0.1
  );
  
  // ... rest of code
}
```

### Modifying Response Score Calculation

```javascript
// backend/src/services/TrustService.js

static async calculateResponseScore(vendorId) {
  // ... get messages
  
  // Modify scoring thresholds
  if (avgResponseTime < 15) return 5.0;   // < 15 min (was 30)
  if (avgResponseTime < 30) return 4.5;   // 15-30 min (was 30-60)
  if (avgResponseTime < 60) return 4.0;   // 30-60 min (was 1-2 hours)
  if (avgResponseTime < 120) return 3.5;  // 1-2 hours (was 2-4 hours)
  if (avgResponseTime < 240) return 3.0;  // 2-4 hours (was 4-8 hours)
  return 2.5;                              // > 4 hours (was > 8 hours)
}
```

### Modifying Badge Requirements

```javascript
// backend/src/services/TrustService.js

static async checkAndAwardBadges(vendorId, trustScore, transactionCount) {
  const badges = [];

  // Modify Trusted Vendor requirements
  if (trustScore >= 4.7 && transactionCount >= 15) {  // Was 4.5 and 20
    badges.push('trusted_vendor');
  }

  // Modify Verified Seller requirements
  if (trustScore >= 4.2 && transactionCount >= 40) {  // Was 4.0 and 50
    badges.push('verified_seller');
  }

  // Add new badge
  if (trustScore >= 4.9 && transactionCount >= 100) {
    badges.push('elite_seller');
  }

  // ... rest of code
}
```

### Adding New Trust Factors

```javascript
// backend/src/services/TrustService.js

// Add new method
static async calculateCommunicationScore(vendorId) {
  // Calculate based on message quality, clarity, etc.
  return 4.0;
}

// Update main calculation
static async calculateTrustScore(vendorId) {
  // ... existing scores
  const communicationScore = await this.calculateCommunicationScore(vendorId);
  
  // Update formula with new factor
  const overallScore = (
    deliveryScore * 0.35 +
    qualityScore * 0.25 +
    responseScore * 0.15 +
    fairPricingScore * 0.10 +
    communicationScore * 0.15  // New factor
  );
  
  // ... rest of code
}
```

---

## Modifying Voice Interface

### Voice Query Processing

**Location**: `backend/src/services/AIService.js`

### Modifying Intent Extraction

```javascript
// backend/src/services/AIService.js

static async processVoiceQuery(transcribedText, language = 'en') {
  // Modify system prompt to add new intents
  const response = await axios.post(
    `${process.env.OPENROUTER_API_URL}/chat/completions`,
    {
      model: process.env.OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for an agricultural marketplace.

Possible intents:
- price_query: User wants to know crop prices
- create_listing: User wants to sell/list a product
- make_offer: User wants to make an offer on a listing
- search_listings: User wants to search/buy products
- check_weather: User wants weather information (NEW)
- general_help: General questions

Extract these parameters if mentioned:
- cropType: Name of the crop in ENGLISH ONLY
- quantity: Amount with unit
- price: Price mentioned
- location: Place name
- qualityTier: premium, standard, or basic
- weatherLocation: Location for weather query (NEW)

Response format (pure JSON only):
{
  "intent": "<intent_type>",
  "cropType": "<crop_name or null>",
  "quantity": "<quantity or null>",
  "price": "<price or null>",
  "location": "<location or null>",
  "qualityTier": "<tier or null>",
  "weatherLocation": "<location or null>",
  "confidence": "<high/medium/low>"
}`
        },
        {
          role: 'user',
          content: transcribedText
        }
      ]
    },
    // ... headers
  );
  
  // ... parse and return
}
```

### Adding New Crop Name Translations

```javascript
// backend/src/services/AIService.js

// In the system prompt, add new translations:
content: `...
CRITICAL TRANSLATION RULES:
- गेहूं → wheat
- चावल → rice
- टमाटर → tomato
- बैंगन → eggplant (NEW)
- भिंडी → okra (NEW)
- गाजर → carrot (NEW)
...`
```

### Modifying Voice Response Generation

**Location**: `frontend/src/components/KisaanBot.jsx`

```javascript
// frontend/src/components/KisaanBot.jsx

const handleConfirm = async () => {
  // Modify API execution logic
  switch (parsedIntent.intent) {
    case 'price_query':
      // Your custom logic
      break;
    
    case 'create_listing':
      // Your custom logic
      break;
    
    case 'check_weather':  // NEW
      // Add new intent handling
      const weatherData = await api.get(`/weather?location=${parsedIntent.weatherLocation}`);
      navigate('/weather', { state: { data: weatherData } });
      break;
    
    // ... other cases
  }
};
```

### Modifying Audio Recording Settings

```javascript
// frontend/src/components/KisaanBot.jsx

const startRecording = async () => {
  // Modify recording options
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 16000,  // Change sample rate
      channelCount: 1     // Mono audio
    }
  });
  
  // Modify MediaRecorder options
  const recorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm',  // Change format
    audioBitsPerSecond: 128000  // Change bitrate
  });
  
  // ... rest of code
};
```

---

## Configuration Files

### Central Assets Configuration

**Location**: `data/assets-config.json`

This file contains:
- Crop definitions with multilingual names
- Quality tiers and multipliers
- Language configurations
- Units of measurement
- Trust badges
- Pricing configuration
- API configuration
- Feature flags

**Modifying Configuration**:

```json
{
  "pricingConfig": {
    "demandAdjusterRange": {
      "min": 0.75,  // Change from 0.8
      "max": 1.35   // Change from 1.3
    },
    "trustScoreWeights": {
      "delivery": 0.35,      // Change from 0.4
      "quality": 0.35,       // Change from 0.3
      "response": 0.20,      // Keep at 0.2
      "fairPricing": 0.10    // Keep at 0.1
    }
  },
  "featureFlags": {
    "voiceInterface": true,
    "realTimeMessaging": true,
    "offlineSupport": true,
    "pwaEnabled": true,
    "disputeResolution": true,
    "microAggregation": true,
    "advisoryService": true,
    "analytics": true,
    "weatherIntegration": true  // NEW
  }
}
```

### Environment Variables

**Backend**: `backend/.env`
**Frontend**: `frontend/.env`

**Modifying Environment Variables**:

```env
# Backend (.env)
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db

# SARVAM API
SARVAM_API_KEY=your-new-key
SARVAM_API_URL=https://api.sarvam.ai

# OpenRouter AI
OPENROUTER_API_KEY=your-new-key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct

# Add new services
WEATHER_API_KEY=your-weather-key
WEATHER_API_URL=https://api.weather.com
```

---

## Testing Modified Code

### Backend API Tests

**Location**: `tests/test-all-apis.js`

```bash
# Run all API tests
cd tests
node test-all-apis.js
```

### Voice Interface Tests

**Location**: `backend/test-sarvam-standalone.js`, `backend/test-openrouter-standalone.js`

```bash
# Test SARVAM API
cd backend
node test-sarvam-standalone.js

# Test OpenRouter API
node test-openrouter-standalone.js
```

### Frontend Tests

```bash
# Start development server
cd frontend
npm run dev

# Test in browser
# Open http://localhost:3001
```

### Integration Tests

```bash
# Run full integration test
cd tests
node test-full-flow.js
```

---

## Common Modification Scenarios

### Scenario 1: Add a New Crop

1. Add image to `frontend/public/images/crops/newcrop.jpg`
2. Update `data/assets-config.json` with crop definition
3. Update `frontend/src/utils/cropImageMapper.js`
4. Update `backend/src/services/AIService.js` with Hindi/regional name mapping
5. Test voice query: "मुझे [crop name] की कीमत बताओ"

### Scenario 2: Change Pricing Formula

1. Modify `backend/src/services/PricingService.js`
2. Update quality multipliers or demand adjuster logic
3. Test with `tests/test-all-apis.js`
4. Verify price breakdown display in frontend

### Scenario 3: Add a New Language

1. Add language to `data/assets-config.json`
2. Add translations to `backend/src/services/TranslationService.js`
3. Add crop names in new language to `data/assets-config.json`
4. Test translation API with new language code

### Scenario 4: Modify Trust Score Weights

1. Update weights in `backend/src/services/TrustService.js`
2. Recalculate existing trust scores (run migration script if needed)
3. Test with `tests/test-all-apis.js`
4. Verify badge awarding logic

### Scenario 5: Add New Voice Intent

1. Update system prompt in `backend/src/services/AIService.js`
2. Add intent handling in `frontend/src/components/KisaanBot.jsx`
3. Create new API endpoint if needed
4. Test with voice input

---

## Best Practices

1. **Always test after modifications** - Use provided test scripts
2. **Update documentation** - Keep this guide and README.md updated
3. **Use version control** - Commit changes with clear messages
4. **Backup configuration** - Keep backups of `assets-config.json` and `.env` files
5. **Test in multiple languages** - Ensure translations work correctly
6. **Check mobile responsiveness** - Test UI changes on mobile devices
7. **Monitor API usage** - Track SARVAM and OpenRouter API calls
8. **Log errors** - Use console.log and Winston logger for debugging

---

## Troubleshooting

### API Not Working

1. Check `.env` file for correct API keys
2. Verify API endpoint URLs
3. Check network connectivity
4. Review error logs in `backend/logs/`

### Images Not Loading

1. Verify image path in `frontend/public/images/crops/`
2. Check `cropImageMapper.js` mapping
3. Clear browser cache
4. Check console for 404 errors

### Translations Not Working

1. Verify language code in `data/assets-config.json`
2. Check `TranslationService.js` for language support
3. Test translation API separately
4. Check browser console for errors

### Voice Interface Issues

1. Check microphone permissions
2. Verify SARVAM API key
3. Test audio recording in browser
4. Check OpenRouter API response
5. Review logs in browser console

---

## Additional Resources

- **API Documentation**: See `docs/API_DOCUMENTATION.md`
- **Testing Guide**: See `docs/TESTING_STRATEGY.md`
- **Tech Stack**: See `docs/TECH_STACK.md`
- **Code Architecture**: See `docs/CODE_ARCHITECTURE.md`

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
