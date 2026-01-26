# Quick Reference Guide

**Last Updated**: January 26, 2026

## 📁 Project Structure

```
multilingual-mandi/
├── data/                    # Configuration & Data
│   ├── assets-config.json   # Central config (crops, languages, pricing)
│   ├── mock_enam_prices.json # Market price data
│   └── README.md            # Config documentation
├── test/                    # All Test Files
│   ├── test-*.js            # Test scripts
│   ├── test-*.ps1           # PowerShell test scripts
│   └── VOICE_TESTING_GUIDE.md
├── backend/                 # Node.js API
├── frontend/                # React App
└── docs/                    # Documentation
```

## 🚀 Quick Start

```bash
# Start with Docker
docker-compose up --build

# Or start manually
npm run install-all
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🧪 Testing

### Run All Tests
```bash
# Voice pipeline test
node test/test-voice-complete.js

# API tests
powershell test/test-apis.ps1

# SARVAM STT test
node test/test-sarvam-audio.js

# OpenRouter test
node test/test-openrouter-transcription.js

# Kisaan Bot API test
node test/test-kisaanbot-api.js
```

### Test with Sample Audio
```bash
# Test with sample_add_listing.m4a
node test/test-sarvam-audio.js
```

## ⚙️ Configuration

### Assets Configuration
**File**: `data/assets-config.json`

```javascript
// Load in backend
const config = require('../data/assets-config.json');

// Get crop
const wheat = config.crops.find(c => c.id === 'wheat');

// Get Hindi name
const name = wheat.displayName.hi; // "गेहूं"

// Get quality multiplier
const mult = config.qualityTiers.find(q => q.id === 'premium').multiplier;

// Check feature flag
if (config.featureFlags.voiceInterface) {
  enableVoice();
}
```

### Environment Variables
**File**: `.env`

```env
# Backend
PORT=5000
JWT_SECRET=your-secret-key

# SARVAM AI
SARVAM_API_KEY=sk_6z9mp3xl_...
SARVAM_API_URL=https://api.sarvam.ai

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-a6dc5e7ea6...
OPENROUTER_MODEL=qwen/qwen3-vl-32b-instruct
```

## 📖 Documentation

### Main Guides
- **[README.md](./README.md)** - Project overview
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Deploy in 30 seconds
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing guide

### Features
- **[docs/FEATURES.md](./docs/FEATURES.md)** - Feature list
- **[docs/FEATURES_GUIDE.md](./docs/FEATURES_GUIDE.md)** - Usage guide

### Configuration
- **[data/README.md](./data/README.md)** - Assets config guide
- **[docs/ASSETS_CONFIGURATION.md](./docs/ASSETS_CONFIGURATION.md)** - Detailed guide

### Testing
- **[test/VOICE_TESTING_GUIDE.md](./test/VOICE_TESTING_GUIDE.md)** - Voice testing
- **[TEST_RESULTS.md](./TEST_RESULTS.md)** - Test results

### Deployment
- **[docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment

## 🎯 Common Tasks

### Add New Crop
Edit `data/assets-config.json`:
```json
{
  "id": "banana",
  "name": "Banana",
  "displayName": {
    "en": "Banana",
    "hi": "केला"
  },
  "category": "fruit",
  "defaultUnit": "dozen",
  "imageUrl": "/images/crops/banana.jpg",
  "averagePrice": 50
}
```

### Add New Language
Edit `data/assets-config.json`:
```json
{
  "code": "as",
  "name": "Assamese",
  "nativeName": "অসমীয়া",
  "sarvamCode": "as-IN",
  "enabled": true
}
```

### Change AI Model
Edit `.env`:
```env
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

### Enable/Disable Feature
Edit `data/assets-config.json`:
```json
{
  "featureFlags": {
    "voiceInterface": false  // Disable voice
  }
}
```

## 🔧 Troubleshooting

### Backend not starting
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Delete database and restart
rm backend/mandi.db
cd backend && npm start
```

### Frontend not loading
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Voice not working
1. Check SARVAM_API_KEY in `.env`
2. Check browser microphone permissions
3. Test with: `node test/test-sarvam-audio.js`

### Images not loading
1. Check images exist in `frontend/public/images/crops/`
2. Check paths in `data/assets-config.json`
3. Run: `node download-crop-images.js`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Listings
- `GET /api/listings/search` - Search listings
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing

### Voice
- `POST /api/voice/query` - Voice query
- `POST /api/voice/parse-intent` - Parse intent

### Prices
- `GET /api/prices/current` - Get current prices
- `POST /api/prices/calculate` - Calculate price

## 🎨 Tech Stack

**Frontend**: React 18, Tailwind CSS, Axios  
**Backend**: Node.js 18, Express, SQLite, Sequelize  
**APIs**: SARVAM AI, OpenRouter AI  
**Deployment**: Docker, Docker Compose

## 📞 Support

**Issues?**
1. Check this guide
2. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
3. Check [docs/](./docs/) folder
4. Check test results in [TEST_RESULTS.md](./TEST_RESULTS.md)

## 🎯 Quick Commands

```bash
# Install dependencies
npm run install-all

# Start development
npm run dev

# Start with Docker
docker-compose up --build

# Stop Docker
docker-compose down

# Run tests
node test/test-voice-complete.js

# Seed database
cd backend && npm run seed

# Check logs
tail -f backend/logs/error.log
```

## 📝 File Locations

| What | Where |
|------|-------|
| Assets config | `data/assets-config.json` |
| Test files | `test/` |
| Documentation | `docs/` |
| Backend code | `backend/src/` |
| Frontend code | `frontend/src/` |
| Images | `frontend/public/images/crops/` |
| Environment | `.env` |
| Docker config | `docker-compose.yml` |

---

**Built with ❤️ for Indian Farmers**
