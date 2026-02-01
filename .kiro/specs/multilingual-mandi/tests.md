# Comprehensive Testing Guide - Multilingual Mandi

## Overview

This document provides comprehensive test cases for all features of the Multilingual Mandi platform. Tests are organized by feature area and include both API tests (using curl/scripts) and browser-based manual tests.

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3001`
- Database seeded with test data (`npm run seed`)
- Test mode enabled (see configuration below)

### Test Mode Configuration

Add to `backend/.env`:
```
# Test Mode - Bypasses OTP verification
TEST_MODE=true
TEST_USER_PHONE=+919876543210
TEST_USER_TOKEN=test-token-12345
```

### Test Users

**Vendor User:**
- Phone: +919876543210
- Role: vendor
- Name: Test Vendor
- Location: Delhi

**Buyer User:**
- Phone: +919876543211
- Role: buyer
- Name: Test Buyer
- Location: Mumbai

## Test Categories

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Listing Management](#2-listing-management)
3. [Search & Discovery](#3-search--discovery)
4. [Pricing & Quality](#4-pricing--quality)
5. [Negotiation Engine](#5-negotiation-engine)
6. [Trust & Rating System](#6-trust--rating-system)
7. [Messaging](#7-messaging)
8. [Transactions](#8-transactions)
9. [Voice Interface (Kisaan Bot)](#9-voice-interface-kisaan-bot)
10. [eNAM Integration](#10-enam-integration)
11. [Vendor Discovery & Collaboration](#11-vendor-discovery--collaboration)
12. [Advisory & Analytics](#12-advisory--analytics)
13. [Favorites & Saved Searches](#13-favorites--saved-searches)
14. [Price Alerts](#14-price-alerts)
15. [Social Features (Share, QR)](#15-social-features-share-qr)
16. [Dark Mode & Accessibility](#16-dark-mode--accessibility)
17. [PWA & Offline Features](#17-pwa--offline-features)
18. [Multilingual Support](#18-multilingual-support)

---

## 1. Authentication & Authorization

### 1.1 Health Check
**API Test:**
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status":"ok","timestamp":"...","service":"Lokal Mandi API"}`

### 1.2 Send OTP (Normal Mode)
**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919876543210"}'
```
**Expected:** `{"success":true,"message":"OTP sent successfully"}`

### 1.3 Verify OTP (Test Mode Bypass)
**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919876543210","otp":"000000"}'
```
**Expected:** `{"success":true,"token":"...","user":{...}}`
**Note:** In test mode, OTP "000000" always works

### 1.4 Get Profile
**API Test:**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** User profile data

### 1.5 Update Profile
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","languagePreference":"hi"}'
```
**Expected:** Updated profile

**Browser Test:**
1. Navigate to login page
2. Enter phone number
3. Enter OTP "000000" (test mode)
4. Should redirect to home/dashboard
5. Check profile page shows correct data

---

## 2. Listing Management

### 2.1 Create Listing
**API Test:**
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType":"wheat",
    "quantity":100,
    "unit":"quintal",
    "basePrice":2000,
    "qualityTier":"premium",
    "location":"Delhi",
    "description":"High quality wheat"
  }'
```
**Expected:** Created listing with calculated final price

### 2.2 Get Listing by ID
**API Test:**
```bash
curl http://localhost:5000/api/listings/1
```
**Expected:** Listing details

### 2.3 Update Listing
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/listings/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"basePrice":2100,"status":"active"}'
```
**Expected:** Updated listing

### 2.4 Delete Listing
**API Test:**
```bash
curl -X DELETE http://localhost:5000/api/listings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Success message

### 2.5 Get Vendor Listings
**API Test:**
```bash
curl http://localhost:5000/api/vendors/1/listings
```
**Expected:** Array of vendor's listings

**Browser Test:**
1. Login as vendor
2. Navigate to "Create Listing"
3. Fill form with crop details
4. Upload image (optional)
5. Submit and verify listing appears
6. Edit listing and verify changes
7. Delete listing and verify removal

---

## 3. Search & Discovery

### 3.1 Search Listings (No Filters)
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search"
```
**Expected:** Array of all active listings

### 3.2 Search with Crop Filter
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search?cropType=wheat"
```
**Expected:** Only wheat listings

### 3.3 Search with Location Filter
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search?location=Delhi&radiusKm=50"
```
**Expected:** Listings within 50km of Delhi

### 3.4 Search with Price Range
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search?minPrice=1500&maxPrice=2500"
```
**Expected:** Listings in price range

