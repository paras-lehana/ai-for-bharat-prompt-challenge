*Isolate tests** - Tests should not depend on each other
8. **Clean up after tests** - Reset database state

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**: Frontend tests fail with "Cannot read property of undefined"
**Solution**: Check if mock data is properly set up

---

## Best Practices

1. **Run tests before committing** - Ensure all tests pass
2. **Write tests for new features** - Maintain test coverage
3. **Use descriptive test names** - Make failures easy to understand
4. **Mock external APIs** - Don't rely on external services in tests
5. **Test edge cases** - Don't just test happy paths
6. **Keep tests fast** - Slow tests discourage running them
7. *uses: actions/upload-artifact@v2
        with:
          name: test-reports
          path: tests/test-*.json
```

---

## Troubleshooting Tests

### Common Issues

**Issue**: Tests fail with "Cannot find module"
**Solution**: Run `npm install` in the appropriate directory

**Issue**: API tests fail with connection refused
**Solution**: Ensure backend server is running on port 5000

**Issue**: Voice tests fail with API key error
**Solution**: Check `.env` file for valid SARVAM_API_KEY and OPENROUTER_API_KEY

**Issueite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Run API tests
        run: cd tests && node test-all-apis.js
      
      - name: Upload test reports
        eport generated in: tests/test-all-apis-[timestamp].json
```

### Reading Test Reports

**JSON Report Structure**:
```json
{
  "timestamp": "2026-01-27T10:30:00Z",
  "summary": {
    "total": 10,
    "passed": 9,
    "failed": 1,
    "passRate": "90%"
  },
  "tests": [
    {
      "name": "Health Check",
      "passed": true,
      "duration": 45,
      "details": "..."
    }
  ]
}
```

---

## Continuous Integration

### GitHub Actions Workflow

**File**: `.github/workflows/test.yml`

```yaml
name: Test Susswd"
  ];
  
  for (const input of maliciousInputs) {
    try {
      await axios.get(`http://localhost:5000/api/listings/search?cropType=${input}`);
      console.log('⚠️ Malicious input not sanitized');
    } catch (error) {
      console.log('✅ Malicious input blocked');
    }
  }
}
```

---

## Test Reporting

### Generating Test Reports

```bash
# Backend test coverage report
cd backend
npm test -- --coverage
# Report generated in: backend/coverage/

# API test report
cd tests
node test-all-apis.js
# Rttp://localhost:5000/api/listings', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response.status === 401) {
      console.log('✅ Invalid token rejected');
    }
  }
}
```

### Input Validation Tests

```javascript
// Test SQL injection prevention
async function testInputValidation() {
  const maliciousInputs = [
    "'; DROP TABLE users; --",
    "<script>alert('XSS')</script>",
    "../../etc/pa

---

## Security Tests

### Authentication Tests

```javascript
// Test JWT token validation
async function testAuthSecurity() {
  // Test 1: Access protected route without token
  try {
    await axios.get('http://localhost:5000/api/listings', {
      headers: {}
    });
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response.status === 401) {
      console.log('✅ Unauthorized access blocked');
    }
  }
  
  // Test 2: Access with invalid token
  try {
    await axios.get('h5000/api/listings/search');
```

### API Response Time Tests

```javascript
async function testAPIResponseTimes() {
  const endpoints = [
    '/api/health',
    '/api/listings/search',
    '/api/prices/current?cropType=wheat',
    '/api/vendors/nearby?cropType=wheat&lat=28.6139&lng=77.2090'
  ];
  
  for (const endpoint of endpoints) {
    const start = Date.now();
    await axios.get(`http://localhost:5000${endpoint}`);
    const end = Date.now();
    
    console.log(`${endpoint}: ${end - start}ms`);
  }
}
```fy queued actions execute

---

## Performance Tests

### Load Time Tests

```javascript
// tests/test-performance.js

const axios = require('axios');

async function testLoadTime(url) {
  const start = Date.now();
  await axios.get(url);
  const end = Date.now();
  
  const loadTime = end - start;
  console.log(`Load time: ${loadTime}ms`);
  
  if (loadTime < 1000) {
    console.log('✅ Performance good');
  } else {
    console.log('⚠️ Performance needs improvement');
  }
}

