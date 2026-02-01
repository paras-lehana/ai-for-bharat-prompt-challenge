# Multilingual Mandi API - Quick Reference

## Base URLs

- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.multilingualmandi.com/api`

## Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

### Get Token
1. `POST /auth/send-otp` - Send OTP to phone
2. `POST /auth/verify-otp` - Verify OTP, receive token

---

## Quick Endpoint Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/send-otp` | No | Send OTP to phone number |
| POST | `/auth/verify-otp` | No | Verify OTP and get JWT token |
| GET | `/auth/me` | Yes | Get current user profile |
| PUT | `/auth/profile` | Yes | Update user profile |

### Listings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/listings/search` | No | Search listings with filters |
| GET | `/listings/:id` | No | Get single listing details |
| POST | `/listings` | Yes (Vendor) | Create new listing |
| PUT | `/listings/:id` | Yes (Owner) | Update listing |
| DELETE | `/listings/:id` | Yes (Owner) | Delete listing |

### Negotiations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/negotiations` | Yes | Create negotiation |
| GET | `/negotiations/:id` | Yes | Get negotiation details |
| POST | `/negotiations/:id/counter` | Yes | Submit counter-offer |
| POST | `/negotiations/:id/accept` | Yes | Accept offer |
| POST | `/negotiations/:id/reject` | Yes | Reject/withdraw |
| GET | `/negotiations/my/all` | Yes | Get my negotiations |
| GET | `/negotiations/:id/suggestion` | Yes | Get AI suggestion |

### Transactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/transactions/:id` | Yes | Get transaction details |
| PUT | `/transactions/:id/confirm` | Yes (Vendor) | Confirm transaction |
| PUT | `/transactions/:id/ship` | Yes (Vendor) | Mark as shipped |
| PUT | `/transactions/:id/deliver` | Yes (Buyer) | Confirm delivery |
| GET | `/transactions/buyer/:buyerId` | Yes | Get buyer transactions |
| GET | `/transactions/vendor/:vendorId` | Yes | Get vendor transactions |

### Voice Interface
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/voice/query` | No | Process complete voice query |
| POST | `/voice/transcribe` | No | Transcribe audio to text |
| POST | `/voice/parse-intent` | No | Extract intent from text |
| POST | `/voice/synthesize` | No | Convert text to speech |
| POST | `/voice/translate` | No | Translate text |

### Messaging
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/messages` | Yes | Send message |
| GET | `/messages/thread/:userId/:recipientId` | Yes | Get message thread |
| PUT | `/messages/:id/read` | Yes | Mark as read |

### Trust & Ratings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ratings` | Yes | Submit rating |
| GET | `/ratings/vendor/:vendorId` | No | Get vendor ratings |
| GET | `/ratings/trust-score/:vendorId` | No | Get trust score |

### Disputes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/disputes` | Yes | Create dispute |
| POST | `/disputes/:id/evidence` | Yes | Submit evidence |
| GET | `/disputes/:id` | Yes | Get dispute details |

### Discovery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/discovery/nearby` | No | Find nearby vendors |
| GET | `/discovery/aggregation/:listingId` | No | Get aggregation suggestions |

### Vendors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/vendors/nearby` | No | Get nearby vendors |
| GET | `/vendors/:id` | No | Get vendor profile |
| GET | `/vendors/:id/listings` | No | Get vendor listings |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/dashboard/:vendorId` | Yes | Get dashboard metrics |
| GET | `/analytics/pricing/:vendorId` | Yes | Get pricing analytics |
| GET | `/analytics/negotiations/:vendorId` | Yes | Get negotiation analytics |

### Advisory
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/advisory/insights/:vendorId` | Yes | Get market insights |
| GET | `/advisory/weekly/:vendorId` | Yes | Get weekly report |
| GET | `/advisory/seasonal/:cropType` | No | Get seasonal guidance |

### Pricing
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/prices/current` | No | Get eNAM prices |
| POST | `/prices/calculate` | No | Calculate pricing |
| POST | `/prices/validate-offer` | No | Validate offer price |

### Integration
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/integration/odop/check` | No | Check ODOP status |
| GET | `/integration/odop/districts` | No | Get ODOP districts |
| GET | `/integration/gem/guide` | No | Get GeM guide |
| POST | `/integration/enam/sync` | Yes | Sync to eNAM |
| PUT | `/integration/enam/preference` | Yes | Update eNAM preference |
| GET | `/integration/enam/status` | Yes | Get eNAM sync status |

### Favorites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites` | Yes | Get all favorites |
| POST | `/favorites` | Yes | Add to favorites |
| GET | `/favorites/check/:listingId` | Yes | Check if favorited |
| DELETE | `/favorites/:listingId` | Yes | Remove from favorites |
| PATCH | `/favorites/:listingId` | Yes | Update favorite settings |