### 3.5 Search with Quality Filter
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search?qualityTier=premium"
```
**Expected:** Only premium quality listings

### 3.6 Search with Sorting
**API Test:**
```bash
curl "http://localhost:5000/api/listings/search?sortBy=price&sortOrder=asc"
```
**Expected:** Listings sorted by price (low to high)

**Browser Test:**
1. Navigate to "Browse Listings"
2. Test search bar with crop names
3. Apply filters (location, price, quality)
4. Test sorting options
5. Verify results update in real-time
6. Test "no results" message

---

## 4. Pricing & Quality

### 4.1 Get Price Breakdown
**API Test:**
```bash
curl "http://localhost:5000/api/prices/breakdown?basePrice=2000&qualityTier=premium&cropType=wheat"
```
**Expected:** Price breakdown with components

### 4.2 Get Current Market Price
**API Test:**
```bash
curl "http://localhost:5000/api/prices/current?cropType=wheat&location=Delhi"
```
**Expected:** Current market price from eNAM

### 4.3 Calculate Final Price
**API Test:**
```bash
curl "http://localhost:5000/api/prices/calculate" \
  -H "Content-Type: application/json" \
  -d '{"basePrice":2000,"qualityTier":"premium","cropType":"wheat"}'
```
**Expected:** Calculated final price

**Browser Test:**
1. Create listing and observe price calculation
2. Verify price breakdown is displayed
3. Change quality tier and see price update
4. Compare with eNAM prices shown

---

## 5. Negotiation Engine

### 5.1 Create Negotiation
**API Test:**
```bash
curl -X POST http://localhost:5000/api/negotiations \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId":1,
    "buyerId":2,
    "initialOffer":1800
  }'
```
**Expected:** Created negotiation with AI counter-offer suggestion

### 5.2 Get Negotiation Details
**API Test:**
```bash
curl http://localhost:5000/api/negotiations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Negotiation details with offer history

### 5.3 Submit Counter Offer
**API Test:**
```bash
curl -X POST http://localhost:5000/api/negotiations/1/counter \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"counterOffer":1950,"message":"Best price I can offer"}'
```
**Expected:** Updated negotiation

### 5.4 Accept Offer
**API Test:**
```bash
curl -X POST http://localhost:5000/api/negotiations/1/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Transaction created, negotiation finalized

### 5.5 Reject Offer
**API Test:**
```bash
curl -X POST http://localhost:5000/api/negotiations/1/reject \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Price too high"}'
```
**Expected:** Negotiation rejected

### 5.6 Get Buyer Negotiations
**API Test:**
```bash
curl http://localhost:5000/api/negotiations/buyer/2 \
  -H "Authorization: Bearer BUYER_TOKEN"
```
**Expected:** Array of buyer's negotiations

### 5.7 Get Vendor Negotiations
**API Test:**
```bash
curl http://localhost:5000/api/negotiations/vendor/1 \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Array of vendor's negotiations

**Browser Test:**
1. Login as buyer
2. Browse listings and click "Make Offer"
3. Enter offer amount
4. Submit and verify negotiation created
5. Login as vendor
6. View negotiation and see AI suggestion
7. Submit counter-offer
8. Login as buyer and accept/reject
9. Verify transaction created on acceptance

---

## 6. Trust & Rating System

### 6.1 Submit Rating
**API Test:**
```bash
curl -X POST http://localhost:5000/api/ratings \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId":1,
    "vendorId":1,
    "deliveryRating":5,
    "qualityRating":4,
    "comment":"Good quality wheat"
  }'
```
**Expected:** Rating submitted, trust score updated

### 6.2 Get Vendor Reputation
**API Test:**
```bash
curl http://localhost:5000/api/vendors/1/reputation
```
**Expected:** Trust score, badges, rating breakdown

### 6.3 Get Vendor Ratings
**API Test:**
```bash
curl http://localhost:5000/api/vendors/1/ratings
```
**Expected:** Array of ratings with comments

**Browser Test:**
1. Complete a transaction
2. Submit rating after delivery
3. View vendor profile
4. Verify trust score displayed
5. Check badges (Trusted Vendor, etc.)
6. View rating breakdown

---

## 7. Messaging

### 7.1 Send Message
**API Test:**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId":2,
    "listingId":1,
    "content":"Is this still available?"
  }'
```
**Expected:** Message sent

### 7.2 Get Message Thread
**API Test:**
```bash
curl "http://localhost:5000/api/messages/thread/1/2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of messages between users

### 7.3 Mark Message as Read
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/messages/1/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Message marked as read