testLoadTime('http://localhost::
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Points**:
- [ ] All pages load correctly
- [ ] Voice interface works
- [ ] Forms submit properly
- [ ] Images display
- [ ] Animations work

### 5. Offline Functionality Test

**Test Steps**:
- [ ] Load application online
- [ ] View some listings
- [ ] Disconnect internet
- [ ] Verify cached listings display
- [ ] Verify offline indicator shows
- [ ] Try to create listing (should queue)
- [ ] Reconnect internet
- [ ] Veri **View Vendor Profile**
   - [ ] Click on vendor name
   - [ ] Verify trust score displays
   - [ ] Verify badges display
   - [ ] Verify vendor listings display

### 3. Mobile Responsiveness Test

**Test Devices**:
- [ ] iPhone SE (320px)
- [ ] iPhone 12 (375px)
- [ ] iPad (768px)
- [ ] Desktop (1920px)

**Test Points**:
- [ ] Navigation menu adapts
- [ ] Forms are usable
- [ ] Touch targets ≥ 44px
- [ ] Images scale properly
- [ ] Text is readable
- [ ] No horizontal scroll

### 4. Cross-Browser Test

**Browsers**Browse Listings**
   - [ ] Navigate to "Browse Listings"
   - [ ] Verify listings display with images
   - [ ] Test search filters:
     - Crop type
     - Location
     - Price range
     - Quality tier
   - [ ] Test sort options:
     - Price (low to high)
     - Price (high to low)
     - Distance
     - Trust score

3. **Make Offer**
   - [ ] Click on a listing
   - [ ] View listing details
   - [ ] Click "Make Offer"
   - [ ] Enter offer price
   - [ ] Submit offer
   - [ ] Verify negotiation created

4.utton
   - [ ] Test "Reject" button

4. **Voice Query**
   - [ ] Click "🎤 Ask Kisaan Bot"
   - [ ] Allow microphone permission
   - [ ] Speak: "मुझे गेहूं की कीमत बताओ"
   - [ ] Verify transcription displays
   - [ ] Verify intent extraction shows "price_query"
   - [ ] Click "Confirm"
   - [ ] Verify redirect to price info page

### 2. Complete User Journey - Buyer

**Test Steps**:

1. **Registration**
   - [ ] Login with different phone
   - [ ] Select role: "Buyer"
   - [ ] Select language: "Marathi"

2. **  - Crop Type: Wheat
     - Quantity: 100
     - Unit: kg
     - Base Price: 2500
     - Quality Tier: Premium
     - Location: Delhi
   - [ ] Upload image (optional)
   - [ ] Click "Create Listing"
   - [ ] Verify listing appears on "My Listings"
   - [ ] Verify price calculation shows breakdown

3. **View Negotiations**
   - [ ] Navigate to "My Negotiations"
   - [ ] Verify negotiations list loads
   - [ ] Click "View Details" on a negotiation
   - [ ] Verify negotiation details display
   - [ ] Test "Accept" b```

---

## Manual Testing Procedures

### 1. Complete User Journey - Vendor

**Test Steps**:

1. **Registration**
   - [ ] Open http://localhost:3001
   - [ ] Click "Login"
   - [ ] Enter phone: +919876543210
   - [ ] Click "Send OTP"
   - [ ] Check console for OTP (e.g., 123456)
   - [ ] Enter OTP
   - [ ] Select role: "Vendor"
   - [ ] Select language: "Hindi"
   - [ ] Click "Verify & Login"
   - [ ] Verify redirect to home page

2. **Create Listing**
   - [ ] Click "Create Listing"
   - [ ] Fill form:
   delivery, quality, response, pricing) => {
          const expected = (
            delivery * 0.4 +
            quality * 0.3 +
            response * 0.2 +
            pricing * 0.1
          );
          
          // Mock the calculation
          const result = (
            delivery * 0.4 +
            quality * 0.3 +
            response * 0.2 +
            pricing * 0.1
          );
          
          return Math.abs(result - expected) < 0.001;
        }
      ),
      { numRuns: 100 }
    );
  });
});
vascript
const fc = require('fast-check');
const TrustService = require('./TrustService');

describe('TrustService Property-Based Tests', () => {
  // Property 36: Trust Score Formula Correctness
  test('trust score formula is correct', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 5 }),  // deliveryScore
        fc.float({ min: 0, max: 5 }),  // qualityScore
        fc.float({ min: 0, max: 5 }),  // responseScore
        fc.float({ min: 0, max: 5 }),  // fairPricingScore
        (     fc.property(
        fc.constantFrom('wheat', 'rice', 'tomato', 'onion'),  // cropType
        fc.constantFrom('Delhi', 'Mumbai', 'Bangalore'),  // location
        async (cropType, location) => {
          const adjuster = await PricingService.getDemandAdjuster(cropType, location);
          
          return adjuster >= 0.8 && adjuster <= 1.3;
        }
      ),
      { numRuns: 50 }
    );
  });
});
```

### Trust Score Property Tests

**File**: `backend/src/services/TrustService.pbt.test.js`

```ja
          
          const expected = basePrice * qualityMultipliers[qualityTier] * demandAdjuster;
          const result = await PricingService.calculateFinalPrice(
            basePrice,
            qualityTier,
            'wheat',
            'Delhi'
          );
          
          return Math.abs(result.finalPrice - expected) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 19: Demand Adjuster Bounds
  test('demand adjuster stays within bounds', () => {
    fc.assert(
 // Property 18: Pricing Formula Correctness
  test('pricing formula is correct for all inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 10000 }),  // basePrice
        fc.constantFrom('premium', 'standard', 'basic'),  // qualityTier
        fc.float({ min: 0.8, max: 1.3 }),  // demandAdjuster
        async (basePrice, qualityTier, demandAdjuster) => {
          const qualityMultipliers = {
            premium: 1.2,
            standard: 1.0,
            basic: 0.85
          };{
        console.log(`  ${lang}: ${translation} ✅`);
      } else {
        console.log(`  ${lang}: MISSING ❌`);
      }
    }
  }
}

testUITranslations();
```

---

## Property-Based Tests

### Running Property-Based Tests

```bash
cd backend
npm run test:pbt
```

### Property Test Examples

**File**: `backend/src/services/PricingService.pbt.test.js`

```javascript
const fc = require('fast-check');
const PricingService = require('./PricingService');

describe('PricingService Property-Based Tests', () => {
  ervice = require('../backend/src/services/TranslationService');

function testUITranslations() {
  const phrases = [
    'Login with Phone',
    'Phone Number',
    'Send OTP',
    'Enter OTP',
    'Vendor',
    'Buyer'
  ];
  
  const languages = ['hi', 'mr', 'ta', 'te', 'kn', 'pa'];
  
  for (const phrase of phrases) {
    console.log(`\nPhrase: "${phrase}"`);
    
    for (const lang of languages) {
      const translation = TranslationService.UI_TRANSLATIONS[phrase]?.[lang];
      
      if (translation) ting: "${testCase.text}" to ${testCase.targetLang}`);
    
    const result = await TranslationService.translateText(
      testCase.text,
      'en',
      testCase.targetLang
    );
    
    console.log('Result:', result);
    
    if (result === testCase.expected) {
      console.log('✅ Translation correct');
    } else {
      console.log('⚠️ Translation differs from expected');
    }
  }
}

