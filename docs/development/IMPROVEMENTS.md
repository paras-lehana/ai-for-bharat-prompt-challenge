# Comprehensive Improvements Plan

**Date**: January 29, 2026  
**Target**: lokalmandi.lehana.in  
**Status**: Planning Phase

---

## Issue 1: Guide Page Translation Still Shows Only Heading

### Problem
After translation, the Guide page content vanishes and only the heading remains visible.

### Root Cause Analysis Needed
- Translation API may be returning empty strings
- React state not updating correctly
- Content being cleared before translation completes
- Translation response format issue

### Solution Plan

#### 1.1 Add Query Parameter Testing
**File**: `frontend/src/pages/Guide.jsx`

Add URL parameter support for testing:
```javascript
// Read lang from URL: /guide?lang=hi
const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang');
if (langParam) {
  setSelectedLanguage(langParam);
}
```

This allows testing: `https://lokalmandi.lehana.in/guide?lang=hi`

#### 1.2 Add Debug Logging
Add comprehensive console logging:
```javascript
console.log('[Guide] Translation started:', {
  language: selectedLanguage,
  guideTitle: selectedGuide?.title,
  contentLength: selectedGuide?.content?.length
});

console.log('[Guide] Translation response:', {
  translatedLength: translated?.length,
  cacheKey,
  hasContent: !!translated
});

console.log('[Guide] Display content:', {
  contentLength: getDisplayContent()?.length,
  firstChars: getDisplayContent()?.substring(0, 100)
});
```

#### 1.3 Fix Translation Logic
- Ensure translation doesn't clear existing content
- Add loading state that preserves original content
- Implement retry logic for failed translations
- Add fallback to original content on error

#### 1.4 Backend Logging
**File**: `backend/src/routes/voice.js`

Add detailed logging:
```javascript
console.log('[Translation API] Request:', {
  text: req.body.text?.substring(0, 100),
  targetLanguage: req.body.targetLanguage,
  textLength: req.body.text?.length
});

console.log('[Translation API] Response:', {
  translatedLength: translatedText?.length,
  success: !!translatedText
});
```

---

## Issue 2: Kisaan Bot LLM Takes Too Long

### Problem
The LLM response time is very slow, causing poor user experience.

### Root Cause Analysis
- OpenRouter API latency
- Large prompt size
- Model selection (Qwen3-VL 32B is heavy)
- No timeout handling
- No loading indicators

### Solution Plan

#### 2.1 Add Loading Indicators
**File**: `frontend/src/components/KisaanBot.jsx`

- Show "Thinking..." animation
- Display estimated time
- Add progress indicator
- Show partial responses if streaming available

#### 2.2 Optimize Prompts
- Reduce system prompt size
- Remove unnecessary context
- Use more efficient prompt templates
- Cache common queries

#### 2.3 Add Timeout Handling
```javascript
const TIMEOUT = 30000; // 30 seconds
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

try {
  const response = await fetch(url, {
    signal: controller.signal,
    ...options
  });
} catch (error) {
  if (error.name === 'AbortError') {
    // Handle timeout
  }
}
```

#### 2.4 Consider Faster Model
- Test with smaller models (e.g., Qwen 7B)
- Use model routing based on query complexity
- Implement response caching

#### 2.5 Add Debug Logging
```javascript
console.log('[Kisaan Bot] Request started:', {
  timestamp: Date.now(),
  query: transcribedText
});

console.log('[Kisaan Bot] LLM Response:', {
  duration: Date.now() - startTime,
  responseLength: response?.length
});
```

---

## Issue 3: Photos Not Correct in Mock Data

### Problem
Need to verify which photos are attached to which mock data entries.

### Solution Plan

#### 3.1 Create Image Audit Endpoint
**File**: `backend/src/routes/listings.js`

Add new endpoint:
```javascript
router.get('/audit/images', async (req, res) => {
  const listings = await Listing.findAll({
    attributes: ['id', 'cropType', 'images', 'vendorId'],
    include: [{ model: User, as: 'vendor', attributes: ['name'] }]
  });
  
  const audit = listings.map(l => ({
    id: l.id,
    cropType: l.cropType,
    vendor: l.vendor?.name,
    images: JSON.parse(l.images || '[]'),
    imageExists: checkImageExists(l.images)
  }));
  
  res.json({ audit });
});
```