### 7.4 Get Unread Count
**API Test:**
```bash
curl http://localhost:5000/api/messages/unread \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Count of unread messages

**Browser Test:**
1. Login and navigate to Messages
2. Select a conversation
3. Send text message
4. Upload image (if supported)
5. Verify real-time delivery
6. Check read receipts
7. Test with different language users (translation)

---

## 8. Transactions

### 8.1 Get Transaction Details
**API Test:**
```bash
curl http://localhost:5000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Transaction details

### 8.2 Vendor Confirms Transaction
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/transactions/1/confirm \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Status updated to "confirmed"

### 8.3 Mark as Shipped
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/transactions/1/ship \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trackingNumber":"TRACK123"}'
```
**Expected:** Status updated to "in_transit"

### 8.4 Confirm Delivery
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/transactions/1/deliver \
  -H "Authorization: Bearer BUYER_TOKEN"
```
**Expected:** Status updated to "delivered", rating prompt triggered

### 8.5 Get Buyer Transactions
**API Test:**
```bash
curl http://localhost:5000/api/transactions/buyer/2 \
  -H "Authorization: Bearer BUYER_TOKEN"
```
**Expected:** Array of buyer's transactions

### 8.6 Get Vendor Transactions
**API Test:**
```bash
curl http://localhost:5000/api/transactions/vendor/1 \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Array of vendor's transactions

### 8.7 Export Transactions (CSV)
**API Test:**
```bash
curl "http://localhost:5000/api/transactions/export?vendorId=1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** CSV file download

**Browser Test:**
1. View transaction list
2. Click on transaction to see details
3. Test status updates (confirm, ship, deliver)
4. Verify status timeline display
5. Test filtering by status/date
6. Export to CSV and verify data

---

## 9. Voice Interface (Kisaan Bot)

### 9.1 Parse Voice Intent
**API Test:**
```bash
curl -X POST http://localhost:5000/api/voice/parse-intent \
  -H "Content-Type: application/json" \
  -d '{
    "text":"What is the price of wheat in Delhi?",
    "language":"en"
  }'
```
**Expected:** Intent detected with parameters

### 9.2 Voice Query (Full Pipeline)
**API Test:**
```bash
# This requires audio file - use test script
node test/test-voice-complete.js
```
**Expected:** Audio transcribed, intent parsed, action executed

### 9.3 Text-to-Speech
**API Test:**
```bash
curl -X POST http://localhost:5000/api/voice/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text":"The price of wheat is 2000 rupees per quintal",
    "language":"hi"
  }'
```
**Expected:** Audio file (base64)

**Browser Test:**
1. Open Kisaan Bot (microphone icon)
2. Click microphone and speak query
3. Verify transcription displayed
4. Check intent detection
5. Confirm action before execution
6. Verify audio response plays
7. Test in multiple languages (Hindi, Tamil, etc.)

---

## 10. eNAM Integration

### 10.1 Get eNAM Prices
**API Test:**
```bash
curl "http://localhost:5000/api/integration/enam/prices?cropType=wheat&state=Delhi"
```
**Expected:** eNAM price data (or mock data)

### 10.2 Get ODOP Products
**API Test:**
```bash
curl "http://localhost:5000/api/integration/odop?state=UP"
```
**Expected:** ODOP registered products

### 10.3 Get GeM Guide
**API Test:**
```bash
curl "http://localhost:5000/api/integration/gem/guide?language=hi"
```
**Expected:** GeM documentation in Hindi

**Browser Test:**
1. View listing detail page
2. Check eNAM price comparison
3. Verify ODOP badge (if applicable)
4. Navigate to GeM Guide page
5. Test language switching

---

## 11. Vendor Discovery & Collaboration

### 11.1 Find Nearby Vendors
**API Test:**
```bash
curl "http://localhost:5000/api/discovery/nearby?cropType=wheat&latitude=28.6139&longitude=77.2090&radiusKm=50"
```
**Expected:** Array of nearby vendors

### 11.2 Get Aggregation Opportunities
**API Test:**
```bash
curl "http://localhost:5000/api/discovery/aggregation/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Suggested vendors for collaboration

### 11.3 Create Aggregated Listing
**API Test:**
```bash
curl -X POST http://localhost:5000/api/discovery/aggregate \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingIds":[1,2,3],
    "totalQuantity":300
  }'
```
**Expected:** Combined listing created

**Browser Test:**
1. Login as vendor
2. View nearby vendors on map
3. Check aggregation suggestions
4. Create aggregated listing
5. Verify payment distribution

---

## 12. Advisory & Analytics

### 12.1 Get Market Insights
**API Test:**
```bash
curl "http://localhost:5000/api/advisory/insights/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Market insights and recommendations