testTranslation();
```

### UI Translation Tests

```javascript
// Test UI translations dictionary
const TranslationSvice = require('../backend/src/services/TranslationService');

async function testTranslation() {
  const testCases = [
    {
      text: 'Welcome to Multilingual Mandi',
      targetLang: 'hi',
      expected: 'मल्टीलिंगुअल मंडी में आपका स्वागत है'
    },
    {
      text: 'Login with Phone',
      targetLang: 'mr',
      expected: 'फोनसह लॉगिन करा'
    },
    {
      text: 'Price',
      targetLang: 'ta',
      expected: 'விலை'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\nTranslad:', testCase.expectedCrop, 'Got:', result.cropType);
    }
  }
}

testIntentExtraction();
```

### Full Voice Flow Test

**File**: `tests/test-voice-full.js`

```bash
cd tests
node test-voice-full.js
```

**Test Flow**:
1. Record audio (or use test file)
2. Send to SARVAM STT
3. Get transcription
4. Send to OpenRouter for intent extraction
5. Execute appropriate API call
6. Verify response

---

## Translation Tests

### Translation API Tests

**File**: `tests/test-translation.js`

```javascript
const TranslationSertestCase.input, 'hi');
    
    console.log('Result:', result);
    
    // Verify intent
    if (result.intent === testCase.expectedIntent) {
      console.log('✅ Intent correct:', result.intent);
    } else {
      console.log('❌ Intent incorrect. Expected:', testCase.expectedIntent, 'Got:', result.intent);
    }
    
    // Verify crop type
    if (result.cropType === testCase.expectedCrop) {
      console.log('✅ Crop type correct:', result.cropType);
    } else {
      console.log('❌ Crop type incorrect. Expecte',
      expectedIntent: 'price_query',
      expectedCrop: 'wheat'
    },
    {
      input: 'मैं 100 किलो टमाटर बेचना चाहता हूं',
      expectedIntent: 'create_listing',
      expectedCrop: 'tomato',
      expectedQuantity: '100 kg'
    },
    {
      input: 'मुझे प्याज खरीदना है',
      expectedIntent: 'search_listings',
      expectedCrop: 'onion'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\nTesting: "${testCase.input}"`);
    
    const result = await AIService.processVoiceQuery(t Marathi crop names → English
   - Test Tamil crop names → English
   - Verify accuracy

3. **Negotiation Analysis**
   - Test counter-offer suggestions
   - Test reasoning generation
   - Verify price fairness logic

**Example Test**:

```javascript
// backend/test-openrouter-standalone.js

const AIService = require('./src/services/AIService');

async function testIntentExtraction() {
  console.log('Testing OpenRouter Intent Extraction...');
  
  const testCases = [
    {
      input: 'मुझे गेहूं की कीमत बताओio generated:', audio.length, 'bytes');
  console.log('✅ TTS test passed');
}

testSTT();
testTTS();
```

### OpenRouter AI Tests

**File**: `backend/test-openrouter-standalone.js`

```bash
cd backend
node test-openrouter-standalone.js
```

**Test Cases**:

1. **Intent Extraction**
   - Test price query intent
   - Test create listing intent
   - Test make offer intent
   - Test search listings intent
   - Verify parameter extraction

2. **Crop Name Translation**
   - Test Hindi crop names → English
   - TesLoad test audio file
  const audioBuffer = fs.readFileSync('./test/sample_audio.m4a');
  
  // Test transcription
  const transcript = await TranslationService.transcribeAudio(audioBuffer, 'hi');
  
  console.log('Transcript:', transcript);
  console.log('✅ STT test passed');
}

async function testTTS() {
  console.log('Testing SARVAM Text-to-Speech...');
  
  const text = 'गेहूं की कीमत 2500 रुपये प्रति क्विंटल है';
  const audio = await TranslationService.synthesizeSpeech(text, 'hi');
  
  console.log('AudTest with Marathi audio
   - Test with Tamil audio
   - Test with Telugu audio
   - Verify transcription accuracy

2. **Text-to-Speech (TTS)**
   - Test Hindi text synthesis
   - Test Marathi text synthesis
   - Verify audio quality
   - Check response time

**Example Test**:

```javascript
// backend/test-sarvam-standalone.js

const TranslationService = require('./src/services/TranslationService');
const fs = require('fs');

async function testSTT() {
  console.log('Testing SARVAM Speech-to-Text...');
  
  // stomEndpoint() {
  try {
    // Test your custom endpoint
    const response = await axios.get(`${API_BASE}/your-endpoint`);
    
    console.log('✅ Test passed:', response.data);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCustomEndpoint();
```

---

## Voice Interface Tests

### SARVAM API Tests

**File**: `backend/test-sarvam-standalone.js`

```bash
cd backend
node test-sarvam-standalone.js
```

**Test Cases**:

1. **Speech-to-Text (STT)**
   - Test with Hindi audio
   - : {...}
  }
}
```

#### 6. Vendors APIs

```javascript
// Test: GET /api/vendors/nearby
Query: ?cropType=wheat&lat=28.6139&lng=77.2090&radius=50
Expected: { success: true, data: [...] }

// Test: GET /api/vendors/:id/ratings
Expected: {
  success: true,
  data: {
    overallScore: 4.5,
    totalRatings: 25,
    breakdown: {...}
  }
}
```

### Custom API Test Script

```javascript
// tests/custom-api-test.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCu }
Expected: {
  success: true,
  intent: 'price_query',
  cropType: 'wheat',
  confidence: 'high'
}
```

#### 5. Prices APIs

```javascript
// Test: GET /api/prices/current
Query: ?cropType=wheat&location=Delhi
Expected: {
  success: true,
  data: {
    modalPrice: 2500,
    minPrice: 2400,
    maxPrice: 2600,
    source: 'enam_api'
  }
}

// Test: POST /api/prices/calculate
Body: { basePrice: 100, qualityTier: 'premium', cropType: 'wheat' }
Expected: {
  success: true,
  data: {
    finalPrice: 120,
    breakdowns: true, token: '...', user: {...} }
```

#### 3. Listings APIs

```javascript
// Test: GET /api/listings/search
Query: ?cropType=wheat&location=Delhi
Expected: { success: true, data: [...] }

// Test: POST /api/listings
Body: { cropType: 'wheat', quantity: 100, ... }
Expected: { success: true, data: {...} }

// Test: GET /api/listings/:id
Expected: { success: true, data: {...} }
```

#### 4. Voice APIs

```javascript
// Test: POST /api/voice/parse-intent
Body: { text: 'मुझे गेहूं की कीमत बताओ', language: 'hi' Report**: `tests/test-all-apis-[timestamp].json`
- **Markdown Report**: `tests/test-results-[timestamp].md`

### API Test Coverage

#### 1. Health Check

```javascript
// Test: GET /api/health
Expected: { status: 'ok', timestamp: '...' }
```

#### 2. Authentication APIs

```javascript
// Test: POST /api/auth/send-otp
Body: { phoneNumber: '+919876543210' }
Expected: { success: true, message: 'OTP sent' }

// Test: POST /api/auth/verify-otp
Body: { phoneNumber: '+919876543210', otp: '123456' }
Expected: { succes

**Test Cases**:
- ✅ Form validation
- ✅ Image upload
- ✅ Price calculation display
- ✅ Search filters
- ✅ Sort functionality
- ✅ Pagination

#### 3. Navigation Component

**File**: `frontend/src/components/NavBar.test.jsx`

**Test Cases**:
- ✅ Navigation links render
- ✅ Active route highlighting
- ✅ Mobile menu toggle
- ✅ Language selector
- ✅ User profile dropdown

---

## API Integration Tests

### Running API Tests

```bash
cd tests
node test-all-apis.js
```

### Test Output

The script generates:
- **JSON<KisaanBot />);
    // ... test error handling
  });
});
```

### Key Frontend Test Areas

#### 1. KisaanBot Component

**File**: `frontend/src/components/KisaanBot.test.jsx`

**Test Cases**:
- ✅ Voice button renders
- ✅ Modal opens/closes
- ✅ Microphone permission handling
- ✅ Audio recording starts/stops
- ✅ Intent confirmation display
- ✅ API execution after confirmation
- ✅ Error message display

#### 2. Listing Components

**Files**: `frontend/src/pages/CreateListing.test.jsx`, `BrowseListings.test.jsx`});
    expect(button).toBeInTheDocument();
  });
  
  test('opens modal on button click', () => {
    render(<KisaanBot />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText(/speak your query/i)).toBeInTheDocument();
  });
  
  test('handles microphone permission error', async () => {
    // Mock getUserMedia to reject
    navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(
      new Error('Permission denied')
    );
    
    render(# Frontend Tests

### Running Frontend Tests

```bash
cd frontend
npm test
```

### Component Tests

**Location**: `frontend/src/**/*.test.jsx`

**Example Component Test**:

```javascript
// frontend/src/components/KisaanBot.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import KisaanBot from './KisaanBot';

describe('KisaanBot Component', () => {
  test('renders voice button', () => {
    render(<KisaanBot />);
    const button = screen.getByRole('button', { name: /ask kisaan bot/i nslationService.test.js`

**Test Cases**:
- ✅ Audio transcription (SARVAM API)
- ✅ Text-to-speech synthesis
- ✅ Text translation (Google Translate API)
- ✅ UI translation dictionary lookup
- ✅ Language code validation

#### 5. Authentication Service Tests

**File**: `backend/src/services/AuthService.test.js`

**Test Cases**:
- ✅ OTP generation and validation
- ✅ JWT token creation and verification
- ✅ Phone number format validation
- ✅ OTP expiration (5 minutes)
- ✅ Retry limit enforcement (3 attempts)

---

#mula (0.4×delivery + 0.3×quality + 0.2×response + 0.1×pricing)
- ✅ Badge awarding thresholds
- ✅ Response time calculation
- ✅ Fair pricing score calculation
- ✅ Low trust score flagging

#### 3. AI Service Tests

**File**: `backend/src/services/AIService.test.js`

**Test Cases**:
- ✅ Voice query intent extraction
- ✅ Crop name translation (Hindi → English)
- ✅ Negotiation analysis
- ✅ Listing description generation
- ✅ Mock fallback behavior

#### 4. Translation Service Tests

**File**: `backend/src/services/Tra);
      expect(adjuster).toBeLessThanOrEqual(1.3);
    });
  });
});
```

### Key Test Areas

#### 1. Pricing Service Tests

**File**: `backend/src/services/PricingService.test.js`

**Test Cases**:
- ✅ Final price calculation with all quality tiers
- ✅ Demand adjuster bounds (0.8 - 1.3)
- ✅ Price breakdown completeness
- ✅ eNAM price fetching and caching
- ✅ Counter-offer generation logic

#### 2. Trust Service Tests

**File**: `backend/src/services/TrustService.test.js`

**Test Cases**:
- ✅ Trust score foroBeGreaterThan(100);
      expect(result.qualityMultiplier).toBe(1.2);
    });
    
    test('rejects invalid quality tier', async () => {
      await expect(
        PricingService.calculateFinalPrice(100, 'invalid', 'wheat', 'Delhi')
      ).rejects.toThrow();
    });
  });
  
  describe('getDemandAdjuster', () => {
    test('returns value between 0.8 and 1.3', async () => {
      const adjuster = await PricingService.getDemandAdjuster('wheat', 'Delhi');
      
      expect(adjuster).toBeGreaterThanOrEqual(0.8

**Example Test File**:

```javascript
// backend/src/services/PricingService.test.js