Access at: `https://lokalmandi.lehana.in/api/listings/audit/images`

#### 3.2 Fix Seed Data
**File**: `backend/src/utils/seed.js`

Ensure correct mapping:
```javascript
const cropImageMap = {
  'Tomato': '/images/crops/tomato.jpg',
  'Onion': '/images/crops/onion.jpg',
  'Potato': '/images/crops/potato.jpg',
  // ... etc
};

// Use exact crop name match
const cropImage = cropImageMap[crop.name] || '/images/crops/wheat.jpg';
```

#### 3.3 Add Image Verification
Create verification script:
```javascript
// scripts/verify-images.js
const listings = await Listing.findAll();
listings.forEach(listing => {
  const images = JSON.parse(listing.images);
  console.log(`${listing.cropType}: ${images[0]}`);
  // Check if file exists
});
```

---

## Issue 4: Market Prices - Replace Dropdown with Crop Cards

### Problem
Current market prices page uses dropdown, need visual crop cards with photos.

### Solution Plan

#### 4.1 Redesign Price Info Page
**File**: `frontend/src/pages/PriceInfo.jsx`

New design:
```jsx
<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
  {crops.map(crop => (
    <div 
      key={crop.name}
      onClick={() => fetchPriceForCrop(crop.name)}
      className="card-interactive cursor-pointer"
    >
      <img 
        src={getCropImageUrl(crop.name)} 
        alt={crop.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{crop.name}</h3>
        <p className="text-sm text-gray-600">{crop.hindi}</p>
        {prices[crop.name] && (
          <div className="mt-2">
            <div className="text-2xl font-bold text-primary-600">
              ₹{prices[crop.name].modalPrice}
            </div>
            <div className="text-xs text-gray-500">per quintal</div>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
```

#### 4.2 Add Hover Effects
- Scale on hover
- Show price range
- Display mandi location
- Add "View Details" button

#### 4.3 Add Loading States
- Skeleton cards while loading
- Shimmer effect
- Progressive loading

---

## Issue 5: Nothing in Negotiations

### Problem
Negotiations page shows no data.

### Root Cause Analysis
- No negotiations in database
- API not returning data
- Frontend not displaying correctly
- User not logged in as buyer/vendor with negotiations

### Solution Plan

#### 5.1 Check Database
```sql
SELECT COUNT(*) FROM negotiations;
SELECT * FROM negotiations LIMIT 5;
```

#### 5.2 Add Debug Endpoint
**File**: `backend/src/routes/negotiations.js`

```javascript
router.get('/debug/all', async (req, res) => {
  const negotiations = await Negotiation.findAll({
    include: [
      { model: Listing, as: 'listing' },
      { model: User, as: 'buyer' },
      { model: User, as: 'vendor' }
    ]
  });
  
  res.json({
    count: negotiations.length,
    negotiations: negotiations.map(n => ({
      id: n.id,
      status: n.status,
      buyer: n.buyer?.name,
      vendor: n.vendor?.name,
      listing: n.listing?.cropType
    }))
  });
});
```

#### 5.3 Seed More Negotiations
Update seed script to create negotiations for test users:
```javascript
// Create negotiations for specific test user
const testBuyer = await User.findOne({ where: { phoneNumber: '+919876543210' }});
// Create 5-10 negotiations for this user
```

#### 5.4 Add Empty State
If no negotiations, show helpful message:
```jsx
<div className="text-center py-12">
  <div className="text-6xl mb-4">💬</div>
  <h3 className="text-xl font-bold mb-2">No Negotiations Yet</h3>
  <p className="text-gray-600 mb-4">
    Start negotiating by making offers on listings
  </p>
  <Link to="/browse" className="btn-primary">
    Browse Listings
  </Link>
</div>
```

---

## Issue 6: Download Multiple Images Per Crop

### Problem
Need variety of images for each crop type, not just one generic image.

### Solution Plan

#### 6.1 Create Image Download Script
**File**: `scripts/download-crop-images.js`