### 12.2 Get Weekly Report
**API Test:**
```bash
curl "http://localhost:5000/api/advisory/weekly/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Weekly sales summary

### 12.3 Get Seasonal Guidance
**API Test:**
```bash
curl "http://localhost:5000/api/advisory/seasonal/wheat"
```
**Expected:** Planting/harvest windows

### 12.4 Get Dashboard Analytics
**API Test:**
```bash
curl "http://localhost:5000/api/analytics/dashboard/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Dashboard metrics (sales, listings, etc.)

### 12.5 Get Pricing Analytics
**API Test:**
```bash
curl "http://localhost:5000/api/analytics/pricing/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Price comparison, regional averages

### 12.6 Get Negotiation Analytics
**API Test:**
```bash
curl "http://localhost:5000/api/analytics/negotiations/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Success rates, average discounts

**Browser Test:**
1. Login as vendor
2. Navigate to Analytics page
3. Verify dashboard metrics display
4. Check sales trends chart
5. View pricing analytics
6. Check negotiation statistics
7. Test date range filters

---

## 13. Favorites & Saved Searches

### 13.1 Add to Favorites
**API Test:**
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listingId":1}'
```
**Expected:** Listing added to favorites

### 13.2 Get Favorites
**API Test:**
```bash
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of favorited listings

### 13.3 Remove from Favorites
**API Test:**
```bash
curl -X DELETE http://localhost:5000/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Listing removed from favorites

### 13.4 Save Search
**API Test:**
```bash
curl -X POST http://localhost:5000/api/saved-searches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Premium Wheat in Delhi",
    "criteria":{
      "cropType":"wheat",
      "qualityTier":"premium",
      "location":"Delhi"
    }
  }'
```
**Expected:** Search saved

### 13.5 Get Saved Searches
**API Test:**
```bash
curl http://localhost:5000/api/saved-searches \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of saved searches

### 13.6 Execute Saved Search
**API Test:**
```bash
curl "http://localhost:5000/api/saved-searches/1/execute" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Search results

### 13.7 Delete Saved Search
**API Test:**
```bash
curl -X DELETE http://localhost:5000/api/saved-searches/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Search deleted

**Browser Test:**
1. Browse listings and click "Save" icon
2. Navigate to Favorites page
3. Verify saved listings display
4. Remove from favorites
5. Perform search with filters
6. Click "Save Search"
7. Navigate to Saved Searches
8. Execute saved search
9. Edit/delete saved searches

---

## 14. Price Alerts

### 14.1 Create Price Alert
**API Test:**
```bash
curl -X POST http://localhost:5000/api/price-alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType":"wheat",
    "targetPrice":1800,
    "condition":"below",
    "location":"Delhi"
  }'
```
**Expected:** Alert created

### 14.2 Get Price Alerts
**API Test:**
```bash
curl http://localhost:5000/api/price-alerts \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of active alerts

### 14.3 Update Price Alert
**API Test:**
```bash
curl -X PUT http://localhost:5000/api/price-alerts/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetPrice":1750}'
```
**Expected:** Alert updated

### 14.4 Delete Price Alert
**API Test:**
```bash
curl -X DELETE http://localhost:5000/api/price-alerts/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Alert deleted

**Browser Test:**
1. Navigate to Price Alerts page
2. Create new alert with crop and target price
3. Verify alert appears in list
4. Edit alert threshold
5. Delete alert
6. Check notification when price condition met

---

## 15. Social Features (Share, QR)

