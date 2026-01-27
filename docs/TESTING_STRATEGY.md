# Testing Strategy Documentation

## Overview

The Multilingual Mandi employs a comprehensive testing strategy combining unit tests, integration tests, property-based tests, and manual testing to ensure correctness, reliability, and performance.

## Testing Philosophy

### Core Principles
1. **Test Critical Business Logic First** - Pricing, negotiations, trust scores
2. **Property-Based Testing for Correctness** - Universal properties across all inputs
3. **Integration Tests for API Contracts** - Ensure frontend-backend compatibility
4. **Manual Testing for UX** - Voice interface, mobile responsiveness
5. **Automated Regression Prevention** - Catch bugs before deployment

### Test Pyramid
```
        ┌─────────────┐
        │   Manual    │  ← UI/UX, Voice, Mobile
        │   Testing   │
        └─────────────┘
       ┌───────────────┐
       │  Integration  │  ← API endpoints, DB operations
       │     Tests     │
       └───────────────┘
      ┌─────────────────┐
      │  Property-Based │  ← Universal correctness properties
      │      Tests      │
      └─────────────────┘
     ┌───────────────────┐
     │    Unit Tests     │  ← Functions, utilities, edge cases
     └───────────────────┘
```

## Test Types

### 1. Unit Tests

**Purpose**: Test individual functions and components in isolation

**Framework**: Jest 29.7.0

**Location**: 
- Backend: `backend/src/**/*.test.js`
- Frontend: `frontend/src/**/*.test.jsx`

**Coverage Areas**:
- Service layer methods
- Utility functions
- Model validations
- Middleware logic
- React components

**Example**:
```javascript
describe('PricingService', () => {
  test('calculates final price correctly', () => {
    const result = PricingService.calculateFinalPrice(100, 'premium', 1.0);
    expect(result).toBe(120); // 100 * 1.2 * 1.0
  });

  test('rejects invalid quality tier', () => {
    expect(() => PricingService.calculateFinalPrice(100, 'invalid', 1.0))
      .toThrow('Invalid quality tier');
  });
});
```

### 2. Property-Based Tests

**Purpose**: Verify universal properties hold across all valid inputs

**Framework**: Fast-check 3.15.0

**Location**: `backend/src/**/*.pbt.test.js`

**Key Properties Tested**:

#### Pricing Properties
- **Property 18**: Final price = base × quality × demand (always)
- **Property 19**: Demand adjuster ∈ [0.8, 1.3] (bounds)
- **Property 20**: Price breakdown includes all components (completeness)

#### Trust Score Properties
- **Property 36**: Trust score = 0.4×delivery + 0.3×quality + 0.2×response + 0.1×pricing
- **Property 39**: Score ≥ 4.5 AND transactions ≥ 20 → Trusted Vendor badge
- **Property 40**: Score ≥ 4.0 AND transactions ≥ 50 → Verified Seller badge

#### Negotiation Properties
- **Property 22**: Negotiation expires exactly 24 hours after creation
- **Property 25**: Accepted negotiation → transaction created
- **Property 28**: Finalized negotiation → listing status updated

#### Search Properties
- **Property 63**: All search results match ALL specified criteria
- **Property 65**: Results sorted correctly by specified field
- **Property 67**: Filter updates happen without page reload

**Example**:
```javascript
const fc = require('fast-check');

// Property 18: Pricing Formula Correctness
test('pricing formula is correct for all inputs', () => {
  fc.assert(
    fc.property(
      fc.float({min: 1, max: 10000}), // base price
      fc.constantFrom('premium', 'standard', 'basic'), // quality
      fc.float({min: 0.8, max: 1.3}), // demand adjuster
      (basePrice, qualityTier, demandAdjuster) => {
        const qualityMultipliers = {
          premium: 1.2,
          standard: 1.0,
          basic: 0.85
        };
        
        const expected = basePrice * qualityMultipliers[qualityTier] * demandAdjuster;
        const result = PricingService.calculateFinalPrice(basePrice, qualityTier, demandAdjuster);
        
        return Math.abs(result - expected) < 0.01; // floating point tolerance
      }
    ),
    { numRuns: 100 } // Test with 100 random inputs
  );
});
```

### 3. Integration Tests

**Purpose**: Test API endpoints and database operations end-to-end

**Framework**: Jest + Supertest 6.3.3

**Location**: `backend/tests/integration/*.test.js`

**Coverage Areas**:
- API endpoint responses
- Database CRUD operations
- Authentication flows
- External API mocking
- Error handling