```javascript
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const crops = [
  'tomato', 'onion', 'potato', 'rice', 'wheat',
  'maize', 'groundnut', 'cotton', 'soybean', 'sugarcane'
];

const IMAGES_PER_CROP = 10;

async function downloadImages() {
  for (const crop of crops) {
    console.log(`Downloading images for ${crop}...`);
    
    // Use Unsplash API (free, no auth for basic use)
    const url = `https://source.unsplash.com/800x600/?${crop},agriculture,farm`;
    
    for (let i = 1; i <= IMAGES_PER_CROP; i++) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer'
        });
        
        const filename = `${crop}-${i}.jpg`;
        const filepath = path.join(__dirname, '../frontend/public/images/crops', filename);
        
        fs.writeFileSync(filepath, response.data);
        console.log(`  ✅ Downloaded ${filename}`);
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Failed to download ${crop}-${i}:`, error.message);
      }
    }
  }
}

downloadImages();
```

#### 6.2 Alternative: Pexels API
```javascript
// Use Pexels API (free with API key)
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

async function downloadFromPexels(crop) {
  const response = await axios.get(
    `https://api.pexels.com/v1/search?query=${crop}+agriculture&per_page=10`,
    {
      headers: { 'Authorization': PEXELS_API_KEY }
    }
  );
  
  for (const photo of response.data.photos) {
    // Download photo.src.large
  }
}
```

#### 6.3 Update Seed Data
**File**: `backend/src/utils/seed.js`

```javascript
function getRandomCropImage(cropName) {
  const imageCount = 10;
  const randomNum = Math.floor(Math.random() * imageCount) + 1;
  return `/images/crops/${cropName.toLowerCase()}-${randomNum}.jpg`;
}

// In listing creation:
images: JSON.stringify([getRandomCropImage(crop.name)])
```

#### 6.4 Fallback Chain
```javascript
function getCropImageWithFallback(cropName, index = 1) {
  const specificImage = `/images/crops/${cropName}-${index}.jpg`;
  const genericImage = `/images/crops/${cropName}.jpg`;
  const defaultImage = '/images/crops/wheat.jpg';
  
  // Try specific, then generic, then default
  return specificImage; // Frontend will handle fallback with onError
}
```

---

## Issue 7: Add More Features to Win

### Research Areas

#### 7.1 Analyze Competitors
- eNAM features
- Other agri-tech platforms
- What farmers actually need
- Gap analysis

#### 7.2 Feature Ideas

**A. Weather Integration**
- Show weather forecast for farmer's location
- Crop-specific weather alerts
- Best time to harvest/sell based on weather

**B. Price Prediction**
- ML model to predict future prices
- Historical price trends
- Seasonal patterns

**C. Quality Assessment**
- AI-powered image analysis for crop quality
- Automatic quality tier suggestion
- Defect detection

**D. Logistics Support**
- Transport arrangement
- Cold storage finder
- Packaging recommendations

**E. Financial Services**
- Credit score based on trust score
- Micro-loans for farmers
- Insurance recommendations

**F. Community Features**
- Farmer forums
- Success stories
- Best practices sharing
- Expert Q&A

**G. Government Schemes**
- Scheme eligibility checker
- Application assistance
- Subsidy calculator
- Document helper

**H. Crop Advisory**
- Pest and disease identification
- Treatment recommendations
- Fertilizer suggestions
- Crop rotation advice

**I. Blockchain Integration**
- Transparent supply chain
- Immutable transaction records
- Smart contracts for agreements

**J. Video Calls**
- Virtual mandi visits
- Product inspection via video
- Expert consultations

#### 7.3 Quick Wins (Can Implement Fast)

1. **Saved Searches** - Let users save their search criteria
2. **Favorites** - Bookmark listings
3. **Price Alerts** - Notify when price drops
4. **Comparison Tool** - Compare multiple listings side-by-side
5. **Share Listings** - WhatsApp/SMS sharing
6. **QR Codes** - For easy listing access
7. **Offline Mode** - View cached listings offline
8. **Dark Mode** - For better visibility
9. **Voice Notes** - Send voice messages in negotiations
10. **Auto-translate Messages** - Real-time chat translation

#### 7.4 Update tasks.md

Add new tasks for:
- Weather widget integration
- Price prediction model
- Quality assessment AI
- Saved searches feature
- Favorites system
- Price alerts
- Comparison tool
- Share functionality
- QR code generation
- Offline mode
- Dark mode
- Voice notes in chat

---

## Implementation Priority

### Phase 1: Critical Fixes (Today)
1. ✅ Disable OTP for testing (config flag)
2. ✅ Add query parameter testing for Guide page
3. ✅ Add comprehensive debug logging
4. ✅ Fix Guide page translation
5. ✅ Create image audit endpoint
6. ✅ Fix negotiations display

### Phase 2: Visual Improvements (Today)
1. ✅ Redesign Market Prices with cards
2. ✅ Download multiple crop images
3. ✅ Update seed data with varied images

### Phase 3: Performance (Tomorrow)
1. ✅ Optimize Kisaan Bot LLM
2. ✅ Add loading indicators
3. ✅ Implement caching

### Phase 4: New Features (Tomorrow)
1. ✅ Add quick win features
2. ✅ Update tasks.md with new features
3. ✅ Implement 2-3 high-impact features

---

## Testing Strategy

### 1. Live Testing on lokalmandi.lehana.in

#### Test URLs:
- Guide with Hindi: `https://lokalmandi.lehana.in/guide?lang=hi`
- Guide with Tamil: `https://lokalmandi.lehana.in/guide?lang=ta`
- Image Audit: `https://lokalmandi.lehana.in/api/listings/audit/images`
- Negotiations Debug: `https://lokalmandi.lehana.in/api/negotiations/debug/all`

