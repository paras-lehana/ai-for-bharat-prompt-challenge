# Multilingual Mandi API Documentation

## Overview

The Multilingual Mandi API provides a comprehensive RESTful interface for agricultural trading, enabling farmers to list products, negotiate prices, and complete transactions through voice-based interactions in local languages.

**Base URL (Development):** `http://localhost:5000/api`  
**Base URL (Production):** `https://api.multilingualmandi.com/api`

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Listings](#listings-endpoints)
   - [Negotiations](#negotiations-endpoints)
   - [Transactions](#transactions-endpoints)
   - [Voice Interface](#voice-interface-endpoints)
   - [Messaging](#messaging-endpoints)
   - [Trust & Ratings](#trust--ratings-endpoints)
   - [Disputes](#disputes-endpoints)
   - [Discovery](#discovery-endpoints)
   - [Vendors](#vendors-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Advisory](#advisory-endpoints)
   - [Pricing](#pricing-endpoints)
   - [Integration](#integration-endpoints)
   - [Favorites](#favorites-endpoints)
   - [Saved Searches](#saved-searches-endpoints)
   - [Sharing](#sharing-endpoints)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)

## Authentication

### Overview

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Authentication Flow

1. **Send OTP**: Request an OTP to be sent to a phone number
2. **Verify OTP**: Verify the OTP and receive a JWT token
3. **Use Token**: Include the token in subsequent requests

### Authorization Header Format

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

Tokens expire after 24 hours. When a token expires, you'll receive a 401 Unauthorized response and need to re-authenticate.

---

## API Endpoints


### Authentication Endpoints

#### 1. Send OTP

Send an OTP to a phone number for authentication.

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresAt": "2024-01-15T10:35:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid phone number format
- `429 Too Many Requests`: Rate limit exceeded

---

#### 2. Verify OTP

Verify the OTP and receive a JWT token.

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456",
  "role": "vendor",
  "languagePreference": "hi",
  "name": "Ramesh Kumar",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Delhi, India",
    "district": "New Delhi",
    "state": "Delhi"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "phoneNumber": "+919876543210",
    "role": "vendor",
    "languagePreference": "hi",
    "name": "Ramesh Kumar"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid OTP or phone number
- `401 Unauthorized`: OTP expired or incorrect
- `403 Forbidden`: Maximum retry attempts exceeded

---

#### 3. Get Current User

Get the authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "phoneNumber": "+919876543210",
  "role": "vendor",
  "languagePreference": "hi",
  "name": "Ramesh Kumar",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Delhi, India",
    "district": "New Delhi",
    "state": "Delhi"
  }
}
```

---

#### 4. Update Profile

Update the authenticated user's profile.

**Endpoint:** `PUT /api/auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Ramesh Kumar Singh",
  "languagePreference": "mr",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "address": "Mumbai, Maharashtra",
    "district": "Mumbai",
    "state": "Maharashtra"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "phoneNumber": "+919876543210",
    "role": "vendor",
    "languagePreference": "mr",
    "name": "Ramesh Kumar Singh"
  }
}
```

---


### Listings Endpoints

#### 1. Search Listings

Search for active product listings with filters.

**Endpoint:** `GET /api/listings/search`

**Query Parameters:**
- `cropType` (optional): Filter by crop type (e.g., "tomato", "wheat")
- `qualityTier` (optional): Filter by quality (premium, standard, basic)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `lat` (optional): Latitude for location-based search
- `lng` (optional): Longitude for location-based search
- `radius` (optional): Search radius in km (default: 50)
- `sortBy` (optional): Sort order (relevance, price, distance, trust_score)

**Example Request:**
```
GET /api/listings/search?cropType=tomato&qualityTier=premium&minPrice=20&maxPrice=50
```

**Response (200 OK):**
```json
{
  "listings": [
    {
      "id": "listing-uuid",
      "vendorId": "vendor-uuid",
      "cropType": "tomato",
      "quantity": 100,
      "unit": "kg",
      "basePrice": 25.00,
      "qualityTier": "premium",
      "qualityMultiplier": 1.2,
      "demandAdjuster": 1.1,
      "finalPrice": 33.00,
      "description": "Fresh organic tomatoes from Nashik",
      "images": ["/images/crops/tomato.jpg"],
      "locationAddress": "Nashik, Maharashtra",
      "locationDistrict": "Nashik",
      "status": "active",
      "odpBadge": {
        "district": "Nashik",
        "state": "Maharashtra",
        "description": "ODOP Registered Product"
      },
      "vendor": {
        "id": "vendor-uuid",
        "name": "Ramesh Kumar",
        "phoneNumber": "+919876543210"
      },
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 2. Get Single Listing

Get detailed information about a specific listing.

**Endpoint:** `GET /api/listings/:id`

**Response (200 OK):**
```json
{
  "id": "listing-uuid",
  "vendorId": "vendor-uuid",
  "cropType": "tomato",
  "quantity": 100,
  "unit": "kg",
  "basePrice": 25.00,
  "qualityTier": "premium",
  "finalPrice": 33.00,
  "description": "Fresh organic tomatoes",
  "images": ["/images/crops/tomato.jpg"],
  "locationAddress": "Nashik, Maharashtra",
  "status": "active",
  "vendor": {
    "id": "vendor-uuid",
    "name": "Ramesh Kumar",
    "phoneNumber": "+919876543210",
    "languagePreference": "mr"
  },
  "odpBadge": {
    "district": "Nashik",
    "state": "Maharashtra",
    "description": "ODOP Registered Product"
  }
}
```

**Error Responses:**
- `404 Not Found`: Listing does not exist

---

#### 3. Create Listing

Create a new product listing (vendors only).

**Endpoint:** `POST /api/listings`

**Authentication:** Required (Vendor role)

**Request Body:**
```json
{
  "cropType": "tomato",
  "quantity": 100,
  "unit": "kg",
  "basePrice": 25.00,
  "qualityTier": "premium",
  "description": "Fresh organic tomatoes from my farm",
  "images": ["/images/crops/tomato.jpg"],
  "location": {
    "latitude": 19.9975,
    "longitude": 73.7898,
    "address": "Nashik, Maharashtra"
  }
}
```

**Response (201 Created):**
```json
{
  "listing": {
    "id": "new-listing-uuid",
    "vendorId": "vendor-uuid",
    "cropType": "tomato",
    "quantity": 100,
    "unit": "kg",
    "basePrice": 25.00,
    "qualityTier": "premium",
    "qualityMultiplier": 1.2,
    "demandAdjuster": 1.1,
    "finalPrice": 33.00,
    "status": "active",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "pricingBreakdown": {
    "basePrice": 25.00,
    "qualityMultiplier": 1.2,
    "demandAdjuster": 1.1,
    "finalPrice": 33.00,
    "breakdown": "Base: ₹25.00 × Quality: 1.2 × Demand: 1.1 = ₹33.00",
    "formula": "Final Price = Base Price × Quality Multiplier × Demand Adjuster"
  },
  "aiGenerated": false
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a vendor

---

#### 4. Update Listing

Update an existing listing (owner only).

**Endpoint:** `PUT /api/listings/:id`

**Authentication:** Required (Vendor role, owner only)

**Request Body:**
```json
{
  "quantity": 80,
  "basePrice": 28.00,
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "id": "listing-uuid",
  "quantity": 80,
  "basePrice": 28.00,
  "finalPrice": 36.96,
  "status": "active",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
- `403 Forbidden`: Not the listing owner
- `404 Not Found`: Listing does not exist

---

#### 5. Delete Listing

Delete a listing (owner only).

**Endpoint:** `DELETE /api/listings/:id`

**Authentication:** Required (Vendor role, owner only)

**Response (200 OK):**
```json
{
  "message": "Listing deleted successfully"
}
```

---


### Negotiations Endpoints

#### 1. Create Negotiation

Initiate a price negotiation on a listing.

**Endpoint:** `POST /api/negotiations`

**Authentication:** Required

**Request Body:**
```json
{
  "listingId": "listing-uuid",
  "initialOfferPrice": 28.00,
  "message": "Can you accept ₹28 per kg?"
}
```

**Response (201 Created):**
```json
{
  "id": "negotiation-uuid",
  "listingId": "listing-uuid",
  "buyerId": "buyer-uuid",
  "vendorId": "vendor-uuid",
  "status": "active",
  "expiresAt": "2024-01-16T10:00:00.000Z",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

#### 2. Get Negotiation Details

Get full details of a negotiation including all offers.

**Endpoint:** `GET /api/negotiations/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "negotiation-uuid",
  "listingId": "listing-uuid",
  "buyerId": "buyer-uuid",
  "vendorId": "vendor-uuid",
  "status": "active",
  "expiresAt": "2024-01-16T10:00:00.000Z",
  "listing": {
    "id": "listing-uuid",
    "cropType": "tomato",
    "finalPrice": 33.00
  },
  "buyer": {
    "id": "buyer-uuid",
    "name": "Suresh Patil"
  },
  "vendor": {
    "id": "vendor-uuid",
    "name": "Ramesh Kumar"
  },
  "offers": [
    {
      "id": "offer-1-uuid",
      "userId": "buyer-uuid",
      "amount": 28.00,
      "reasoning": "Can you accept ₹28 per kg?",
      "offerType": "buyer_offer",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "offer-2-uuid",
      "userId": "vendor-uuid",
      "amount": 31.00,
      "reasoning": "I can offer ₹31 per kg considering quality",
      "offerType": "vendor_counter",
      "createdAt": "2024-01-15T10:15:00.000Z"
    }
  ]
}
```

---

#### 3. Submit Counter-Offer

Submit a counter-offer in an active negotiation.

**Endpoint:** `POST /api/negotiations/:id/counter`

**Authentication:** Required

**Request Body:**
```json
{
  "counterPrice": 30.00,
  "message": "I can meet you at ₹30 per kg"
}
```

**Response (200 OK):**
```json
{
  "message": "Counter-offer submitted",
  "aiSuggestion": {
    "amount": 31.50,
    "reasoning": "Based on market data, ₹31.50 is fair considering premium quality and current demand",
    "confidence": 0.85
  }
}
```

**Note:** AI suggestion is only provided to vendors.

---

#### 4. Accept Offer

Accept the current offer and create a transaction.

**Endpoint:** `POST /api/negotiations/:id/accept`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Offer accepted",
  "transaction": {
    "id": "transaction-uuid",
    "negotiationId": "negotiation-uuid",
    "listingId": "listing-uuid",
    "buyerId": "buyer-uuid",
    "vendorId": "vendor-uuid",
    "agreedPrice": 30.00,
    "quantity": 1,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 5. Reject/Withdraw Negotiation

Reject or withdraw from a negotiation.

**Endpoint:** `POST /api/negotiations/:id/reject`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Negotiation withdrawn/rejected successfully"
}
```

---

#### 6. Get My Negotiations

Get all negotiations for the authenticated user.

**Endpoint:** `GET /api/negotiations/my/all`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "negotiations": [
    {
      "id": "negotiation-uuid",
      "status": "active",
      "expiresAt": "2024-01-16T10:00:00.000Z",
      "listing": {
        "id": "listing-uuid",
        "cropType": "tomato",
        "finalPrice": 33.00,
        "images": ["/images/crops/tomato.jpg"]
      },
      "vendor": {
        "id": "vendor-uuid",
        "name": "Ramesh Kumar"
      },
      "lastOffer": 30.00,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### 7. Get AI Counter-Offer Suggestion

Get AI-powered counter-offer suggestion for a negotiation.

**Endpoint:** `GET /api/negotiations/:id/suggestion`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "suggestion": {
    "amount": 31.50,
    "reasoning": "Based on current market conditions and quality tier, ₹31.50 represents a fair price. The listing's premium quality justifies a 20% markup, and current demand is moderate.",
    "confidence": 0.85
  }
}
```

---


### Transactions Endpoints

#### 1. Get Transaction

Get details of a specific transaction.

**Endpoint:** `GET /api/transactions/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "transaction-uuid",
  "negotiationId": "negotiation-uuid",
  "listingId": "listing-uuid",
  "buyerId": "buyer-uuid",
  "vendorId": "vendor-uuid",
  "agreedPrice": 30.00,
  "quantity": 100,
  "status": "confirmed",
  "confirmedAt": "2024-01-15T11:00:00.000Z",
  "shippedAt": null,
  "deliveredAt": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Confirm Transaction

Vendor confirms the transaction.

**Endpoint:** `PUT /api/transactions/:id/confirm`

**Authentication:** Required (Vendor)

**Response (200 OK):**
```json
{
  "id": "transaction-uuid",
  "status": "confirmed",
  "confirmedAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### 3. Mark as Shipped

Vendor marks goods as shipped.

**Endpoint:** `PUT /api/transactions/:id/ship`

**Authentication:** Required (Vendor)

**Response (200 OK):**
```json
{
  "id": "transaction-uuid",
  "status": "in_transit",
  "shippedAt": "2024-01-15T12:00:00.000Z"
}
```

---

#### 4. Mark as Delivered

Buyer confirms delivery.

**Endpoint:** `PUT /api/transactions/:id/deliver`

**Authentication:** Required (Buyer)

**Response (200 OK):**
```json
{
  "id": "transaction-uuid",
  "status": "delivered",
  "deliveredAt": "2024-01-16T10:00:00.000Z"
}
```

---

#### 5. Get Buyer Transactions

Get all transactions for a buyer.

**Endpoint:** `GET /api/transactions/buyer/:buyerId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "id": "transaction-uuid",
      "listingId": "listing-uuid",
      "vendorId": "vendor-uuid",
      "agreedPrice": 30.00,
      "quantity": 100,
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 6. Get Vendor Transactions

Get all transactions for a vendor.

**Endpoint:** `GET /api/transactions/vendor/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "id": "transaction-uuid",
      "listingId": "listing-uuid",
      "buyerId": "buyer-uuid",
      "agreedPrice": 30.00,
      "quantity": 100,
      "status": "in_transit",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---


### Voice Interface Endpoints

#### 1. Process Voice Query

Process a complete voice query with transcription, intent extraction, and response generation.

**Endpoint:** `POST /api/voice/query`

**Request Body:**
```json
{
  "audioBase64": "base64-encoded-audio-data",
  "languageCode": "hi"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "text": "आज दिल्ली मंडी में टमाटर ₹25-35/kg चल रहा है।",
  "audio": "base64-encoded-audio-response",
  "languageCode": "hi",
  "transcribedText": "दिल्ली में टमाटर का भाव क्या है",
  "analysis": {
    "intent": "price_query",
    "cropType": "tomato",
    "location": "Delhi",
    "confidence": 0.92
  }
}
```

**Supported Language Codes:**
- `en` - English
- `hi` - Hindi
- `mr` - Marathi
- `ta` - Tamil
- `te` - Telugu
- `kn` - Kannada
- `pa` - Punjabi

---

#### 2. Transcribe Audio

Transcribe audio to text only.

**Endpoint:** `POST /api/voice/transcribe`

**Request Body:**
```json
{
  "audioBase64": "base64-encoded-audio-data",
  "languageCode": "hi"
}
```

**Response (200 OK):**
```json
{
  "text": "दिल्ली में टमाटर का भाव क्या है",
  "languageCode": "hi"
}
```

---

#### 3. Parse Intent

Extract intent and parameters from transcribed text.

**Endpoint:** `POST /api/voice/parse-intent`

**Request Body:**
```json
{
  "text": "दिल्ली में टमाटर का भाव क्या है",
  "languageCode": "hi"
}
```

**Response (200 OK):**
```json
{
  "intent": "price_query",
  "cropType": "tomato",
  "location": "Delhi",
  "confidence": 0.92,
  "parameters": {
    "crop": "tomato",
    "location": "Delhi"
  }
}
```

**Supported Intents:**
- `price_query` - Check crop prices
- `create_listing` - Create a new listing
- `make_offer` - Make an offer on a listing
- `search_listings` - Search for listings
- `general_help` - General assistance

---

#### 4. Synthesize Speech

Convert text to speech audio.

**Endpoint:** `POST /api/voice/synthesize`

**Request Body:**
```json
{
  "text": "आज दिल्ली मंडी में टमाटर ₹25-35/kg चल रहा है।",
  "languageCode": "hi"
}
```

**Response (200 OK):**
```json
{
  "audio": "base64-encoded-audio-data",
  "languageCode": "hi"
}
```

---

#### 5. Translate Text

Translate text to target language.

**Endpoint:** `POST /api/voice/translate`

**Request Body:**
```json
{
  "text": "What is the price of tomatoes in Delhi?",
  "targetLanguage": "hi"
}
```

**Response (200 OK):**
```json
{
  "translatedText": "दिल्ली में टमाटर की कीमत क्या है?",
  "targetLanguage": "hi"
}
```

---


### Messaging Endpoints

#### 1. Send Message

Send a message to another user.

**Endpoint:** `POST /api/messages`

**Authentication:** Required

**Request Body:**
```json
{
  "recipientId": "recipient-uuid",
  "textContent": "Hello, is this listing still available?",
  "listingId": "listing-uuid",
  "images": []
}
```

**Response (201 Created):**
```json
{
  "id": "message-uuid",
  "senderId": "sender-uuid",
  "recipientId": "recipient-uuid",
  "threadId": "thread-uuid",
  "listingId": "listing-uuid",
  "textContent": "Hello, is this listing still available?",
  "images": [],
  "originalLanguage": "en",
  "readAt": null,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

#### 2. Get Message Thread

Get all messages in a conversation thread.

**Endpoint:** `GET /api/messages/thread/:userId/:recipientId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "message-1-uuid",
      "senderId": "user-1-uuid",
      "recipientId": "user-2-uuid",
      "textContent": "Hello, is this listing still available?",
      "readAt": "2024-01-15T10:05:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "message-2-uuid",
      "senderId": "user-2-uuid",
      "recipientId": "user-1-uuid",
      "textContent": "Yes, it is available. Would you like to make an offer?",
      "readAt": null,
      "createdAt": "2024-01-15T10:10:00.000Z"
    }
  ]
}
```

---

#### 3. Mark Message as Read

Mark a message as read.

**Endpoint:** `PUT /api/messages/:id/read`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Message marked as read"
}
```

---

### Trust & Ratings Endpoints

#### 1. Submit Rating

Submit a rating for a completed transaction.

**Endpoint:** `POST /api/ratings`

**Authentication:** Required

**Request Body:**
```json
{
  "transactionId": "transaction-uuid",
  "vendorId": "vendor-uuid",
  "deliveryRating": 5,
  "qualityRating": 4,
  "comment": "Good quality tomatoes, delivered on time"
}
```

**Response (201 Created):**
```json
{
  "message": "Rating submitted successfully",
  "rating": {
    "id": "rating-uuid",
    "transactionId": "transaction-uuid",
    "buyerId": "buyer-uuid",
    "vendorId": "vendor-uuid",
    "deliveryRating": 5,
    "qualityRating": 4,
    "comment": "Good quality tomatoes, delivered on time",
    "createdAt": "2024-01-16T10:00:00.000Z"
  }
}
```

**Validation:**
- Ratings must be between 1 and 5
- Both deliveryRating and qualityRating are required

---

#### 2. Get Vendor Ratings

Get all ratings and reputation for a vendor.

**Endpoint:** `GET /api/ratings/vendor/:vendorId`

**Response (200 OK):**
```json
{
  "vendorId": "vendor-uuid",
  "trustScore": {
    "overall": 4.5,
    "delivery": 4.7,
    "quality": 4.5,
    "response": 4.3,
    "fairPricing": 4.4,
    "transactionCount": 25
  },
  "badges": ["Trusted Vendor"],
  "ratings": [
    {
      "id": "rating-uuid",
      "buyerId": "buyer-uuid",
      "deliveryRating": 5,
      "qualityRating": 4,
      "comment": "Good quality tomatoes",
      "createdAt": "2024-01-16T10:00:00.000Z"
    }
  ]
}
```

---

#### 3. Get Trust Score

Get calculated trust score for a vendor.

**Endpoint:** `GET /api/ratings/trust-score/:vendorId`

**Response (200 OK):**
```json
{
  "overall": 4.5,
  "delivery": 4.7,
  "quality": 4.5,
  "response": 4.3,
  "fairPricing": 4.4,
  "transactionCount": 25,
  "formula": "Trust Score = 40% delivery + 30% quality + 20% response + 10% fair pricing"
}
```

**Trust Score Calculation:**
- **Delivery (40%)**: Average delivery rating from buyers
- **Quality (30%)**: Average quality rating from buyers
- **Response (20%)**: Calculated from message response times
- **Fair Pricing (10%)**: Comparison of final prices to market averages

**Badges:**
- **Trusted Vendor**: Trust score ≥ 4.5 with 20+ transactions
- **Verified Seller**: Trust score ≥ 4.0 with 50+ transactions

---


### Disputes Endpoints

#### 1. Create Dispute

Create a dispute for a transaction.

**Endpoint:** `POST /api/disputes`

**Authentication:** Required

**Request Body:**
```json
{
  "transactionId": "transaction-uuid",
  "respondentId": "vendor-uuid",
  "reason": "quality_mismatch",
  "description": "The tomatoes received were not of premium quality as advertised"
}
```

**Response (201 Created):**
```json
{
  "id": "dispute-uuid",
  "transactionId": "transaction-uuid",
  "initiatorId": "buyer-uuid",
  "respondentId": "vendor-uuid",
  "status": "pending",
  "reason": "quality_mismatch",
  "description": "The tomatoes received were not of premium quality as advertised",
  "createdAt": "2024-01-16T10:00:00.000Z"
}
```

**Dispute Reasons:**
- `quality_mismatch` - Product quality doesn't match listing
- `quantity_short` - Received less quantity than agreed
- `late_delivery` - Delivery was significantly delayed
- `damaged_goods` - Products were damaged during transit
- `other` - Other issues

---

#### 2. Submit Evidence

Submit evidence for a dispute.

**Endpoint:** `POST /api/disputes/:id/evidence`

**Authentication:** Required

**Request Body:**
```json
{
  "evidenceType": "image",
  "content": "base64-encoded-image-or-text"
}
```

**Response (201 Created):**
```json
{
  "id": "evidence-uuid",
  "disputeId": "dispute-uuid",
  "userId": "user-uuid",
  "evidenceType": "image",
  "content": "base64-encoded-image",
  "submittedAt": "2024-01-16T10:30:00.000Z"
}
```

**Evidence Types:**
- `text` - Text description
- `image` - Photo evidence
- `message_log` - Message conversation logs

---

#### 3. Get Dispute Details

Get full details of a dispute including all evidence.

**Endpoint:** `GET /api/disputes/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "dispute": {
    "id": "dispute-uuid",
    "transactionId": "transaction-uuid",
    "initiatorId": "buyer-uuid",
    "respondentId": "vendor-uuid",
    "status": "analyzing",
    "reason": "quality_mismatch",
    "description": "The tomatoes received were not of premium quality",
    "createdAt": "2024-01-16T10:00:00.000Z"
  },
  "evidence": [
    {
      "id": "evidence-1-uuid",
      "userId": "buyer-uuid",
      "evidenceType": "image",
      "content": "base64-image-data",
      "submittedAt": "2024-01-16T10:30:00.000Z"
    },
    {
      "id": "evidence-2-uuid",
      "userId": "vendor-uuid",
      "evidenceType": "text",
      "content": "The tomatoes were premium quality when shipped",
      "submittedAt": "2024-01-16T11:00:00.000Z"
    }
  ]
}
```

**Dispute Status:**
- `pending` - Waiting for evidence submission (48-hour window)
- `analyzing` - AI analyzing submitted evidence
- `resolved` - Dispute resolved with recommendation
- `escalated` - Escalated to human review

---

### Discovery Endpoints

#### 1. Find Nearby Vendors

Find vendors with similar products within a radius.

**Endpoint:** `GET /api/discovery/nearby`

**Query Parameters:**
- `cropType` (required): Crop type to search for
- `lat` (optional): Latitude
- `lng` (optional): Longitude
- `radius` (optional): Search radius in km (default: 50)

**Example Request:**
```
GET /api/discovery/nearby?cropType=tomato&lat=19.9975&lng=73.7898&radius=50
```

**Response (200 OK):**
```json
{
  "vendors": [
    {
      "id": "listing-uuid",
      "vendorId": "vendor-uuid",
      "cropType": "tomato",
      "quantity": 100,
      "finalPrice": 33.00,
      "locationAddress": "Nashik, Maharashtra",
      "vendor": {
        "id": "vendor-uuid",
        "name": "Ramesh Kumar",
        "phoneNumber": "+919876543210"
      }
    }
  ]
}
```

---

#### 2. Get Aggregation Suggestions

Get micro-aggregation opportunities for a listing.

**Endpoint:** `GET /api/discovery/aggregation/:listingId`

**Response (200 OK):**
```json
{
  "suggestions": [
    {
      "vendors": [
        {
          "id": "listing-1-uuid",
          "vendorId": "vendor-1-uuid",
          "cropType": "tomato",
          "quantity": 100,
          "finalPrice": 33.00
        },
        {
          "id": "listing-2-uuid",
          "vendorId": "vendor-2-uuid",
          "cropType": "tomato",
          "quantity": 150,
          "finalPrice": 32.00
        }
      ],
      "combinedQuantity": 250,
      "weightedPrice": 32.40
    }
  ]
}
```

**Use Case:** When a bulk order exceeds a single vendor's capacity, this endpoint suggests combining inventory from nearby vendors with similar products.

---


### Vendors Endpoints

#### 1. Get Nearby Vendors

Get vendors near a location (alternative to discovery endpoint).

**Endpoint:** `GET /api/vendors/nearby`

**Query Parameters:**
- `cropType` (optional): Filter by crop type
- `lat` (optional): Latitude
- `lng` (optional): Longitude
- `radius` (optional): Search radius in km (default: 50)

**Response (200 OK):**
```json
{
  "vendors": [
    {
      "id": "listing-uuid",
      "cropType": "tomato",
      "vendor": {
        "id": "vendor-uuid",
        "name": "Ramesh Kumar"
      }
    }
  ]
}
```

---

#### 2. Get Vendor Profile

Get detailed vendor profile with trust score.

**Endpoint:** `GET /api/vendors/:id`

**Response (200 OK):**
```json
{
  "vendor": {
    "id": "vendor-uuid",
    "name": "Ramesh Kumar",
    "phoneNumber": "+919876543210",
    "languagePreference": "mr",
    "role": "vendor",
    "location": {
      "address": "Nashik, Maharashtra",
      "district": "Nashik",
      "state": "Maharashtra"
    }
  },
  "listings": [
    {
      "id": "listing-uuid",
      "cropType": "tomato",
      "quantity": 100,
      "finalPrice": 33.00,
      "status": "active"
    }
  ],
  "trustScore": {
    "overall": 4.5,
    "transactionCount": 25
  }
}
```

---

#### 3. Get Vendor Listings

Get all active listings for a vendor.

**Endpoint:** `GET /api/vendors/:id/listings`

**Response (200 OK):**
```json
{
  "listings": [
    {
      "id": "listing-uuid",
      "cropType": "tomato",
      "quantity": 100,
      "unit": "kg",
      "finalPrice": 33.00,
      "qualityTier": "premium",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Analytics Endpoints

#### 1. Get Vendor Dashboard

Get comprehensive dashboard metrics for a vendor.

**Endpoint:** `GET /api/analytics/dashboard/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "totalSales": 125000.00,
  "activeListings": 5,
  "pendingNegotiations": 3,
  "trustScore": 4.5,
  "period": "all_time"
}
```

---

#### 2. Get Pricing Analytics

Get pricing comparison and analytics.

**Endpoint:** `GET /api/analytics/pricing/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "averagePrice": 500.00,
  "regionalAverage": 480.00,
  "comparison": "above_average",
  "priceRange": {
    "min": 450.00,
    "max": 550.00
  }
}
```

---

#### 3. Get Negotiation Analytics

Get negotiation success metrics.

**Endpoint:** `GET /api/analytics/negotiations/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "successRate": 75,
  "averageDiscount": 5,
  "totalNegotiations": 40,
  "acceptedNegotiations": 30,
  "rejectedNegotiations": 10
}
```

---

### Advisory Endpoints

#### 1. Get Market Insights

Get personalized market insights for a vendor.

**Endpoint:** `GET /api/advisory/insights/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "insights": [
    {
      "type": "price_increase",
      "cropType": "tomato",
      "message": "Tomato prices rising. Good time to sell!",
      "data": {
        "currentPrice": 32,
        "historicalAverage": 28,
        "changePercent": 14.3
      },
      "actionable": true,
      "priority": "high"
    }
  ]
}
```

**Insight Types:**
- `price_increase` - Prices are rising
- `high_demand` - High demand detected
- `price_drop` - Prices are falling
- `seasonal_trend` - Seasonal pattern detected

---

#### 2. Get Weekly Report

Get weekly market summary and recommendations.

**Endpoint:** `GET /api/advisory/weekly/:vendorId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "period": {
    "start": "2024-01-08T00:00:00.000Z",
    "end": "2024-01-15T00:00:00.000Z"
  },
  "salesSummary": {
    "totalSales": 5000.00,
    "transactionCount": 10,
    "averagePrice": 500.00
  },
  "marketTrends": [],
  "recommendations": [
    "Consider listing more tomatoes",
    "Premium quality products are in high demand"
  ]
}
```

---

#### 3. Get Seasonal Guidance

Get seasonal crop advisory and forecasts.

**Endpoint:** `GET /api/advisory/seasonal/:cropType`

**Response (200 OK):**
```json
{
  "cropType": "tomato",
  "currentSeason": "winter",
  "expectedDemand": "high",
  "priceForecasts": [
    {
      "month": "January",
      "expectedPrice": 30
    },
    {
      "month": "February",
      "expectedPrice": 32
    }
  ],
  "recommendations": [
    "Winter is peak season for tomatoes",
    "Expect high demand in coming weeks"
  ]
}
```

---


### Pricing Endpoints

#### 1. Get Current eNAM Prices

Get current market prices from eNAM.

**Endpoint:** `GET /api/prices/current`

**Query Parameters:**
- `cropType` (required): Crop type (e.g., "tomato")
- `location` (optional): Market location (default: "Delhi")

**Example Request:**
```
GET /api/prices/current?cropType=tomato&location=Nashik
```

**Response (200 OK):**
```json
{
  "cropType": "tomato",
  "location": "Nashik",
  "modalPrice": 30.00,
  "minPrice": 25.00,
  "maxPrice": 35.00,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "source": "enam_api",
  "mandiName": "Nashik Mandi"
}
```

**Note:** In MVP, this uses mock data. Production will integrate with live eNAM API.

---

#### 2. Calculate Pricing

Calculate final price with breakdown.

**Endpoint:** `POST /api/prices/calculate`

**Request Body:**
```json
{
  "productName": "tomato",
  "quantity": 100,
  "qualityTier": "premium",
  "location": "Nashik",
  "basePrice": 25.00
}
```

**Response (200 OK):**
```json
{
  "productName": "tomato",
  "quantity": 100,
  "qualityTier": "premium",
  "location": "Nashik",
  "basePrice": 25.00,
  "qualityMultiplier": 1.2,
  "demandAdjuster": 1.1,
  "finalPrice": 33.00,
  "breakdown": "Base: ₹25.00 × Quality: 1.2 (Premium) × Demand: 1.1 = ₹33.00",
  "formula": "Final Price = Base Price × Quality Multiplier × Demand Adjuster"
}
```

**Quality Multipliers:**
- `premium`: 1.2 (20% markup)
- `standard`: 1.0 (no markup)
- `basic`: 0.85 (15% discount)

**Demand Adjuster Range:** 0.8 - 1.3 (based on market conditions)

---

#### 3. Validate Offer Price

Validate if an offer price is reasonable.

**Endpoint:** `POST /api/prices/validate-offer`

**Request Body:**
```json
{
  "offerPrice": 28.00,
  "listingPrice": 33.00
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "percentageOfListing": 84.8,
  "recommendation": "fair_offer",
  "message": "Offer is within reasonable range"
}
```

**Recommendations:**
- `too_low` - Offer is significantly below market value
- `fair_offer` - Offer is reasonable
- `above_listing` - Offer exceeds listing price

---

### Integration Endpoints

#### 1. Check ODOP Status

Check if a product is ODOP-registered.

**Endpoint:** `GET /api/integration/odop/check`

**Query Parameters:**
- `cropType` (required): Crop type
- `district` (required): District name

**Example Request:**
```
GET /api/integration/odop/check?cropType=onion&district=Nashik
```

**Response (200 OK):**
```json
{
  "success": true,
  "isODOP": true,
  "badge": {
    "district": "Nashik",
    "state": "Maharashtra",
    "description": "ODOP Registered Product - One District One Product Initiative"
  }
}
```

---

#### 2. Get ODOP Districts

Get all ODOP districts for a crop.

**Endpoint:** `GET /api/integration/odop/districts`

**Query Parameters:**
- `cropType` (required): Crop type

**Example Request:**
```
GET /api/integration/odop/districts?cropType=onion
```

**Response (200 OK):**
```json
{
  "success": true,
  "cropType": "onion",
  "districts": [
    {
      "district": "Nashik",
      "state": "Maharashtra"
    },
    {
      "district": "Lasalgaon",
      "state": "Maharashtra"
    }
  ],
  "count": 2
}
```

---

#### 3. Get GeM Documentation Guide

Get GeM registration guide in local language.

**Endpoint:** `GET /api/integration/gem/guide`

**Query Parameters:**
- `language` (optional): Language code (default: "en")

**Example Request:**
```
GET /api/integration/gem/guide?language=hi
```

**Response (200 OK):**
```json
{
  "success": true,
  "guide": {
    "title": "GeM पर पंजीकरण कैसे करें",
    "steps": [
      {
        "stepNumber": 1,
        "title": "GeM पोर्टल पर जाएं",
        "description": "https://gem.gov.in पर जाएं और 'विक्रेता पंजीकरण' पर क्लिक करें",
        "requiredDocuments": []
      },
      {
        "stepNumber": 2,
        "title": "आधार सत्यापन",
        "description": "अपने आधार नंबर से सत्यापन करें",
        "requiredDocuments": ["Aadhaar Card"]
      }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "PAN Card",
      "Bank Account Details",
      "GST Registration (if applicable)"
    ],
    "estimatedTime": "30-45 minutes",
    "language": "hi"
  }
}
```

---

#### 4. Sync Transaction to eNAM

Sync a transaction to eNAM (opt-in feature).

**Endpoint:** `POST /api/integration/enam/sync`

**Authentication:** Required

**Request Body:**
```json
{
  "transactionId": "transaction-uuid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction synced to eNAM successfully",
  "enamTransactionId": "enam-txn-id",
  "syncedAt": "2024-01-15T10:00:00.000Z"
}
```

---

#### 5. Update eNAM Sync Preference

Enable or disable automatic eNAM sync.

**Endpoint:** `PUT /api/integration/enam/preference`

**Authentication:** Required

**Request Body:**
```json
{
  "enabled": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "eNAM sync preference updated",
  "enabled": true
}
```

---

#### 6. Get eNAM Sync Status

Get user's current eNAM sync status.

**Endpoint:** `GET /api/integration/enam/status`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "enamDataSync": true
}
```

---


### Favorites Endpoints

#### 1. Get All Favorites

Get all favorited listings for the authenticated user.

**Endpoint:** `GET /api/favorites`

**Authentication:** Required

**Response (200 OK):**
```json
[
  {
    "id": "favorite-uuid",
    "userId": "user-uuid",
    "listingId": "listing-uuid",
    "notifyOnPriceChange": true,
    "targetPrice": 30.00,
    "listing": {
      "id": "listing-uuid",
      "cropType": "tomato",
      "finalPrice": 33.00,
      "vendor": {
        "id": "vendor-uuid",
        "name": "Ramesh Kumar"
      }
    },
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

#### 2. Add to Favorites

Bookmark a listing.

**Endpoint:** `POST /api/favorites`

**Authentication:** Required

**Request Body:**
```json
{
  "listingId": "listing-uuid",
  "notifyOnPriceChange": true,
  "targetPrice": 30.00
}
```

**Response (201 Created):**
```json
{
  "id": "favorite-uuid",
  "userId": "user-uuid",
  "listingId": "listing-uuid",
  "notifyOnPriceChange": true,
  "targetPrice": 30.00,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Already in favorites
- `404 Not Found`: Listing does not exist

---

#### 3. Check if Favorited

Check if a listing is in user's favorites.

**Endpoint:** `GET /api/favorites/check/:listingId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "isFavorite": true,
  "favorite": {
    "id": "favorite-uuid",
    "notifyOnPriceChange": true,
    "targetPrice": 30.00
  }
}
```

---

#### 4. Remove from Favorites

Remove a listing from favorites.

**Endpoint:** `DELETE /api/favorites/:listingId`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Removed from favorites"
}
```

---

#### 5. Update Favorite Settings

Update notification preferences for a favorite.

**Endpoint:** `PATCH /api/favorites/:listingId`

**Authentication:** Required

**Request Body:**
```json
{
  "notifyOnPriceChange": false,
  "targetPrice": 28.00
}
```

**Response (200 OK):**
```json
{
  "id": "favorite-uuid",
  "notifyOnPriceChange": false,
  "targetPrice": 28.00,
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### Saved Searches Endpoints

#### 1. Get All Saved Searches

Get all saved searches for the authenticated user.

**Endpoint:** `GET /api/saved-searches`

**Authentication:** Required

**Response (200 OK):**
```json
[
  {
    "id": "search-uuid",
    "userId": "user-uuid",
    "name": "Premium Tomatoes in Nashik",
    "searchCriteria": {
      "crop": "tomato",
      "location": "Nashik",
      "quality": "premium",
      "minPrice": 25,
      "maxPrice": 40
    },
    "notifyOnMatch": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

#### 2. Create Saved Search

Save search criteria for quick access.

**Endpoint:** `POST /api/saved-searches`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Premium Tomatoes in Nashik",
  "searchCriteria": {
    "crop": "tomato",
    "location": "Nashik",
    "quality": "premium",
    "minPrice": 25,
    "maxPrice": 40
  },
  "notifyOnMatch": true
}
```

**Response (201 Created):**
```json
{
  "id": "search-uuid",
  "userId": "user-uuid",
  "name": "Premium Tomatoes in Nashik",
  "searchCriteria": {
    "crop": "tomato",
    "location": "Nashik",
    "quality": "premium",
    "minPrice": 25,
    "maxPrice": 40
  },
  "notifyOnMatch": true,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

#### 3. Execute Saved Search

Execute a saved search and get current results.

**Endpoint:** `GET /api/saved-searches/:id/execute`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "savedSearch": {
    "id": "search-uuid",
    "name": "Premium Tomatoes in Nashik",
    "searchCriteria": {
      "crop": "tomato",
      "location": "Nashik",
      "quality": "premium"
    }
  },
  "results": [
    {
      "id": "listing-uuid",
      "cropType": "tomato",
      "qualityTier": "premium",
      "finalPrice": 33.00,
      "locationAddress": "Nashik, Maharashtra"
    }
  ]
}
```

---

#### 4. Delete Saved Search

Delete a saved search.

**Endpoint:** `DELETE /api/saved-searches/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Saved search deleted"
}
```

---

### Sharing Endpoints

#### 1. Generate QR Code

Generate a QR code for a listing.

**Endpoint:** `GET /api/share/qr/:listingId`

**Response (200 OK):**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "http://localhost:3001/listings/listing-uuid"
}
```

**Use Case:** Generate QR codes for offline sharing at mandis or farmer meetings.

---

#### 2. Track Share

Track when a listing is shared (analytics).

**Endpoint:** `POST /api/share/track`

**Request Body:**
```json
{
  "listingId": "listing-uuid",
  "platform": "whatsapp"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Supported Platforms:**
- `whatsapp` - WhatsApp sharing
- `sms` - SMS sharing
- `qr_code` - QR code scan
- `other` - Other platforms

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication required or token invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PHONE_NUMBER` | Phone number format is invalid |
| `INVALID_OTP` | OTP is incorrect or expired |
| `MAX_RETRIES_EXCEEDED` | Too many OTP attempts |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INVALID_TOKEN` | JWT token is malformed or invalid |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

### Example Error Responses

**Invalid Phone Number (400):**
```json
{
  "error": "Phone number must be in format +91XXXXXXXXXX",
  "code": "INVALID_PHONE_NUMBER"
}
```

**Unauthorized (401):**
```json
{
  "error": "Access token required",
  "code": "TOKEN_REQUIRED"
}
```

**Token Expired (401):**
```json
{
  "error": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

**Forbidden (403):**
```json
{
  "error": "Insufficient permissions. Vendor role required.",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

**Not Found (404):**
```json
{
  "error": "Listing not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

---

## Rate Limiting

### Overview

The API implements rate limiting to prevent abuse and ensure fair usage.

### Limits

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Voice processing**: 20 requests per minute per user
- **Message sending**: 10 messages per hour for new users (< 5 transactions)

### Rate Limit Headers

Responses include rate limit information in headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Rate Limit Exceeded Response

**Status Code:** 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## Best Practices

### 1. Authentication

- Store JWT tokens securely (never in localStorage for sensitive apps)
- Implement token refresh logic before expiration
- Handle 401 responses by redirecting to login

### 2. Error Handling

- Always check HTTP status codes
- Parse error messages for user-friendly display
- Implement retry logic for 5xx errors

### 3. Performance

- Use pagination for list endpoints
- Cache frequently accessed data (prices, vendor profiles)
- Implement request debouncing for search

### 4. Voice Interface

- Compress audio before sending (recommended: 16kHz, mono, AAC)
- Handle microphone permissions gracefully
- Provide fallback text input for voice failures

### 5. Multilingual Support

- Always send user's language preference in requests
- Cache translations locally
- Handle missing translations gracefully

---

## Changelog

### Version 1.0.0 (January 2024)

- Initial API release
- 17 route modules with 50+ endpoints
- JWT authentication
- Voice interface with SARVAM AI integration
- AI-powered negotiations with OpenRouter
- eNAM, ODOP, and GeM integration
- Trust system and dispute resolution
- Favorites and saved searches
- QR code generation for sharing

---

## Support

For API support, please contact:
- **Email**: api-support@multilingualmandi.com
- **Documentation**: https://docs.multilingualmandi.com
- **GitHub**: https://github.com/multilingual-mandi

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
