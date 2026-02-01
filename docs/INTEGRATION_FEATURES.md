# Integration Features Documentation

## Overview

This document describes the integration features implemented for eNAM, ODOP, and GeM platforms in the Multilingual Mandi system.

## Features Implemented

### 1. ODOP (One District One Product) Badge Display

**Purpose**: Highlight products registered under the government's ODOP scheme to attract more buyers and provide recognition to farmers.

**Implementation**:
- **Backend Service**: `IntegrationService.identifyODOPProduct(cropType, district)`
- **API Endpoint**: `GET /api/integration/odop/check?cropType=onion&district=Nashik`
- **Frontend Display**: 
  - ODOP badges shown on listing cards in BrowseListings page
  - Detailed ODOP information on ListingDetail page
  - Multilingual support for badge text (6 languages)

**ODOP Registry** (Sample):
- Nashik: onion, grapes
- Ludhiana: wheat
- Amritsar: rice
- Coimbatore: cotton
- Mysore: sugarcane
- And 20+ more district-crop combinations

**Badge Features**:
- 🏆 Icon with orange color scheme
- Multilingual display name
- District-specific description
- Automatic detection based on listing location

### 2. GeM (Government e-Marketplace) Registration Guide

**Purpose**: Help farmers register on GeM platform to access government procurement opportunities.

**Implementation**:
- **Backend Service**: `IntegrationService.getGeMDocumentationGuide(language)`
- **API Endpoint**: `GET /api/integration/gem/guide?language=hi`
- **Frontend Page**: `/gem-guide` - Full step-by-step registration guide

**Guide Features**:
- 10-step registration process
- Multilingual support (English, Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)
- Document checklist
- Helpful tips
- Helpline number: 1800-419-3436
- Website link: https://gem.gov.in

**Guide Sections**:
1. Prepare Required Documents
2. Visit GeM Portal
3. Choose Seller Registration
4. Fill Basic Details
5. Verify Mobile and Email
6. Upload Documents
7. Add Product Catalog
8. Submit for Verification
9. Complete Training
10. Start Selling

### 3. eNAM Data Sync (Opt-in)

**Purpose**: Allow farmers to share their transaction data with eNAM for better market transparency and price insights.

**Implementation**:
- **Backend Service**: `IntegrationService.syncTransactionToENAM(transactionId, userId)`
- **API Endpoints**:
  - `POST /api/integration/enam/sync` - Sync a transaction
  - `PUT /api/integration/enam/preference` - Enable/disable sync
  - `GET /api/integration/enam/status` - Check sync status
- **Frontend UI**: Settings page with toggle switch

**Sync Features**:
- Opt-in only (user must enable)
- Per-transaction sync
- Includes: crop type, quantity, price, quality tier, location, date
- Mock implementation (ready for real eNAM API integration)
- User preference stored in database

**Data Synced**:
```json
{
  "transactionId": "...",
  "cropType": "wheat",
  "quantity": 100,
  "price": 2500,
  "qualityTier": "premium",
  "vendorLocation": "Ludhiana",
  "transactionDate": "2024-01-15",
  "status": "delivered"
}
```

## API Endpoints

### ODOP Endpoints

#### Check ODOP Status
```bash
GET /api/integration/odop/check?cropType=onion&district=Nashik

Response:
{
  "success": true,
  "isODOP": true,
  "badge": {
    "name": "ODOP",
    "displayName": { "en": "One District One Product", ... },
    "description": { "en": "This product is registered...", ... },
    "district": "Nashik",
    "cropType": "onion"
  }
}
```

#### Get ODOP Districts for Crop
```bash
GET /api/integration/odop/districts?cropType=wheat

Response:
{
  "success": true,
  "cropType": "wheat",
  "districts": ["Ludhiana", "Meerut"],
  "count": 2
}
```

### GeM Endpoints

#### Get GeM Registration Guide
```bash
GET /api/integration/gem/guide?language=hi

Response:
{
  "success": true,
  "guide": {
    "title": "किसानों के लिए GeM पंजीकरण गाइड",
    "description": "...",
    "estimatedTime": "30-45 मिनट",
    "steps": [...],
    "requiredDocuments": [...],
    "tips": [...],
    "helplineNumber": "1800-419-3436",
    "websiteUrl": "https://gem.gov.in"
  }
}
```

### eNAM Endpoints