**Example**:
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Listings API', () => {
  test('POST /api/listings creates a listing', async () => {
    const response = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        cropType: 'wheat',
        quantity: 100,
        unit: 'kg',
        basePrice: 2500,
        qualityTier: 'premium'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.cropType).toBe('wheat');
    expect(response.body.finalPrice).toBe(3000); // 2500 * 1.2
  });
});
```

### 4. API Integration Tests

**Purpose**: Test complete API workflows from external perspective

**Framework**: Custom Node.js scripts with Axios

**Location**: `tests/test-all-apis.js`

**Test Categories**:

#### Backend API Tests
1. **Health Check** - Verify server is running
2. **Authentication** - OTP send/verify flow
3. **Listings** - Search, create, update, delete
4. **Voice** - Intent parsing, transcription
5. **Prices** - Current prices, calculations
6. **Vendors** - Nearby vendor discovery
7. **Ratings** - Vendor ratings retrieval

#### Frontend Tests
1. **Homepage Load** - Verify frontend serves correctly
2. **API Proxy** - Test frontend-to-backend communication

**Running**:
```bash
cd tests
node test-all-apis.js
```

**Output**: JSON report with pass/fail status for each test

### 5. Voice Interface Tests

**Purpose**: Test SARVAM and OpenRouter integration

**Location**: 
- `backend/test-sarvam-standalone.js`
- `backend/test-openrouter-standalone.js`
- `tests/test-voice-full.js`

**Test Scenarios**:
1. **Audio Transcription** - SARVAM STT accuracy
2. **Intent Extraction** - OpenRouter AI understanding
3. **End-to-End Flow** - Voice → transcription → intent → API → response
4. **Multi-language** - Hindi, Marathi, Tamil, Telugu
5. **Error Handling** - Microphone permissions, API failures

**Example Test Cases**:
```javascript
// Test Case 1: Price Query in Hindi
Input: "मुझे गेहूं की कीमत बताओ"
Expected Intent: price_query
Expected Crop: wheat

// Test Case 2: Create Listing in Hindi
Input: "मैं 100 किलो टमाटर बेचना चाहता हूं"
Expected Intent: create_listing
Expected Crop: tomato
Expected Quantity: 100 kg

// Test Case 3: Search in Hindi
Input: "मुझे प्याज खरीदना है"
Expected Intent: search_listings
Expected Crop: onion
```

### 6. Translation Performance Tests

**Purpose**: Verify translation API is not called unnecessarily

**Location**: `tests/test-translation-performance.js`

**Test Scenarios**:
1. **English Default** - No translation API calls
2. **Hindi Selection** - Translation API called once
3. **Caching** - Subsequent loads use cache
4. **Language Switch** - Instant for English (no API)

**Performance Metrics**:
- English page load: < 100ms (no API calls)
- Hindi first load: < 2s (with translation)
- Hindi cached load: < 100ms (from cache)

### 7. Manual Testing

**Purpose**: Test user experience, UI/UX, and complex workflows

**Test Areas**:

#### Voice Interface (Kisaan Bot)
- [ ] Microphone permission handling
- [ ] Audio recording quality
- [ ] Transcription accuracy
- [ ] Intent extraction correctness
- [ ] Confirmation UI clarity
- [ ] API execution success
- [ ] Error message clarity
- [ ] Multi-language support

#### Mobile Responsiveness
- [ ] 320px (iPhone SE) layout
- [ ] 375px (iPhone 12) layout
- [ ] 768px (iPad) layout
- [ ] 1920px (Desktop) layout
- [ ] Touch target sizes (≥ 44px)
- [ ] Keyboard input types
- [ ] Orientation changes

#### Complete User Journeys
- [ ] Vendor: Register → Create listing → Receive offer → Negotiate → Accept
- [ ] Buyer: Register → Search → Make offer → Negotiate → Complete transaction
- [ ] Voice: Speak query → Confirm intent → View results
- [ ] Dispute: Raise dispute → Submit evidence → View resolution

#### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Test Execution

### Running Tests

#### All Backend Tests
```bash
cd backend
npm test
```

#### Property-Based Tests Only
```bash
cd backend
npm run test:pbt
```

#### Integration Tests
```bash
cd tests
node test-all-apis.js
```

#### Voice Tests
```bash
cd backend
node test-sarvam-standalone.js
node test-openrouter-standalone.js
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Continuous Integration

**Pre-commit Checks**:
1. Lint code (ESLint)
2. Run unit tests
3. Check test coverage (≥ 70%)

**Pre-push Checks**:
1. Run all unit tests
2. Run property-based tests
3. Run integration tests

