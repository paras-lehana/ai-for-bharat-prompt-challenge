# Lokal Mandi - Setup and Deployment Guide

## Overview

This document outlines the changes made to rebrand "Multilingual Mandi" to "Lokal Mandi" and set up a separate deployment for testing improvements.

## Changes Made

### 1. Branding Update: Multilingual Mandi → Lokal Mandi

All references to "Multilingual Mandi" have been changed to "Lokal Mandi" in the following files:

**Frontend:**
- `frontend/index.html` - Page title and meta description
- `frontend/src/pages/Login.jsx` - Main heading
- `frontend/src/pages/Home.jsx` - Feature section headings
- `frontend/src/pages/Guide.jsx` - Documentation title

**Backend:**
- `backend/src/app.js` - API service name and console logs
- `backend/src/services/AIService.js` - OpenRouter API headers (X-Title)
- `backend/src/services/TranslationService.js` - API headers

### 2. Docker Deployment Configuration

Created a new Docker Compose configuration for separate deployment:

**File:** `docker-compose.lokalmandi.yml`

**Key Features:**
- Separate container names: `lokalmandi-backend`, `lokalmandi-frontend`
- Different IP addresses: `172.18.0.30` (backend), `172.18.0.31` (frontend)
- Different host ports: `5010` (backend), `3011` (frontend)
- Traefik labels for routing to `lokalmandi.lehana.in`
- Separate volumes to avoid conflicts with production

### 3. Deployment Script

**File:** `deploy-lokalmandi.sh`

**Usage:**
```bash
cd /root/repo/ai-for-bharat-prompt-challenge
./deploy-lokalmandi.sh
```

**What it does:**
1. Stops existing Lokal Mandi containers
2. Removes old containers
3. Builds and starts new containers
4. Shows container status and logs
5. Provides access URLs and useful commands

### 4. Prompt Improvement Documentation

**File:** `PROMPT_IMPROVEMENT_LOG.md`

This document tracks improvements to the OpenRouter AI prompts for voice intent extraction.

**Current System Prompt (Version 1.0):**
- Location: `backend/src/services/AIService.js` → `processVoiceQuery()` method
- Model: `meta-llama/llama-3.1-8b-instruct:free`
- Temperature: 0.3
- Max Tokens: 200

**Supported Intents:**
1. `price_query` - User wants to know crop prices
2. `create_listing` - User wants to sell/list a product
3. `make_offer` - User wants to make an offer on a listing
4. `search_listings` - User wants to search/buy products
5. `general_help` - General questions

**Test Cases to Run:**
- Price query in Hindi: "मुझे गेहूं की कीमत बताओ"
- Create listing: "मैं 100 किलो टमाटर बेचना चाहता हूं"
- Make offer: "मैं इस लिस्टिंग पर 5000 रुपये का ऑफर देना चाहता हूं"
- Search listings: "मुझे प्याज खरीदना है"
- General help: "यह कैसे काम करता है?"

### 5. Mock Data with Local Images

**Status:** ✅ Already configured

The seed script (`backend/src/utils/seed.js`) already uses local images from `/images/crops/`:

**Available Crop Images:**
- wheat.jpg
- rice.jpg
- tomato.jpg
- onion.jpg
- potato.jpg
- cotton.png
- sugarcane.webp
- maize.jpeg
- soybean.jpg
- groundnut.jpg

**Seed Data Includes:**
- 10 vendors with trust scores
- 5 buyers
- 20-40 listings (2-4 per vendor)
- 15 ratings

**To reseed the database:**
```bash
cd /root/repo/ai-for-bharat-prompt-challenge/backend
node src/utils/seed.js
```

## Deployment Steps

### Step 1: Deploy to lokalmandi.lehana.in

```bash
cd /root/repo/ai-for-bharat-prompt-challenge
./deploy-lokalmandi.sh
```

### Step 2: Verify Deployment

**Check containers:**
```bash
docker ps | grep lokalmandi
```

**Check logs:**
```bash
docker logs -f lokalmandi-backend
docker logs -f lokalmandi-frontend
```

**Access the application:**
- Frontend: https://lokalmandi.lehana.in
- Backend API: https://lokalmandi.lehana.in/api

### Step 3: Test Voice Assistant

The voice assistant (Kisaan Bot) uses:
1. **SARVAM STT** - Speech-to-text transcription
2. **OpenRouter AI** - Intent extraction and parameter parsing
3. **API Execution** - Calls appropriate backend APIs

**Testing Workflow:**
1. Open https://lokalmandi.lehana.in
2. Click the microphone button (Kisaan Bot)
3. Speak a query in Hindi/English
4. Verify transcription appears
5. Check if intent is correctly identified
6. Confirm API is called and results shown