#### Test with cURL:
```bash
# Test translation API
curl -X POST https://lokalmandi.lehana.in/api/voice/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLanguage":"hi"}' | jq .

# Test listings with images
curl https://lokalmandi.lehana.in/api/listings/search | jq '.listings[0:3] | .[] | {cropType, images}'

# Test negotiations
curl https://lokalmandi.lehana.in/api/negotiations/debug/all | jq .
```

### 2. Web Scraping for Verification

Create test script:
```javascript
// tests/scrape-guide-page.js
const puppeteer = require('puppeteer');

async function testGuidePage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Test English
  await page.goto('https://lokalmandi.lehana.in/guide');
  const englishContent = await page.$eval('.prose', el => el.textContent);
  console.log('English content length:', englishContent.length);
  
  // Test Hindi
  await page.goto('https://lokalmandi.lehana.in/guide?lang=hi');
  await page.waitForTimeout(5000); // Wait for translation
  const hindiContent = await page.$eval('.prose', el => el.textContent);
  console.log('Hindi content length:', hindiContent.length);
  
  await browser.close();
}
```

### 3. Log Monitoring

```bash
# Watch backend logs
docker logs -f lokalmandi-backend | grep -E "\[Translation\]|\[Guide\]|\[Kisaan Bot\]"

# Watch for errors
docker logs -f lokalmandi-backend | grep -i error
```

---

## Success Criteria

### Guide Page Translation
- ✅ Content visible in English
- ✅ Content visible after switching to Hindi
- ✅ No blank pages
- ✅ Translation completes in <5 seconds
- ✅ Fallback to English if translation fails

### Kisaan Bot
- ✅ Response time <10 seconds
- ✅ Loading indicator shows
- ✅ Timeout handling works
- ✅ Error messages are clear

### Images
- ✅ All listings have correct images
- ✅ 10 variations per crop type
- ✅ Images load quickly
- ✅ Fallback works

### Market Prices
- ✅ Cards display with images
- ✅ Hover effects work
- ✅ Prices load correctly
- ✅ Mobile responsive

### Negotiations
- ✅ Shows existing negotiations
- ✅ Empty state for no negotiations
- ✅ Can create new negotiations
- ✅ Real-time updates

### New Features
- ✅ At least 3 new features implemented
- ✅ Features are useful for farmers
- ✅ Features work on mobile
- ✅ Features are well-documented

---

## Timeline

**Today (4-6 hours)**:
- Implement critical fixes
- Add debug logging
- Fix Guide page
- Redesign Market Prices
- Download images
- Fix negotiations

**Tomorrow (4-6 hours)**:
- Optimize performance
- Add new features
- Update tasks.md
- Comprehensive testing
- Documentation

**Total**: 8-12 hours to completion

---

## Notes

- All changes will be tested on lokalmandi.lehana.in
- Debug logging will be comprehensive
- Testing will use actual URLs and cURL
- Web scraping will verify frontend rendering
- OTP will be disabled for easier testing
- Focus on winning features that showcase AI and multilingual capabilities

---

**Status**: Ready to implement  
**Next Step**: Start with Phase 1 - Critical Fixes