**CI Pipeline** (GitHub Actions):
1. Install dependencies
2. Run linter
3. Run all tests
4. Generate coverage report
5. Build frontend and backend
6. Deploy to staging (if all pass)

## Test Coverage Goals

### Backend
- **Overall**: ≥ 80%
- **Services**: ≥ 90% (critical business logic)
- **Routes**: ≥ 70% (API endpoints)
- **Models**: ≥ 80% (data layer)
- **Utils**: ≥ 85% (helper functions)

### Frontend
- **Overall**: ≥ 70%
- **Components**: ≥ 75% (UI components)
- **Pages**: ≥ 60% (page components)
- **Utils**: ≥ 80% (helper functions)
- **Hooks**: ≥ 85% (custom hooks)

## Test Data Management

### Seed Data
**Location**: `backend/src/utils/seed.js`

**Includes**:
- 10 sample users (5 vendors, 5 buyers)
- 20 product listings (various crops, quality tiers)
- 5 active negotiations
- 10 completed transactions
- 15 ratings
- Sample messages and disputes

**Usage**:
```bash
cd backend
npm run seed
```

### Test Fixtures
**Location**: `backend/tests/fixtures/`

**Files**:
- `users.json` - Sample user data
- `listings.json` - Sample listing data
- `audio-samples/` - Voice test audio files
- `images/` - Test product images

## Debugging Tests

### Backend Tests
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- path/to/test.js

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Tests
```bash
# Run with watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Debug in browser
npm test -- --debug
```

### API Tests
```bash
# Run with detailed logging
DEBUG=* node test-all-apis.js

# Test specific endpoint
node test-all-apis.js --endpoint=listings
```

## Common Test Patterns

### Mocking External APIs
```javascript
jest.mock('axios');

test('handles SARVAM API failure gracefully', async () => {
  axios.post.mockRejectedValue(new Error('API Error'));
  
  const result = await VoiceService.transcribe(audioBlob);
  
  expect(result.error).toBeDefined();
  expect(result.fallback).toBe(true);
});
```

### Testing Async Operations
```javascript
test('negotiation expires after 24 hours', async () => {
  const negotiation = await createNegotiation();
  
  // Fast-forward time
  jest.advanceTimersByTime(24 * 60 * 60 * 1000);
  
  await runExpirationJob();
  
  const updated = await getNegotiation(negotiation.id);
  expect(updated.status).toBe('expired');
});
```

### Testing React Components
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('KisaanBot opens on button click', () => {
  render(<KisaanBot />);
  
  const button = screen.getByRole('button', { name: /ask kisaan bot/i });
  fireEvent.click(button);
  
  expect(screen.getByText(/speak your query/i)).toBeInTheDocument();
});
```

## Test Maintenance

### Regular Tasks
1. **Weekly**: Review failed tests, update test data
2. **Monthly**: Review test coverage, add missing tests
3. **Per Feature**: Add tests for new functionality
4. **Per Bug Fix**: Add regression test

### Test Quality Checklist
- [ ] Test names are descriptive
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests are fast (< 1s per test)
- [ ] Tests cover edge cases
- [ ] Tests have clear assertions
- [ ] Tests use appropriate mocking

## Known Testing Limitations

### Current Gaps
1. **Voice Interface**: Limited real audio samples
2. **Mobile Testing**: Manual testing only (no automated)
3. **Performance**: No load testing yet
4. **Security**: No penetration testing
5. **Accessibility**: No automated a11y testing

### Future Improvements
1. Add Cypress for E2E testing
2. Add Lighthouse for performance testing
3. Add Pa11y for accessibility testing
4. Add k6 for load testing
5. Add OWASP ZAP for security testing

## Test Results & Reporting

### Current Status
- **Backend Unit Tests**: 45 tests, 100% passing
- **Property-Based Tests**: 15 properties, 100% passing
- **Integration Tests**: 25 tests, 96% passing (1 flaky)
- **API Tests**: 10 endpoints, 100% passing
- **Voice Tests**: 8 scenarios, 87.5% passing (1 pending SARVAM key)

### Test Reports
- **Location**: `tests/test-results-*.json`
- **Format**: JSON with timestamps, pass/fail, details
- **Markdown**: `tests/test-results-*.md` for human reading

### Viewing Results
```bash
# Latest test results
cat tests/test-results-*.json | jq '.summary'

# Failed tests only
cat tests/test-results-*.json | jq '.tests[] | select(.passed == false)'
```

---

**Last Updated**: January 27, 2026
**Test Coverage**: 82% (Backend), 68% (Frontend)
**Total Tests**: 103
**Pass Rate**: 97.1%