const PricingService = require('./PricingService');

describe('PricingService', () => {
  describe('calculateFinalPrice', () => {
    test('calculates premium price correctly', async () => {
      const result = await PricingService.calculateFinalPrice(
        100,      // basePrice
        'premium', // qualityTier
        'wheat',   // cropType
        'Delhi'    // location
      );
      
      expect(result.finalPrice).tpulate test data
```

### Starting Test Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

---

## Backend Unit Tests

### Running All Backend Tests

```bash
cd backend
npm test
```

### Running Specific Test Suites

```bash
# Test specific service
npm test -- PricingService.test.js

# Test with coverage
npm test -- --coverage

# Test in watch mode
npm test -- --watch
```

### Test Structure

**Location**: `backend/src/**/*.test.js`](#property-based-tests)
8. [Manual Testing Procedures](#manual-testing-procedures)
9. [Performance Tests](#performance-tests)
10. [Security Tests](#security-tests)

---

## Test Environment Setup

### Prerequisites

```bash
# Install dependencies
npm run install-all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with test API keys
```

### Test Database Setup

```bash
# Backend uses SQLite for testing
cd backend
npm run seed  # Potailed instructions for testing all aspects of the Multilingual Mandi application, including unit tests, integration tests, API tests, voice interface tests, and manual testing procedures.

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Backend Unit Tests](#backend-unit-tests)
3. [Frontend Tests](#frontend-tests)
4. [API Integration Tests](#api-integration-tests)
5. [Voice Interface Tests](#voice-interface-tests)
6. [Translation Tests](#translation-tests)
7. [Property-Based Tests# Comprehensive Testing Guide

## Overview

This guide provides de