#### Sync Transaction to eNAM
```bash
POST /api/integration/enam/sync
Authorization: Bearer <token>
Body: { "transactionId": "..." }

Response:
{
  "success": true,
  "message": "Transaction data synced to eNAM successfully",
  "synced": true,
  "syncedAt": "2024-01-15T10:30:00Z",
  "enamReferenceId": "ENAM-1234567890-abc123"
}
```

#### Update eNAM Sync Preference
```bash
PUT /api/integration/enam/preference
Authorization: Bearer <token>
Body: { "enabled": true }

Response:
{
  "success": true,
  "message": "eNAM data sync enabled successfully",
  "enamDataSync": true
}
```

#### Get eNAM Sync Status
```bash
GET /api/integration/enam/status
Authorization: Bearer <token>

Response:
{
  "success": true,
  "enamDataSync": false
}
```

## Frontend Components

### 1. BrowseListings Page
- Displays ODOP badges on listing cards
- Shows ODOP description below crop name
- Automatic badge loading for all listings

### 2. ListingDetail Page
- Prominent ODOP badge on product image
- Detailed ODOP information card
- Multilingual badge display

### 3. GeMGuide Page
- Full registration guide
- Step-by-step instructions
- Document checklist
- Helpful tips
- Contact information

### 4. Settings Page
- eNAM sync toggle switch
- Profile settings
- Language preferences
- Links to government platforms

## User Flow

### ODOP Badge Display Flow
1. User browses listings
2. System checks each listing's crop type and district
3. If match found in ODOP registry, badge is displayed
4. User sees 🏆 ODOP badge on listing card
5. Clicking listing shows detailed ODOP information

### GeM Registration Flow
1. User navigates to Settings page
2. Clicks "GeM Registration Guide" button
3. Redirected to `/gem-guide` page
4. Views step-by-step guide in their language
5. Can call helpline or visit GeM website

### eNAM Sync Flow
1. User navigates to Settings page
2. Sees eNAM Integration section
3. Toggles "Enable eNAM Data Sync" switch
4. Preference saved to database
5. Future transactions automatically synced (if enabled)

## Testing

### Manual Testing

#### Test ODOP Badge
1. Create listing with crop="onion" and district="Nashik"
2. Browse listings - should see ODOP badge
3. Click listing - should see detailed ODOP info
4. Change language - badge text should translate

#### Test GeM Guide
1. Navigate to Settings
2. Click "GeM Registration Guide"
3. Verify all 10 steps are displayed
4. Change language - guide should translate
5. Verify helpline and website links work

#### Test eNAM Sync
1. Navigate to Settings
2. Toggle eNAM sync switch
3. Verify success message
4. Refresh page - toggle should maintain state
5. Create transaction - should sync if enabled

### Automated Testing

Run integration service tests:
```bash
node backend/test-integration-service.js
```

Expected output:
- ✅ All ODOP badge checks pass
- ✅ Badge info generated correctly
- ✅ GeM guides available in all languages
- ✅ ODOP districts correctly mapped

## Database Schema

### User Model Addition
```javascript
enamDataSync: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
}
```

## Multilingual Support

All integration features support 6 languages:
- English (en)
- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Punjabi (pa)

## Future Enhancements

1. **Real eNAM API Integration**
   - Replace mock sync with actual eNAM API calls
   - Implement OAuth authentication
   - Handle API rate limits

2. **ODOP Registry Updates**
   - Fetch ODOP registry from government API
   - Auto-update district-crop mappings
   - Add more districts and products

3. **GeM Integration**
   - Direct GeM registration from platform
   - Auto-fill GeM forms with user data
   - Track GeM registration status

4. **Analytics**
   - Track ODOP badge click-through rates
   - Monitor GeM guide usage
   - Analyze eNAM sync adoption

## Requirements Validated

✅ **Requirement 9.4**: ODOP badge display for registered products
✅ **Requirement 9.5**: GeM documentation support
✅ **Requirement 9.6**: Local language guidance for GeM
✅ **Requirement 9.7**: Opt-in eNAM data sync

## Conclusion

All integration features are fully implemented and tested. The platform now provides:
- Automatic ODOP badge display with multilingual support
- Comprehensive GeM registration guide in 6 languages
- Opt-in eNAM data sync with user control
- Seamless integration with government platforms

This enhances the platform's value proposition by connecting farmers with government initiatives and improving market transparency.
