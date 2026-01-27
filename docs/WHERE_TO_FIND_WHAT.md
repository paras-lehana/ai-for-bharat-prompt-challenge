# Where to Find What - Quick Reference Guide

## Overview

This guide helps you quickly locate specific functionality, files, and code in the Multilingual Mandi codebase.

---

## Backend Code Locations

### Services (Business Logic)

**Location**: `backend/src/services/`

| Service | File | Purpose |
|---------|------|---------|
| AI/OpenRouter | `AIService.js` | Intent extraction, negotiation analysis, listing descriptions |
| Translation/SARVAM | `TranslationService.js` | Speech-to-text, text-to-speech, translations |
| Pricing | `PricingService.js` | Price calculations, demand adjusters, eNAM prices |
| Trust Scores | `TrustService.js` | Trust score calculations, badge awarding |
| Authentication | `AuthService.js` | OTP generation, JWT tokens, user auth |

### API Routes

**Location**: `backend/src/routes/`

| Route | File | Endpoints |
|-------|------|-----------|
| Authentication | `auth.js` | `/api/auth/send-otp`, `/api/auth/verify-otp` |
| Listings | `listings.js` | `/api/listings`, `/api/listings/search` |
| Negotiations | `negotiations.js` | `/api/negotiations`, `/api/negotiations/:id/counter` |
| Voice | `voice.js` | `/api/voice/parse-intent`, `/api/voice/transcribe` |
| Prices | `prices.js` | `/api/prices/current`, `/api/prices/calculate` |
| Vendors | `vendors.js` | `/api/vendors/nearby`, `/api/vendors/:id/ratings` |
| Ratings | `ratings.js` | `/api/ratings` |
| Disputes | `disputes.js` | `/api/disputes` |
| Messages | `messages.js` | `/api/messages` |
| Transactions | `transactions.js` | `/api/transactions` |
| Advisory | `advisory.js` | `/api/advisory/insights` |
| Analytics | `analytics.js` | `/api/analytics/dashboard` |

### Database Models

**Location**: `backend/src/models/`

| Model | File | Purpose |
|-------|------|---------|
| User | `User.js` | User accounts and profiles |
| Listing | `Listing.js` | Product listings |
| Negotiation | `Negotiation.js` | Negotiation sessions |
| Offer | `Offer.js` | Individual offers in negotiations |
| Transaction | `Transaction.js` | Completed transactions |
| Rating | `Rating.js` | User ratings |
| TrustScore | `TrustScore.js` | Vendor trust scores |
| Message | `Message.js` | Direct messages |
| Dispute | `Dispute.js` | Dispute cases |
| ENAMPrice | `ENAMPrice.js` | Cached market prices |

---

## Frontend Code Locations

### Pages

**Location**: `frontend/src/pages/`

| Page | File | Purpose |
|------|------|---------|
| Home | `Home.jsx` | Landing page with featured listings |
| Login | `Login.jsx` | Phone OTP authentication |
| Browse Listings | `BrowseListings.jsx` | Search and filter listings |
| Create Listing | `CreateListing.jsx` | Create new product listing |
| Listing Detail | `ListingDetail.jsx` | View single listing details |
| My Negotiations | `MyNegotiations.jsx` | View and manage negotiations |
| Vendor Profile | `VendorProfile.jsx` | View vendor information and ratings |
| Price Info | `PriceInfo.jsx` | View market prices |
| Guide | `Guide.jsx` | User guide and help |

### Components

**Location**: `frontend/src/components/`

| Component | File | Purpose |
|-----------|------|---------|
| Kisaan Bot | `KisaanBot.jsx` | Voice assistant interface |
| Navigation | `NavBar.jsx` | Top navigation bar |
| Loading Spinner | `LoadingSpinner.jsx` | Loading indicator |
| Translated Text | `TranslatedText.jsx` | Auto-translated text wrapper |

### Utilities

**Location**: `frontend/src/utils/`

| Utility | File | Purpose |
|---------|------|---------|
| API Client | `api.js` | Axios instance with base URL |
| Crop Image Mapper | `cropImageMapper.js` | Map crop names to image paths |

---

## Configuration Files

### Central Configuration

**File**: `data/assets-config.json`

**Contains**:
- Crop definitions with multilingual names
- Quality tiers and multipliers
- Language configurations
- Units of measurement
- Trust badges
- Pricing configuration
- API configuration
- Feature flags

### Environment Variables

**Backend**: `backend/.env`
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db
JWT_SECRET=your-secret-key

# SARVAM API
SARVAM_API_KEY=your-sarvam-key
SARVAM_API_URL=https://api.sarvam.ai

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

**Frontend**: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

---

## Testing Files

### Backend Tests

**Location**: `backend/src/**/*.test.js`

| Test File | Purpose |
|-----------|---------|
| `PricingService.test.js` | Test pricing calculations |
| `TrustService.test.js` | Test trust score calculations |
| `AIService.test.js` | Test AI integrations |
| `TranslationService.test.js` | Test translations |

### Integration Tests

**Location**: `tests/`

| Test File | Purpose |
|-----------|---------|
| `test-all-apis.js` | Test all API endpoints |
| `test-voice-full.js` | Test complete voice flow |
| `test-translation-performance.js` | Test translation performance |

### Standalone Tests

**Location**: `backend/`

| Test File | Purpose |
|-----------|---------|
| `test-sarvam-standalone.js` | Test SARVAM API directly |
| `test-openrouter-standalone.js` | Test OpenRouter API directly |