### Saved Searches
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/saved-searches` | Yes | Get all saved searches |
| POST | `/saved-searches` | Yes | Create saved search |
| GET | `/saved-searches/:id/execute` | Yes | Execute saved search |
| DELETE | `/saved-searches/:id` | Yes | Delete saved search |

### Sharing
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/share/qr/:listingId` | No | Generate QR code |
| POST | `/share/track` | No | Track share analytics |

---

## Common Query Parameters

### Search/Filter Parameters
- `cropType` - Filter by crop (e.g., "tomato", "wheat")
- `qualityTier` - Filter by quality (premium, standard, basic)
- `minPrice` / `maxPrice` - Price range filter
- `lat` / `lng` - Location coordinates
- `radius` - Search radius in km (default: 50)
- `sortBy` - Sort order (relevance, price, distance, trust_score)

### Language Parameters
- `languageCode` - ISO 639-1 code (en, hi, mr, ta, te, kn, pa)
- `targetLanguage` - Target language for translation

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |

---

## Example Workflows

### 1. User Registration & Login
```
1. POST /auth/send-otp
   Body: { "phoneNumber": "+919876543210" }

2. POST /auth/verify-otp
   Body: { 
     "phoneNumber": "+919876543210",
     "otp": "123456",
     "role": "vendor",
     "languagePreference": "hi"
   }
   Response: { "token": "jwt_token_here", "user": {...} }

3. Save token for subsequent requests
```

### 2. Create Listing (Vendor)
```
POST /listings
Headers: Authorization: Bearer <token>
Body: {
  "cropType": "tomato",
  "quantity": 100,
  "unit": "kg",
  "basePrice": 25.00,
  "qualityTier": "premium",
  "location": {
    "latitude": 19.9975,
    "longitude": 73.7898,
    "address": "Nashik, Maharashtra"
  }
}
```

### 3. Search & Negotiate (Buyer)
```
1. GET /listings/search?cropType=tomato&qualityTier=premium

2. POST /negotiations
   Body: {
     "listingId": "listing-uuid",
     "initialOfferPrice": 28.00,
     "message": "Can you accept ₹28 per kg?"
   }

3. POST /negotiations/:id/counter
   Body: {
     "counterPrice": 30.00,
     "message": "I can meet you at ₹30"
   }

4. POST /negotiations/:id/accept
```

### 4. Voice Query
```
POST /voice/query
Body: {
  "audioBase64": "base64_encoded_audio",
  "languageCode": "hi"
}
Response: {
  "text": "आज दिल्ली मंडी में टमाटर ₹25-35/kg चल रहा है।",
  "audio": "base64_response_audio",
  "analysis": {
    "intent": "price_query",
    "cropType": "tomato",
    "location": "Delhi"
  }
}
```

---

## Rate Limits

- **Auth endpoints**: 5 req/min per IP
- **General endpoints**: 100 req/min per user
- **Voice processing**: 20 req/min per user
- **Messaging**: 10 msg/hour for new users

---

## Supported Languages

| Code | Language |
|------|----------|
| en | English |
| hi | Hindi (हिंदी) |
| mr | Marathi (मराठी) |
| ta | Tamil (தமிழ்) |
| te | Telugu (తెలుగు) |
| kn | Kannada (ಕನ್ನಡ) |
| pa | Punjabi (ਪੰਜਾਬੀ) |

---

## Quality Tiers & Pricing

### Quality Multipliers
- **Premium**: 1.2 (20% markup)
- **Standard**: 1.0 (no markup)
- **Basic**: 0.85 (15% discount)

### Pricing Formula
```
Final Price = Base Price × Quality Multiplier × Demand Adjuster
```

Where:
- Base Price: Vendor's listed price or eNAM modal price
- Quality Multiplier: Based on quality tier
- Demand Adjuster: 0.8 - 1.3 (based on market conditions)

---

## Trust Score Calculation

```
Trust Score = 40% Delivery + 30% Quality + 20% Response + 10% Fair Pricing
```

### Badges
- **Trusted Vendor**: Score ≥ 4.5 with 20+ transactions
- **Verified Seller**: Score ≥ 4.0 with 50+ transactions

---

## Testing Tools

### Postman Collection
Import `docs/POSTMAN_COLLECTION.json` for ready-to-use API requests.

### OpenAPI Spec
View `docs/openapi.yaml` in Swagger Editor for interactive documentation.

### cURL Examples

**Send OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

**Search Listings:**
```bash
curl -X GET "http://localhost:5000/api/listings/search?cropType=tomato"
```

**Create Listing (with auth):**
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "tomato",
    "quantity": 100,
    "unit": "kg",
    "basePrice": 25.00,
    "qualityTier": "premium"
  }'
```

---

## Support

- **Full Documentation**: `docs/API_DOCUMENTATION.md`
- **Email**: api-support@multilingualmandi.com
- **GitHub**: https://github.com/multilingual-mandi

**Last Updated**: January 2024