### 15.1 Generate Share Link
**API Test:**
```bash
curl -X POST http://localhost:5000/api/share/listing/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Shareable link generated

### 15.2 Get Share Analytics
**API Test:**
```bash
curl "http://localhost:5000/api/share/analytics/1" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```
**Expected:** Share count, views

### 15.3 Generate QR Code
**API Test:**
```bash
curl "http://localhost:5000/api/listings/1/qr"
```
**Expected:** QR code image (base64)

**Browser Test:**
1. View listing detail page
2. Click "Share" button
3. Test WhatsApp share
4. Test SMS share
5. View QR code
6. Download QR code
7. Scan QR code with mobile
8. Verify listing opens

---

## 16. Dark Mode & Accessibility

### 16.1 Toggle Dark Mode
**Browser Test:**
1. Click theme toggle in header
2. Verify dark theme applied
3. Check all pages render correctly
4. Verify theme persists on reload
5. Test auto dark mode (time-based)

### 16.2 Accessibility Features
**Browser Test:**
1. Test keyboard navigation
2. Test screen reader compatibility
3. Check color contrast ratios
4. Test font size adjustment
5. Verify ARIA labels present

---

## 17. PWA & Offline Features

### 17.1 Install PWA
**Browser Test:**
1. Open app in Chrome/Edge
2. Check "Install" prompt appears
3. Install app
4. Verify app opens standalone
5. Check app icon on home screen

### 17.2 Offline Functionality
**Browser Test:**
1. Load app while online
2. Disconnect internet
3. Navigate between pages
4. Verify cached content displays
5. Try to create listing (should queue)
6. Reconnect internet
7. Verify queued actions sync

### 17.3 Service Worker
**Browser Test:**
1. Open DevTools → Application → Service Workers
2. Verify service worker registered
3. Check cache storage
4. Test update on reload

---

## 18. Multilingual Support

### 18.1 Language Switching
**Browser Test:**
1. Click language selector
2. Switch to Hindi
3. Verify all UI text translates
4. Switch to Tamil
5. Verify translations
6. Test all 6 languages (en, hi, mr, ta, te, kn)

### 18.2 Voice in Multiple Languages
**Browser Test:**
1. Set language to Hindi
2. Use Kisaan Bot
3. Speak in Hindi
4. Verify transcription correct
5. Check response in Hindi
6. Repeat for other languages

### 18.3 Message Translation
**Browser Test:**
1. User A (Hindi) sends message
2. User B (Tamil) receives
3. Verify message auto-translated
4. Check original text available

---

## Automated Test Script

### Run All API Tests
```bash
node .kiro/specs/multilingual-mandi/run-all-tests.js
```

### Run Specific Feature Tests
```bash
# Authentication tests
node .kiro/specs/multilingual-mandi/run-all-tests.js --feature=auth

# Listing tests
node .kiro/specs/multilingual-mandi/run-all-tests.js --feature=listings

# Voice tests
node .kiro/specs/multilingual-mandi/run-all-tests.js --feature=voice
```

---

## Test Results Format

### Success Criteria
- ✅ All API endpoints return 200/201 status
- ✅ Response data matches expected schema
- ✅ Database updates correctly
- ✅ Logs show no errors
- ✅ Frontend displays data correctly

### Failure Investigation
1. Check backend logs: `backend/logs/error.log`
2. Check request logs: `backend/logs/requests.log`
3. Check browser console for errors
4. Verify database state
5. Check network tab in DevTools

---

## Continuous Testing

### Pre-Deployment Checklist
- [ ] All API tests pass
- [ ] All browser tests pass
- [ ] No console errors
- [ ] No broken links
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] Offline mode works
- [ ] All languages work
- [ ] Voice interface works
- [ ] Performance acceptable (<3s load)

### Performance Benchmarks
- API response time: <250ms
- Page load time: <3s
- Time to interactive: <5s
- Lighthouse score: >90

---

## Test Data Management

### Seed Database
```bash
cd backend
npm run seed
```

### Reset Database
```bash
cd backend
rm mandi.db
npm run seed
```

### Create Test Users
```bash
node backend/src/utils/create-test-users.js
```

---

## Logging Configuration

### Enable Detailed Logs
Add to `backend/.env`:
```
LOG_LEVEL=debug
LOG_API_REQUESTS=true
LOG_DATABASE_QUERIES=true
```

### View Logs
```bash
# Error logs
tail -f backend/logs/error.log

# Request logs
tail -f backend/logs/requests.log

# All logs
tail -f backend/logs/*.log
```

---

## Test Coverage Report

### Generate Coverage
```bash
cd backend
npm run test:coverage
```

### View Coverage
Open `backend/coverage/lcov-report/index.html` in browser

---

## End-to-End Test Scenarios

### Scenario 1: Complete Vendor Journey
1. Vendor registers with phone
2. Creates listing with image
3. Receives negotiation offer
4. Counters with AI suggestion
5. Accepts final offer
6. Confirms transaction
7. Ships product
8. Receives rating
9. Views analytics

### Scenario 2: Complete Buyer Journey
1. Buyer registers
2. Searches for crop
3. Filters by location/price
4. Saves favorite listings
5. Makes offer on listing
6. Negotiates price
7. Accepts counter-offer
8. Confirms delivery
9. Submits rating

### Scenario 3: Voice-First Journey
1. User opens Kisaan Bot
2. Asks "wheat price in Delhi" (Hindi)
3. Gets audio response
4. Asks "create listing" (Hindi)
5. Provides details via voice
6. Confirms and creates listing
7. All in local language

---

**END OF TESTING GUIDE**