---

## Documentation Files

**Location**: `docs/`

| Document | Purpose |
|----------|---------|
| `TECH_STACK.md` | Technology stack details |
| `CODE_ARCHITECTURE.md` | Code structure and architecture |
| `TESTING_STRATEGY.md` | Testing approach and strategy |
| `API_MODIFICATION_GUIDE.md` | How to modify APIs, images, text |
| `FEATURES.md` | Complete feature list |
| `FEATURES_GUIDE.md` | Step-by-step feature usage |
| `DEPLOYMENT_GUIDE.md` | Deployment instructions |

---

## Common Tasks - Quick Reference

### Add a New Crop

1. Add image: `frontend/public/images/crops/newcrop.jpg`
2. Update config: `data/assets-config.json` → crops array
3. Update mapper: `frontend/src/utils/cropImageMapper.js`
4. Update AI service: `backend/src/services/AIService.js` → crop translations

### Add a New API Endpoint

1. Create route: `backend/src/routes/yourroute.js`
2. Register route: `backend/src/app.js`
3. Create service method: `backend/src/services/YourService.js` (if needed)
4. Test endpoint: `tests/test-all-apis.js`

### Add a New Language

1. Update config: `data/assets-config.json` → languages array
2. Add translations: `backend/src/services/TranslationService.js` → UI_TRANSLATIONS
3. Add crop names: `data/assets-config.json` → crops → displayName
4. Test translation: `tests/test-translation.js`

### Modify Pricing Formula

1. Edit service: `backend/src/services/PricingService.js`
2. Update multipliers: `QUALITY_MULTIPLIERS` object
3. Update demand logic: `getDemandAdjuster()` method
4. Test changes: `backend/src/services/PricingService.test.js`

### Modify Trust Score Weights

1. Edit service: `backend/src/services/TrustService.js`
2. Update formula: `calculateTrustScore()` method
3. Update badge thresholds: `checkAndAwardBadges()` method
4. Test changes: `backend/src/services/TrustService.test.js`

### Add New Voice Intent

1. Update AI service: `backend/src/services/AIService.js` → system prompt
2. Update frontend: `frontend/src/components/KisaanBot.jsx` → handleConfirm()
3. Create API endpoint: `backend/src/routes/` (if needed)
4. Test intent: `backend/test-openrouter-standalone.js`

---

## Image Locations

### Crop Images

**Location**: `frontend/public/images/crops/`

**Files**:
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

### Placeholder Images

**Location**: `frontend/public/images/`

**Files**:
- placeholder-crop.jpg
- placeholder-user.jpg

---

## Database

### Database File

**Location**: `backend/mandi.db` (SQLite)

### Seed Data

**File**: `backend/src/utils/seed.js`

**Run**: `cd backend && npm run seed`

### Database Schema

**File**: `backend/src/models/index.js`

**Tables**:
- users
- otps
- listings
- negotiations
- offers
- transactions
- ratings
- trust_scores
- disputes
- evidence
- messages
- enam_prices

---

## Logs

### Backend Logs

**Location**: `backend/logs/`

**Files**:
- `error.log` - Error logs
- `combined.log` - All logs

### Test Results

**Location**: `tests/`

**Files**:
- `test-all-apis-[timestamp].json` - API test results (JSON)
- `test-results-[timestamp].md` - Test results (Markdown)

---

## Docker Files

**Location**: Root directory

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Main Docker Compose configuration |
| `docker-compose.lokalmandi.yml` | Production Docker Compose |
| `Dockerfile.backend` | Backend Docker image |
| `Dockerfile.frontend` | Frontend Docker image |

---

## Package Files

**Location**: Root and subdirectories

| File | Purpose |
|------|---------|
| `package.json` | Root package with scripts |
| `backend/package.json` | Backend dependencies |
| `frontend/package.json` | Frontend dependencies |

---

## Git Files

**Location**: Root directory

| File | Purpose |
|------|---------|
| `.gitignore` | Files to ignore in Git |
| `.github/` | GitHub-specific files |

---

## Quick Search Tips

### Find by Functionality

**Pricing Logic**: Search for "calculateFinalPrice" or "QUALITY_MULTIPLIERS"

**Trust Scores**: Search for "calculateTrustScore" or "trustScoreWeights"

**Voice Interface**: Search for "processVoiceQuery" or "transcribeAudio"

**Translations**: Search for "translateText" or "UI_TRANSLATIONS"

**Authentication**: Search for "sendOTP" or "verifyOTP"

### Find by API Endpoint

**Search Pattern**: `/api/[endpoint]`

**Example**: Search for "/api/listings" to find all listing-related code

### Find by Component

**Search Pattern**: Component name in JSX files

**Example**: Search for "KisaanBot" to find voice assistant usage

---

## File Naming Conventions

### Backend

- **Services**: `[Name]Service.js` (e.g., `PricingService.js`)
- **Routes**: `[resource].js` (e.g., `listings.js`)
- **Models**: `[ModelName].js` (e.g., `User.js`)
- **Tests**: `[Name].test.js` or `[Name].pbt.test.js`

### Frontend

- **Pages**: `[PageName].jsx` (e.g., `Home.jsx`)
- **Components**: `[ComponentName].jsx` (e.g., `NavBar.jsx`)
- **Utilities**: `[utilityName].js` (e.g., `api.js`)

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