### Step 4: Improve Prompts

As you test different voice inputs, document the results in `PROMPT_IMPROVEMENT_LOG.md`:

1. Record the input text
2. Note the expected intent and parameters
3. Document the actual result
4. Identify issues (wrong intent, missing parameters, etc.)
5. Modify the system prompt in `AIService.js`
6. Redeploy and test again
7. Update the log with improvements

## API Coverage Checklist

Track which APIs are successfully triggered by voice commands:

- [ ] GET /api/listings/search (price_query, search_listings)
- [ ] POST /api/listings (create_listing)
- [ ] POST /api/negotiations (make_offer)
- [ ] GET /api/listings/:id (view listing details)
- [ ] GET /api/negotiations (view my negotiations)
- [ ] POST /api/auth/send-otp (authentication)
- [ ] GET /api/vendors/:id/listings (view vendor listings)

## Traefik Configuration

The Traefik configuration in `/root/traefik_dynamic.yml` already includes routes for lokalmandi:

```yaml
# Lokmandi Frontend Router
lokmandi-router:
  rule: "(Host(`lokmandi.lehana.in`) || Host(`lokmandi.aidhunik.com`))"
  entryPoints:
    - websecure
  priority: 100
  service: lokmandi-service
  tls: {}

# Lokmandi Backend API Router
lokmandi-api-router:
  rule: "(Host(`lokmandi.lehana.in`) || Host(`lokmandi.aidhunik.com`)) && PathPrefix(`/api`)"
  entryPoints:
    - websecure
  priority: 110
  service: lokmandi-backend-service
  tls: {}
```

**Note:** The Docker labels in `docker-compose.lokalmandi.yml` will override these file-based routes, which is the recommended approach.

## Next Steps

### Priority 1: Test Voice Assistant
1. Deploy the application
2. Test voice input with various queries
3. Document results in PROMPT_IMPROVEMENT_LOG.md
4. Identify which APIs are being called correctly

### Priority 2: Improve Prompts
1. Analyze failure patterns
2. Modify system prompt in AIService.js
3. Test improvements
4. Iterate until all intents work correctly

### Priority 3: Add More Test Cases
1. Test multilingual queries (Hindi, Marathi, Tamil, Telugu)
2. Test edge cases (ambiguous queries, missing parameters)
3. Test complex queries (multiple parameters)
4. Document successful patterns

## Useful Commands

**View logs:**
```bash
docker logs -f lokalmandi-backend
docker logs -f lokalmandi-frontend
```

**Restart containers:**
```bash
docker-compose -f docker-compose.lokalmandi.yml restart
```

**Stop containers:**
```bash
docker-compose -f docker-compose.lokalmandi.yml down
```

**Rebuild and restart:**
```bash
docker-compose -f docker-compose.lokalmandi.yml up -d --build
```

**Check Traefik routes:**
```bash
curl -k https://lokalmandi.lehana.in
curl -k https://lokalmandi.lehana.in/api/health
```

**Test backend directly:**
```bash
curl http://172.18.0.30:5000/health
```

**Test frontend directly:**
```bash
curl http://172.18.0.31:3001
```

## Troubleshooting

### Issue: Containers not starting
**Solution:** Check if ports are already in use
```bash
netstat -tulpn | grep -E '5010|3011'
```

### Issue: Traefik not routing correctly
**Solution:** Check Traefik logs
```bash
docker logs traefik | grep lokalmandi
```

### Issue: Database not seeded
**Solution:** Run seed script manually
```bash
cd backend
node src/utils/seed.js
```

### Issue: Images not loading
**Solution:** Verify images exist
```bash
ls -la frontend/public/images/crops/
```

## Environment Variables

Make sure these are set in `.env`:

```bash
# OpenRouter AI
OPENROUTER_API_KEY=your_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

# SARVAM STT
SARVAM_API_KEY=your_key_here
SARVAM_API_URL=https://api.sarvam.ai

# Frontend URL
FRONTEND_URL=https://lokalmandi.lehana.in
```

## Success Criteria

- [x] Branding changed from "Multilingual Mandi" to "Lokal Mandi"
- [x] Separate Docker deployment configured
- [x] Deployment script created
- [x] Prompt improvement documentation created
- [x] Mock data with local images verified
- [ ] Application deployed to lokalmandi.lehana.in
- [ ] Voice assistant tested with all intents
- [ ] Prompt improvements documented and tested
- [ ] All APIs covered by voice commands

---

**Last Updated:** 2026-01-27
**Status:** Ready for deployment and testing
