# Design Document: The Multilingual Mandi

## Overview

The Multilingual Mandi is a full-stack web application that bridges the language gap in agricultural trading across India. The system consists of a React-based frontend, Node.js/Express backend, SQLite/PostgreSQL database, and integrations with BHASHINI APIs for multilingual voice and text processing, plus eNAM APIs for market data.

The architecture follows a three-tier model with clear separation between presentation (React UI), business logic (Express API), and data persistence (SQL database). The system emphasizes mobile-first design, offline capability, and voice-first interactions to serve users with varying literacy levels.

Key design principles:
- **Language-first**: Every interaction supports multiple local languages
- **Voice-enabled**: Critical features accessible via voice commands
- **Transparent**: All pricing and algorithms are explainable
- **Trust-building**: Objective metrics and dispute resolution
- **Progressive enhancement**: Works on basic devices, better on modern ones

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React Web UI │  │ Voice Input  │  │ PWA Offline  │      │
│  │ (Tailwind)   │  │ Component    │  │ Storage      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js REST API Server                   │   │
│  │  - Authentication Middleware                         │   │
│  │  - Rate Limiting                                     │   │
│  │  - Request Validation                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Negotiation  │  │ Pricing      │  │ Trust        │      │
│  │ Engine       │  │ Calculator   │  │ System       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Discovery    │  │ Advisory     │  │ Messaging    │      │
│  │ Service      │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite (MVP) / PostgreSQL (Production)              │   │
│  │  - Users, Listings, Transactions, Messages           │   │
│  │  - Negotiations, Ratings, Disputes                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ BHASHINI     │  │ eNAM API     │  │ SMS/OTP      │      │
│  │ Translation  │  │ (Mocked)     │  │ Gateway      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18+ with functional components and hooks
- Tailwind CSS for responsive styling
- React Router for navigation
- Axios for API communication
- Web Speech API for voice input (with BHASHINI fallback)
- Service Workers for PWA offline capability
- LocalStorage for caching and offline data

**Backend:**
- Node.js 18+ with Express.js framework
- JWT for authentication and session management
- Bcrypt for password hashing (if needed)
- Multer for file uploads
- Node-cron for scheduled tasks (advisory notifications)
- Winston for logging

**Database:**
- SQLite for MVP/development (single file, easy deployment)
- PostgreSQL for production (better concurrency, scalability)
- Sequelize ORM for database abstraction

**External APIs:**
- BHASHINI API for speech-to-text, text-to-speech, and translation
- Abstraction layer to support SARVAM API swap
- eNAM API (mocked initially) for market price data

**Deployment:**
- Docker for containerization
- Docker Compose for local development
- Vercel for frontend hosting
- Render/Railway for backend hosting
- Environment-based configuration

## Components and Interfaces

### 1. Authentication Service

**Responsibilities:**
- Phone number validation and OTP generation
- OTP verification and session creation
- JWT token generation and validation
- User profile management

**Interface:**
```typescript
interface AuthService {
  sendOTP(phoneNumber: string): Promise<{success: boolean, expiresAt: Date}>
  verifyOTP(phoneNumber: string, otp: string): Promise<{token: string, user: User}>
  validateToken(token: string): Promise<User>
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<User>
}

interface User {
  id: string
  phoneNumber: string
  role: 'vendor' | 'buyer'
  languagePreference: string
  name?: string
  location?: Location
  createdAt: Date
}

interface Location {
  latitude: number
  longitude: number
  address: string
  district: string
  state: string
}
```

### 2. Voice Interface Service

**Responsibilities:**
- Audio recording and streaming
- Speech-to-text conversion via BHASHINI
- Text-to-speech conversion via BHASHINI
- Language detection and translation
- Query parsing and intent extraction

**Interface:**
```typescript
interface VoiceService {
  transcribeAudio(audioBlob: Blob, language: string): Promise<string>
  synthesizeSpeech(text: string, language: string): Promise<Blob>
  translateText(text: string, fromLang: string, toLang: string): Promise<string>
  parseQuery(text: string, language: string): Promise<QueryIntent>
}

interface QueryIntent {
  type: 'price_query' | 'listing_search' | 'help'
  cropName?: string
  location?: string
  parameters: Record<string, any>
}
```

### 3. Listing Service

**Responsibilities:**
- CRUD operations for product listings
- Image upload and storage
- Quality tier assignment
- Listing search and filtering
- Availability management

**Interface:**
```typescript
interface ListingService {
  createListing(vendorId: string, data: ListingInput): Promise<Listing>
  updateListing(listingId: string, updates: Partial<ListingInput>): Promise<Listing>
  deleteListing(listingId: string): Promise<void>
  getListing(listingId: string): Promise<Listing>
  searchListings(criteria: SearchCriteria): Promise<Listing[]>
  updateAvailability(listingId: string, available: boolean): Promise<Listing>
}

interface ListingInput {
  cropType: string
  quantity: number
  unit: string
  basePrice: number
  qualityTier: 'premium' | 'standard' | 'basic'
  images?: string[]
  description?: string
  location: Location
}

interface Listing extends ListingInput {
  id: string
  vendorId: string
  finalPrice: number
  priceBreakdown: PriceBreakdown
  status: 'active' | 'sold' | 'unavailable'
  createdAt: Date
  updatedAt: Date
}

interface SearchCriteria {
  cropType?: string
  location?: Location
  radiusKm?: number
  qualityTier?: string[]
  priceRange?: {min: number, max: number}
  sortBy?: 'price' | 'distance' | 'trust_score' | 'relevance'
}
```

### 4. Pricing Calculator Service

**Responsibilities:**
- Calculate final prices using transparent formula
- Determine quality multipliers
- Calculate demand adjusters
- Provide price breakdowns

**Interface:**
```typescript
interface PricingService {
  calculateFinalPrice(basePrice: number, qualityTier: string, cropType: string, location: Location): Promise<PriceResult>
  getQualityMultiplier(qualityTier: string): number
  getDemandAdjuster(cropType: string, location: Location): Promise<number>
  getPriceBreakdown(listingId: string): Promise<PriceBreakdown>
}

interface PriceResult {
  finalPrice: number
  breakdown: PriceBreakdown
}

interface PriceBreakdown {
  basePrice: number
  qualityMultiplier: number
  demandAdjuster: number
  finalPrice: number
  explanation: string
}
```

### 5. Negotiation Engine Service

**Responsibilities:**
- Create and manage negotiation sessions
- Analyze offers and suggest counter-offers
- Track negotiation history
- Handle session expiration
- Finalize agreements

**Interface:**
```typescript
interface NegotiationService {
  createNegotiation(buyerId: string, listingId: string, initialOffer: number): Promise<Negotiation>
  analyzeOffer(negotiationId: string, offer: number): Promise<OfferAnalysis>
  submitCounterOffer(negotiationId: string, userId: string, amount: number, reasoning?: string): Promise<Negotiation>
  acceptOffer(negotiationId: string, userId: string): Promise<Transaction>
  rejectOffer(negotiationId: string, userId: string): Promise<Negotiation>
  getNegotiation(negotiationId: string): Promise<Negotiation>
  expireNegotiations(): Promise<void>
}

interface Negotiation {
  id: string
  listingId: string
  buyerId: string
  vendorId: string
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  offers: Offer[]
  createdAt: Date
  expiresAt: Date
}

interface Offer {
  userId: string
  amount: number
  reasoning?: string
  timestamp: Date
  type: 'buyer_offer' | 'vendor_counter' | 'ai_suggestion'
}

interface OfferAnalysis {
  fairPriceRange: {min: number, max: number}
  suggestedCounter: number
  reasoning: string
  marketContext: {
    averagePrice: number
    recentTransactions: number
    regionalVariation: number
  }
}
```

### 6. Discovery Service

**Responsibilities:**
- Find nearby vendors with similar products
- Calculate distances between vendors
- Identify micro-aggregation opportunities
- Manage vendor collaborations

**Interface:**
```typescript
interface DiscoveryService {
  findNearbyVendors(cropType: string, location: Location, radiusKm: number): Promise<VendorMatch[]>
  identifyAggregationOpportunities(listingId: string): Promise<AggregationSuggestion[]>
  createAggregatedListing(vendorIds: string[], listingDetails: AggregatedListingInput): Promise<AggregatedListing>
  calculateCombinedPricing(listings: Listing[]): Promise<number>
}

interface VendorMatch {
  vendorId: string
  vendorName: string
  listing: Listing
  distanceKm: number
  trustScore: number
}

interface AggregationSuggestion {
  vendors: VendorMatch[]
  combinedQuantity: number
  weightedPrice: number
  potentialBuyers: string[]
}

interface AggregatedListing extends Listing {
  participatingVendors: {
    vendorId: string
    quantity: number
    contribution: number
  }[]
}
```

### 7. Trust System Service

**Responsibilities:**
- Calculate trust scores
- Manage ratings and reviews
- Award badges
- Handle dispute creation and resolution
- Monitor vendor performance

**Interface:**
```typescript
interface TrustService {
  calculateTrustScore(vendorId: string): Promise<TrustScore>
  submitRating(transactionId: string, buyerId: string, rating: Rating): Promise<void>
  awardBadge(vendorId: string, badgeType: string): Promise<void>
  createDispute(transactionId: string, initiatorId: string, details: DisputeInput): Promise<Dispute>
  analyzeDispute(disputeId: string): Promise<DisputeResolution>
  resolveDispute(disputeId: string, resolution: DisputeResolution): Promise<void>
  getVendorReputation(vendorId: string): Promise<Reputation>
}

interface TrustScore {
  overall: number
  delivery: number
  quality: number
  response: number
  fairPricing: number
  transactionCount: number
}

interface Rating {
  deliveryRating: number
  qualityRating: number
}

interface DisputeInput {
  reason: string
  evidence: string[]
  description: string
}

interface Dispute {
  id: string
  transactionId: string
  initiatorId: string
  respondentId: string
  status: 'pending' | 'analyzing' | 'resolved' | 'escalated'
  details: DisputeInput
  evidence: Evidence[]
  createdAt: Date
}

interface Evidence {
  userId: string
  type: 'text' | 'image' | 'message_log'
  content: string
  submittedAt: Date
}

interface DisputeResolution {
  recommendation: 'refund_full' | 'refund_partial' | 'no_refund' | 'reship'
  reasoning: string
  refundAmount?: number
  confidence: number
}

interface Reputation {
  trustScore: TrustScore
  badges: string[]
  totalTransactions: number
  disputeRate: number
  responseTimeAvg: number
}
```

### 8. Integration Layer Service

**Responsibilities:**
- Fetch eNAM market prices
- Cache external data
- Provide GeM documentation assistance
- Sync transaction data

**Interface:**
```typescript
interface IntegrationService {
  fetchENAMPrices(cropType: string, mandiLocation?: string): Promise<ENAMPrice[]>
  getCachedPrice(cropType: string, mandiLocation: string): Promise<ENAMPrice | null>
  getGeMDocumentationGuide(language: string): Promise<DocumentGuide>
  syncTransactionToENAM(transactionId: string): Promise<void>
}

interface ENAMPrice {
  cropType: string
  mandiName: string
  mandiLocation: string
  modalPrice: number
  minPrice: number
  maxPrice: number
  timestamp: Date
  source: 'enam_api' | 'cached'
}

interface DocumentGuide {
  steps: DocumentStep[]
  requiredDocuments: string[]
  language: string
}

interface DocumentStep {
  stepNumber: number
  title: string
  description: string
  helpText: string
}
```

### 9. Advisory Service

**Responsibilities:**
- Analyze market trends
- Generate personalized insights
- Send notifications
- Provide seasonal guidance

**Interface:**
```typescript
interface AdvisoryService {
  generateMarketInsights(vendorId: string): Promise<MarketInsight[]>
  sendPriceAlert(vendorId: string, cropType: string, priceChange: number): Promise<void>
  getWeeklyReport(vendorId: string): Promise<WeeklyReport>
  getSeasonalGuidance(cropType: string, location: Location): Promise<SeasonalAdvice>
}

interface MarketInsight {
  type: 'price_increase' | 'high_demand' | 'price_drop' | 'seasonal_trend'
  cropType: string
  message: string
  data: {
    currentPrice: number
    historicalAverage: number
    changePercent: number
  }
  actionable: boolean
  recommendation?: string
}

interface WeeklyReport {
  period: {start: Date, end: Date}
  salesSummary: {
    totalSales: number
    transactionCount: number
    averagePrice: number
  }
  marketTrends: MarketInsight[]
  recommendations: string[]
}

interface SeasonalAdvice {
  cropType: string
  currentSeason: string
  plantingWindow?: {start: Date, end: Date}
  harvestWindow?: {start: Date, end: Date}
  expectedDemand: 'high' | 'medium' | 'low'
  priceForecasts: {month: string, expectedPrice: number}[]
}
```

### 10. Messaging Service

**Responsibilities:**
- Send and receive messages
- Translate messages between languages
- Track read receipts
- Monitor response times
- Prevent spam

**Interface:**
```typescript
interface MessagingService {
  sendMessage(senderId: string, recipientId: string, content: MessageContent): Promise<Message>
  getThread(userId1: string, userId2: string, listingId?: string): Promise<Message[]>
  markAsRead(messageId: string, userId: string): Promise<void>
  translateMessage(messageId: string, targetLanguage: string): Promise<string>
  getResponseTime(vendorId: string): Promise<number>
  checkSpamLimit(userId: string): Promise<boolean>
}

interface MessageContent {
  text?: string
  images?: string[]
  listingId?: string
}

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: MessageContent
  originalLanguage: string
  translatedVersions: {[language: string]: string}
  timestamp: Date
  readAt?: Date
  threadId: string
}
```

### 11. Unified Voice Assistant Service (Kisaan Bot)

**Responsibilities:**
- Capture and process voice input
- Transcribe audio using SARVAM STT
- Extract intent and parameters using OpenRouter AI
- Execute appropriate API calls based on intent
- Provide user-friendly confirmations and error messages
- Handle microphone permissions and errors

**Interface:**
```typescript
interface KisaanBotService {
  captureVoiceInput(): Promise<Blob>
  transcribeAudio(audioBlob: Blob, language: string): Promise<string>
  extractIntent(transcribedText: string, language: string): Promise<VoiceIntent>
  executeIntent(intent: VoiceIntent, userId: string): Promise<IntentResult>
  formatConfirmation(intent: VoiceIntent, language: string): Promise<string>
  handleError(error: Error, language: string): Promise<string>
}

interface VoiceIntent {
  type: 'price_query' | 'create_listing' | 'make_offer' | 'search_listings' | 'general_help'
  parameters: {
    cropType?: string
    quantity?: number
    price?: number
    location?: string
    qualityTier?: string
    listingId?: string
    [key: string]: any
  }
  confidence: number
  rawText: string
}

interface IntentResult {
  success: boolean
  data?: any
  redirectUrl?: string
  errorMessage?: string
}
```

### 12. Guide Service

**Responsibilities:**
- Serve guide content
- Translate guide content based on user language
- Cache translations
- Organize guide sections

**Interface:**
```typescript
interface GuideService {
  getGuideContent(section: string, language: string): Promise<GuideContent>
  translateGuide(content: string, targetLanguage: string): Promise<string>
  getCachedTranslation(section: string, language: string): Promise<string | null>
  getAllSections(): Promise<GuideSection[]>
}

interface GuideContent {
  section: string
  title: string
  content: string
  language: string
  lastUpdated: Date
}

interface GuideSection {
  id: string
  title: string
  order: number
  subsections?: GuideSection[]
}
```

## Data Models

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('vendor', 'buyer')),
  language_preference VARCHAR(10) NOT NULL,
  name VARCHAR(100),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  location_district VARCHAR(100),
  location_state VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
```

**OTP Table:**
```sql
CREATE TABLE otps (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otps_phone ON otps(phone_number);
CREATE INDEX idx_otps_expires ON otps(expires_at);
```

**Listings Table:**
```sql
CREATE TABLE listings (
  id VARCHAR(36) PRIMARY KEY,
  vendor_id VARCHAR(36) NOT NULL,
  crop_type VARCHAR(100) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  quality_tier VARCHAR(20) NOT NULL CHECK (quality_tier IN ('premium', 'standard', 'basic')),
  quality_multiplier DECIMAL(4, 2) NOT NULL,
  demand_adjuster DECIMAL(4, 2) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  images TEXT, -- JSON array of image URLs
  description TEXT,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_address TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'unavailable')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_listings_vendor ON listings(vendor_id);
CREATE INDEX idx_listings_crop ON listings(crop_type);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_location ON listings(location_lat, location_lng);
```

**Negotiations Table:**
```sql
CREATE TABLE negotiations (
  id VARCHAR(36) PRIMARY KEY,
  listing_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  vendor_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_negotiations_listing ON negotiations(listing_id);
CREATE INDEX idx_negotiations_buyer ON negotiations(buyer_id);
CREATE INDEX idx_negotiations_vendor ON negotiations(vendor_id);
CREATE INDEX idx_negotiations_status ON negotiations(status);
CREATE INDEX idx_negotiations_expires ON negotiations(expires_at);
```

**Offers Table:**
```sql
CREATE TABLE offers (
  id VARCHAR(36) PRIMARY KEY,
  negotiation_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reasoning TEXT,
  offer_type VARCHAR(20) NOT NULL CHECK (offer_type IN ('buyer_offer', 'vendor_counter', 'ai_suggestion')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (negotiation_id) REFERENCES negotiations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_offers_negotiation ON offers(negotiation_id);
CREATE INDEX idx_offers_created ON offers(created_at);
```

**Transactions Table:**
```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  negotiation_id VARCHAR(36) NOT NULL,
  listing_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  vendor_id VARCHAR(36) NOT NULL,
  agreed_price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'disputed')),
  delivery_terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  FOREIGN KEY (negotiation_id) REFERENCES negotiations(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

**Ratings Table:**
```sql
CREATE TABLE ratings (
  id VARCHAR(36) PRIMARY KEY,
  transaction_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  vendor_id VARCHAR(36) NOT NULL,
  delivery_rating INTEGER NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
  quality_rating INTEGER NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_ratings_vendor ON ratings(vendor_id);
CREATE INDEX idx_ratings_transaction ON ratings(transaction_id);
```

**Trust Scores Table:**
```sql
CREATE TABLE trust_scores (
  id VARCHAR(36) PRIMARY KEY,
  vendor_id VARCHAR(36) UNIQUE NOT NULL,
  overall_score DECIMAL(3, 2) NOT NULL,
  delivery_score DECIMAL(3, 2) NOT NULL,
  quality_score DECIMAL(3, 2) NOT NULL,
  response_score DECIMAL(3, 2) NOT NULL,
  fair_pricing_score DECIMAL(3, 2) NOT NULL,
  transaction_count INTEGER DEFAULT 0,
  badges TEXT, -- JSON array of badge names
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_trust_vendor ON trust_scores(vendor_id);
CREATE INDEX idx_trust_overall ON trust_scores(overall_score);
```

**Disputes Table:**
```sql
CREATE TABLE disputes (
  id VARCHAR(36) PRIMARY KEY,
  transaction_id VARCHAR(36) NOT NULL,
  initiator_id VARCHAR(36) NOT NULL,
  respondent_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'resolved', 'escalated')),
  reason VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  resolution_type VARCHAR(30),
  resolution_reasoning TEXT,
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (initiator_id) REFERENCES users(id),
  FOREIGN KEY (respondent_id) REFERENCES users(id)
);

CREATE INDEX idx_disputes_transaction ON disputes(transaction_id);
CREATE INDEX idx_disputes_status ON disputes(status);
```

**Evidence Table:**
```sql
CREATE TABLE evidence (
  id VARCHAR(36) PRIMARY KEY,
  dispute_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  evidence_type VARCHAR(20) NOT NULL CHECK (evidence_type IN ('text', 'image', 'message_log')),
  content TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dispute_id) REFERENCES disputes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_evidence_dispute ON evidence(dispute_id);
```

**Messages Table:**
```sql
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  recipient_id VARCHAR(36) NOT NULL,
  thread_id VARCHAR(36) NOT NULL,
  listing_id VARCHAR(36),
  text_content TEXT,
  images TEXT, -- JSON array
  original_language VARCHAR(10) NOT NULL,
  translated_versions TEXT, -- JSON object
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

**ENAM Prices Cache Table:**
```sql
CREATE TABLE enam_prices (
  id VARCHAR(36) PRIMARY KEY,
  crop_type VARCHAR(100) NOT NULL,
  mandi_name VARCHAR(200) NOT NULL,
  mandi_location VARCHAR(200) NOT NULL,
  modal_price DECIMAL(10, 2) NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_enam_crop ON enam_prices(crop_type);
CREATE INDEX idx_enam_location ON enam_prices(mandi_location);
CREATE INDEX idx_enam_expires ON enam_prices(expires_at);
```

### Data Validation Rules

**User Data:**
- Phone numbers must match Indian format: +91XXXXXXXXXX
- Language preference must be one of: 'en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'
- Role must be either 'vendor' or 'buyer'

**Listing Data:**
- Quantity must be positive
- Base price must be positive
- Quality tier must be 'premium', 'standard', or 'basic'
- Quality multiplier: premium=1.2, standard=1.0, basic=0.85
- Demand adjuster must be between 0.8 and 1.3
- Final price = base_price × quality_multiplier × demand_adjuster

**Negotiation Data:**
- Expiration must be 24 hours from creation
- Offers must be positive amounts
- Status transitions: active → (accepted | rejected | expired)

**Rating Data:**
- All ratings must be integers between 1 and 5
- Ratings can only be submitted after transaction status is 'delivered'

**Trust Score Data:**
- All scores must be between 0.0 and 5.0
- Overall score = 0.4×delivery + 0.3×quality + 0.2×response + 0.1×fair_pricing
- Badges awarded based on thresholds:
  - "Trusted Vendor": overall_score ≥ 4.5 AND transaction_count ≥ 20
  - "Verified Seller": overall_score ≥ 4.0 AND transaction_count ≥ 50


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Authentication and Profile Properties

**Property 1: OTP Generation for Valid Phone Numbers**
*For any* valid Indian phone number, when an OTP is requested, the system should generate and send an OTP that expires in exactly 5 minutes.
**Validates: Requirements 1.1**

**Property 2: Valid OTP Authentication**
*For any* valid OTP submitted within 5 minutes of generation, the system should authenticate the user and create a session token.
**Validates: Requirements 1.2**

**Property 3: Invalid OTP Rejection with Retry Limit**
*For any* invalid OTP, the system should reject authentication and allow exactly 3 retry attempts before blocking further attempts.
**Validates: Requirements 1.3**

**Property 4: Profile Creation on First Authentication**
*For any* new user completing OTP verification, the system should create a user profile with the selected role (vendor or buyer).
**Validates: Requirements 1.4**

**Property 5: Language Preference Persistence**
*For any* user, setting a language preference and then retrieving the user profile should return the same language preference (round-trip property).
**Validates: Requirements 1.5**

**Property 6: Profile Update Round-Trip**
*For any* valid profile update, immediately retrieving the profile should reflect all the updated fields (round-trip property).
**Validates: Requirements 1.6**

### Voice Interface Properties

**Property 7: Voice Query Language Consistency**
*For any* voice query in a supported language, the response audio should be in the same language as the input query.
**Validates: Requirements 2.4**

**Property 8: Query Parsing Extraction**
*For any* valid voice query containing a crop name and location, the system should successfully extract both the crop name and location.
**Validates: Requirements 2.2**

**Property 9: Price Retrieval for Valid Queries**
*For any* valid crop and location combination, the system should return at least one price (from database or eNAM).
**Validates: Requirements 2.3**

**Property 10: Malformed Query Clarification**
*For any* voice query that cannot be parsed, the system should request clarification in the user's language.
**Validates: Requirements 2.7**

### Listing Management Properties

**Property 11: Required Fields Validation**
*For any* listing creation attempt, if any required field (crop type, quantity, unit, base price, quality tier) is missing, the system should reject the listing.
**Validates: Requirements 3.1**

**Property 12: Image Association Round-Trip**
*For any* listing with an uploaded image, retrieving the listing should return the same image URL (round-trip property).
**Validates: Requirements 3.2**

**Property 13: Quality Tier Validation**
*For any* listing, the quality tier must be one of: 'premium', 'standard', or 'basic'.
**Validates: Requirements 3.4**

**Property 14: Automatic Price Calculation**
*For any* listing creation, the final price should equal base_price × quality_multiplier × demand_adjuster.
**Validates: Requirements 3.5**

**Property 15: Listing Update Round-Trip**
*For any* listing update, immediately retrieving the listing should reflect all updated fields (round-trip property).
**Validates: Requirements 3.6**

**Property 16: Unavailable Listings Exclusion from Search**
*For any* search query, listings marked as 'sold' or 'unavailable' should not appear in the search results.
**Validates: Requirements 3.7**

**Property 17: Active Listings on Vendor Profile**
*For any* vendor profile, only listings with status 'active' should be displayed.
**Validates: Requirements 3.8**

### Pricing Calculator Properties

**Property 18: Pricing Formula Correctness**
*For any* listing with base price B, quality multiplier Q, and demand adjuster D, the final price should equal B × Q × D.
**Validates: Requirements 4.1**

**Property 19: Demand Adjuster Bounds**
*For any* listing, the demand adjuster must be between 0.8 and 1.3 (inclusive).
**Validates: Requirements 4.6**

**Property 20: Price Breakdown Completeness**
*For any* listing, the price breakdown should include base price, quality multiplier, demand adjuster, final price, and explanation text.
**Validates: Requirements 4.7**

**Property 21: Price Recalculation on Component Change**
*For any* listing, if any pricing component (base price, quality tier, or demand factors) changes, the final price should be recalculated immediately.
**Validates: Requirements 4.8**


### Negotiation Engine Properties

**Property 22: Negotiation Session Creation with 24-Hour Expiration**
*For any* initial offer on a listing, the system should create a negotiation session that expires exactly 24 hours from creation.
**Validates: Requirements 5.1**

**Property 23: Counter-Offer Suggestion for Low Offers**
*For any* buyer offer below the fair price range, the system should generate a counter-offer suggestion with reasoning.
**Validates: Requirements 5.2, 5.3**

**Property 24: Multiple Negotiation Rounds**
*For any* negotiation session, the system should support multiple back-and-forth offers within the 24-hour window.
**Validates: Requirements 5.5**

**Property 25: Transaction Creation on Acceptance**
*For any* negotiation where either party accepts an offer, the system should create a transaction record with the agreed price.
**Validates: Requirements 5.6**

**Property 26: Negotiation Expiration After 24 Hours**
*For any* negotiation session, if 24 hours elapse without acceptance, the status should be updated to 'expired'.
**Validates: Requirements 5.7**

**Property 27: Regional Pricing Consideration**
*For any* two identical listings in different regions, the counter-offer suggestions should differ based on regional pricing data.
**Validates: Requirements 5.8**

**Property 28: Listing Status Update on Finalization**
*For any* finalized negotiation, the associated listing status should be updated to reflect reduced availability or 'sold' status.
**Validates: Requirements 5.9**

### Discovery Service Properties

**Property 29: Nearby Vendor Discovery Within Radius**
*For any* vendor viewing their listing, all vendors shown on the map should be within 50km and selling the same crop type.
**Validates: Requirements 6.1**

**Property 30: Vendor Messaging Delivery**
*For any* message sent between vendors, the message should be delivered and stored in the message thread.
**Validates: Requirements 6.3**

**Property 31: Micro-Aggregation Opportunity Identification**
*For any* set of vendors with similar listings (same crop, similar quality, nearby location), the system should identify them as aggregation opportunities.
**Validates: Requirements 6.4**

**Property 32: Bulk Order Aggregation Suggestion**
*For any* bulk order that exceeds a single vendor's quantity, the system should suggest combining inventory from nearby vendors.
**Validates: Requirements 6.5**

**Property 33: Weighted Average Pricing for Aggregation**
*For any* aggregated listing, the combined price should be the weighted average of participating vendors' prices based on their quantity contributions.
**Validates: Requirements 6.6**

**Property 34: Combined Listing Creation on Agreement**
*For any* set of vendors agreeing to aggregate, the system should create a combined listing with all participating vendors listed.
**Validates: Requirements 6.7**

**Property 35: Proportional Payment Distribution**
*For any* aggregated order payment, each vendor should receive payment proportional to their quantity contribution.
**Validates: Requirements 6.8**

### Trust System Properties

**Property 36: Trust Score Formula Correctness**
*For any* vendor with ratings, the overall trust score should equal (0.4 × delivery_score) + (0.3 × quality_score) + (0.2 × response_score) + (0.1 × fair_pricing_score).
**Validates: Requirements 7.1**

**Property 37: Response Time Calculation from Messages**
*For any* vendor, the response score should be calculated automatically from message timestamp differences.
**Validates: Requirements 7.4**

**Property 38: Fair Pricing Score Calculation**
*For any* transaction, the fair pricing score should be based on comparing the final negotiated price to the market average for that crop and quality.
**Validates: Requirements 7.5**

**Property 39: Trusted Vendor Badge Award**
*For any* vendor with overall trust score ≥ 4.5 and transaction count ≥ 20, the system should award a "Trusted Vendor" badge.
**Validates: Requirements 7.6**

**Property 40: Verified Seller Badge Award**
*For any* vendor with overall trust score ≥ 4.0 and transaction count ≥ 50, the system should award a "Verified Seller" badge.
**Validates: Requirements 7.7**

**Property 41: Low Trust Score Flagging**
*For any* vendor whose trust score falls below 3.0, the system should flag the account for review.
**Validates: Requirements 7.9**

### Dispute Resolution Properties

**Property 42: Dispute Case Creation**
*For any* buyer or vendor raising a dispute on a transaction, the system should create a dispute case with all transaction details.
**Validates: Requirements 8.1**

**Property 43: Evidence Submission Notification**
*For any* newly created dispute, both parties should be notified and given 48 hours to submit evidence.
**Validates: Requirements 8.2**

**Property 44: Resolution Recommendation Generation**
*For any* dispute with evidence from both parties, the system should generate a resolution recommendation with detailed reasoning.
**Validates: Requirements 8.4**

**Property 45: Resolution Execution on Acceptance**
*For any* dispute resolution accepted by both parties, the system should execute the recommended action (refund, partial payment, etc.).
**Validates: Requirements 8.7**

**Property 46: Trust Score Update on Dispute Resolution**
*For any* resolved dispute, the trust scores of involved parties should be updated based on the outcome and their behavior.
**Validates: Requirements 8.8**

### Integration Layer Properties

**Property 47: eNAM Price Fetching**
*For any* supported crop type, the system should be able to fetch or retrieve cached eNAM prices.
**Validates: Requirements 9.1**

**Property 48: Price Source Indication**
*For any* displayed price, the system should indicate whether the source is 'enam_api', 'cached', or 'local_transactions'.
**Validates: Requirements 9.2**

**Property 49: Cached Data Fallback on API Failure**
*For any* eNAM API request that fails, the system should return cached data with a timestamp indicating when it was fetched.
**Validates: Requirements 9.3**

**Property 50: ODOP Badge Display**
*For any* listing of an ODOP-registered product, the system should display an ODOP badge on the listing.
**Validates: Requirements 9.4**

**Property 51: GeM Assistance Language Consistency**
*For any* vendor requesting GeM assistance, the guidance should be provided in the vendor's preferred language.
**Validates: Requirements 9.6**

**Property 52: Opt-In eNAM Data Sync**
*For any* vendor who opts in to data sharing, their transaction data should be synced with eNAM.
**Validates: Requirements 9.7**

**Property 53: eNAM Price Metadata Display**
*For any* displayed eNAM price, the system should show the mandi location and last updated timestamp.
**Validates: Requirements 9.8**


### Advisory Service Properties

**Property 54: Market Change Notification in Preferred Language**
*For any* significant market condition change, affected vendors should receive notifications in their preferred language.
**Validates: Requirements 10.1**

**Property 55: High Demand Notification**
*For any* vendor whose crop experiences high demand, the system should send a notification with current price trends.
**Validates: Requirements 10.3**

**Property 56: Price Drop Alert**
*For any* crop price that drops below historical average, vendors selling that crop should receive an alert with context.
**Validates: Requirements 10.4**

**Property 57: Weekly Summary Language Consistency**
*For any* vendor, weekly market summaries should be delivered in the vendor's preferred language.
**Validates: Requirements 10.5**

**Property 58: Regional Variation in Recommendations**
*For any* two vendors in different regions selling the same crop, the advisory recommendations should differ based on regional market data.
**Validates: Requirements 10.7**

**Property 59: Seasonal Guidance Timing**
*For any* crop with defined planting or harvest seasons, vendors should receive proactive guidance as those periods approach.
**Validates: Requirements 10.8**

### Mobile and Responsive Interface Properties

**Property 60: Poor Connectivity Cached Content**
*For any* user with poor network connectivity, the system should display cached content rather than failing to load.
**Validates: Requirements 11.4**

**Property 61: Offline Listing Access**
*For any* saved listing, users should be able to view it even when offline.
**Validates: Requirements 11.5**

**Property 62: UI Language Preference Application**
*For any* user, when the UI loads, all content should be displayed in the user's preferred language.
**Validates: Requirements 11.6**

### Search and Discovery Properties

**Property 63: Search Criteria Matching**
*For any* search with specified criteria (crop type, location, quality tier, price range), all returned listings should match ALL specified criteria.
**Validates: Requirements 12.1**

**Property 64: Multilingual Search Equivalence**
*For any* search query, searching in different supported languages for the same crop should return equivalent results.
**Validates: Requirements 12.2**

**Property 65: Search Result Sorting**
*For any* search with a specified sort preference (price, distance, trust_score, relevance), results should be correctly ordered by that criterion.
**Validates: Requirements 12.3**

**Property 66: Search Result Completeness**
*For any* search result listing, it should include crop name, vendor name, price, quality tier, distance, and trust score.
**Validates: Requirements 12.4**

**Property 67: Real-Time Filter Updates**
*For any* applied filter change, the search results should update to reflect the new filter without requiring a page reload.
**Validates: Requirements 12.5**

**Property 68: Recent Search Persistence**
*For any* search performed by a user, it should be saved and retrievable from recent searches.
**Validates: Requirements 12.6**

**Property 69: Alternative Suggestions on No Results**
*For any* search query that returns no results, the system should provide alternative suggestions or similar crops.
**Validates: Requirements 12.7**

**Property 70: Voice Search Integration**
*For any* voice-based search query, the system should produce the same search results as an equivalent text-based query.
**Validates: Requirements 12.8**

### Messaging Properties

**Property 71: Message Thread Creation on Contact**
*For any* buyer contacting a vendor about a listing, the system should create a message thread associated with that listing.
**Validates: Requirements 13.1**

**Property 72: Message Translation Between Languages**
*For any* message sent in one language to a recipient with a different language preference, the message should be automatically translated.
**Validates: Requirements 13.2**

**Property 73: Real-Time Message Delivery**
*For any* message sent when both parties are online, the message should be delivered in real-time (within seconds).
**Validates: Requirements 13.3**

**Property 74: Offline Message Queuing**
*For any* message sent to an offline user, the message should be queued and delivered when the user comes online, with a push notification sent.
**Validates: Requirements 13.4**

**Property 75: Message Persistence with Timestamp**
*For any* sent message, it should be stored in the database with a timestamp and sender identification.
**Validates: Requirements 13.6**

**Property 76: Image Sharing in Messages**
*For any* image shared in a message thread, the image should be stored and retrievable by both parties.
**Validates: Requirements 13.7**

**Property 77: Response Time Tracking**
*For any* vendor, the response time score should be calculated from the time differences between received messages and sent replies.
**Validates: Requirements 13.8**

**Property 78: New User Message Rate Limiting**
*For any* new user (account age < 7 days), the system should limit them to 10 messages per hour.
**Validates: Requirements 13.9**

### Transaction Management Properties

**Property 79: Transaction Creation on Negotiation Finalization**
*For any* finalized negotiation, the system should create a transaction record with the agreed price, quantity, and delivery terms.
**Validates: Requirements 14.1**

**Property 80: Transaction Status Assignment**
*For any* created transaction, it should have a valid status from: 'pending', 'confirmed', 'in_transit', 'delivered', or 'disputed'.
**Validates: Requirements 14.2**

**Property 81: Vendor Confirmation Notification and Status Update**
*For any* vendor confirming a transaction, the buyer should be notified and the transaction status should update to 'confirmed'.
**Validates: Requirements 14.3**

**Property 82: Shipment Status Update and Notification**
*For any* vendor marking goods as shipped, the transaction status should update to 'in_transit' and the buyer should be notified.
**Validates: Requirements 14.4**

**Property 83: Delivery Confirmation Triggers Rating**
*For any* buyer confirming receipt, the transaction status should update to 'delivered' and rating prompts should be triggered.
**Validates: Requirements 14.5**

**Property 84: Transaction History Filtering**
*For any* user viewing transaction history, filtering by status or date should return only transactions matching the filter criteria.
**Validates: Requirements 14.6**

**Property 85: Inventory Update on Transaction Completion**
*For any* completed transaction, the vendor's listing quantity should be reduced by the transaction quantity.
**Validates: Requirements 14.7**

**Property 86: Transaction Summary Generation**
*For any* transaction, the system should be able to generate a summary including all key details for accounting purposes.
**Validates: Requirements 14.8**

### Analytics Properties

**Property 87: Best-Selling Crop Identification**
*For any* vendor with multiple crop types sold, the analytics should correctly identify the crop with the highest total sales value.
**Validates: Requirements 15.3**

**Property 88: Price Comparison to Regional Average**
*For any* vendor's listing, the pricing analytics should compare the vendor's price to the calculated regional average for that crop and quality.
**Validates: Requirements 15.4**

**Property 89: Negotiation Success Rate Calculation**
*For any* vendor, the negotiation success rate should equal (accepted negotiations / total negotiations) × 100.
**Validates: Requirements 15.5**

**Property 90: Buyer Demographics Calculation**
*For any* vendor, buyer demographics should be calculated from actual transaction data including location distribution and repeat customer rates.
**Validates: Requirements 15.6**

**Property 91: CSV Export Validity**
*For any* vendor exporting transaction data, the generated CSV file should be valid and contain all transaction records with proper formatting.
**Validates: Requirements 15.8**

### Unified Voice Assistant (Kisaan Bot) Properties

**Property 92: Voice Input Capture**
*For any* user activating Kisaan Bot, the system should successfully capture audio from the device microphone.
**Validates: Requirements 16.1**

**Property 93: Audio Transcription via SARVAM**
*For any* captured audio, the system should transcribe it to text using SARVAM STT API.
**Validates: Requirements 16.2**

**Property 94: Intent Extraction via OpenRouter**
*For any* transcribed text, the system should extract user intent and parameters using OpenRouter AI.
**Validates: Requirements 16.3**

**Property 95: Intent Support Completeness**
*For any* supported intent (price_query, create_listing, make_offer, search_listings, general_help), the system should correctly identify and process it.
**Validates: Requirements 16.4**

**Property 96: User Confirmation Display**
*For any* extracted intent and parameters, the system should display them in business-friendly language for user confirmation.
**Validates: Requirements 16.5**

**Property 97: API Execution After Confirmation**
*For any* confirmed intent, the system should execute the appropriate API call with extracted parameters.
**Validates: Requirements 16.6**

**Property 98: Successful Redirection**
*For any* successful API call, the system should redirect the user to the relevant page.
**Validates: Requirements 16.7**

**Property 99: Error Handling in User Language**
*For any* failed API call, the system should explain the error in the user's language.
**Validates: Requirements 16.8**

### User Guide Properties

**Property 100: Guide Page Routing**
*For any* user navigating to the Guide page, the system should display content without routing errors.
**Validates: Requirements 17.1**

**Property 101: Automatic Guide Translation**
*For any* user with a non-English language preference, guide content should be automatically translated.
**Validates: Requirements 17.2**

**Property 102: No Manual Translation Prompts**
*For any* guide page, the system should NOT display "use google translate" messages.
**Validates: Requirements 17.3**

**Property 103: Guide Discoverability**
*For any* page in the application, users should have access to guide links (home page CTA, footer link, or floating button).
**Validates: Requirements 17.4, 17.5, 17.6**

### Login Experience Properties

**Property 104: Business Benefits Display**
*For any* user viewing the login page, at least 6 business benefits should be displayed.
**Validates: Requirements 18.1**

**Property 105: No Technical Jargon**
*For any* text on the login page, technical terms (API names, model names) should NOT be displayed.
**Validates: Requirements 18.3**

**Property 106: Farmer-Friendly Language**
*For any* feature description on the login page, language should be clear and farmer-friendly.
**Validates: Requirements 18.4**

### Modern UI Properties

**Property 107: Consistent Color Scheme**
*For any* page in the application, the color scheme should be consistent and vibrant.
**Validates: Requirements 19.1**

**Property 108: Smooth Transitions**
*For any* page navigation or state change, transitions should be smooth and animated.
**Validates: Requirements 19.2**

**Property 109: Interactive Feedback**
*For any* interactive element (button, card), hover effects should provide visual feedback.
**Validates: Requirements 19.3**

**Property 110: Loading State Indication**
*For any* data fetching operation, loading animations should be displayed.
**Validates: Requirements 19.4**

### Image Management Properties

**Property 111: Local Image Storage**
*For any* crop image, it should be stored locally in frontend/public/images/crops/.
**Validates: Requirements 20.1, 20.2**

**Property 112: Local Image Path Usage**
*For any* displayed listing, the image path should reference local storage, NOT external URLs.
**Validates: Requirements 20.3**

**Property 113: Image Fallback Handling**
*For any* missing crop image, a generic placeholder should be displayed without breaking the UI.
**Validates: Requirements 20.4**

**Property 114: Consistent Image Display**
*For any* page displaying listings (Home, Browse, Detail), images should load correctly.
**Validates: Requirements 20.5**

### Negotiations Management Properties

**Property 115: View Details Navigation**
*For any* negotiation with a "View Details" button, clicking it should navigate to the negotiation detail page.
**Validates: Requirements 21.1**

**Property 116: Withdraw Functionality**
*For any* negotiation with a "Withdraw" button, clicking it should call the API to cancel the negotiation.
**Validates: Requirements 21.2**

**Property 117: Negotiation Loading States**
*For any* negotiation data fetch, loading states should be displayed.
**Validates: Requirements 21.3**

**Property 118: Negotiation Error Handling**
*For any* negotiation API error, user-friendly error messages should be displayed.
**Validates: Requirements 21.4**


## Error Handling

### Error Categories and Handling Strategies

**1. Authentication Errors**
- **Invalid Phone Number**: Return 400 Bad Request with message "Invalid phone number format. Please use +91XXXXXXXXXX"
- **OTP Expired**: Return 401 Unauthorized with message "OTP has expired. Please request a new one"
- **OTP Retry Limit Exceeded**: Return 429 Too Many Requests with message "Maximum retry attempts exceeded. Please request a new OTP"
- **Invalid Token**: Return 401 Unauthorized with message "Invalid or expired session token"

**2. Validation Errors**
- **Missing Required Fields**: Return 400 Bad Request with specific field names missing
- **Invalid Data Types**: Return 400 Bad Request with expected vs. received type information
- **Out of Range Values**: Return 400 Bad Request with valid range information
- **Invalid Quality Tier**: Return 400 Bad Request with message "Quality tier must be 'premium', 'standard', or 'basic'"

**3. External Service Errors**
- **BHASHINI API Failure**: Log error, return cached translation if available, or return 503 Service Unavailable with message "Translation service temporarily unavailable"
- **eNAM API Failure**: Use cached price data with timestamp, log warning
- **SMS Gateway Failure**: Queue OTP for retry, log error, return 202 Accepted with message "OTP will be sent shortly"

**4. Database Errors**
- **Connection Failure**: Retry up to 3 times with exponential backoff, return 503 Service Unavailable if all retries fail
- **Constraint Violation**: Return 409 Conflict with specific constraint information
- **Record Not Found**: Return 404 Not Found with resource type and ID
- **Duplicate Entry**: Return 409 Conflict with message about existing record

**5. Business Logic Errors**
- **Insufficient Inventory**: Return 400 Bad Request with message "Requested quantity exceeds available inventory"
- **Negotiation Expired**: Return 410 Gone with message "Negotiation session has expired"
- **Unauthorized Action**: Return 403 Forbidden with message about required permissions
- **Invalid State Transition**: Return 400 Bad Request with current state and attempted transition

**6. Rate Limiting Errors**
- **Message Spam Limit**: Return 429 Too Many Requests with message "Message limit exceeded. Please try again in X minutes"
- **API Rate Limit**: Return 429 Too Many Requests with Retry-After header

### Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific_field",
      "value": "invalid_value",
      "constraint": "validation_rule"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "uuid-for-tracking"
  }
}
```

### Logging Strategy

- **Error Logs**: All errors with stack traces, request context, and user ID (if authenticated)
- **Warning Logs**: External service failures, cache usage, retry attempts
- **Info Logs**: Successful operations, state transitions, scheduled tasks
- **Debug Logs**: Detailed request/response data, algorithm decisions (disabled in production)

### Graceful Degradation

- **Voice Interface Unavailable**: Fall back to text input with on-screen keyboard
- **Translation Service Down**: Display content in default language (Hindi/English) with notice
- **Image Upload Failure**: Allow listing creation without images
- **Real-time Messaging Down**: Queue messages for delivery when service recovers
- **Analytics Service Slow**: Show cached analytics with "Last updated" timestamp


## Testing Strategy

### Overview

The Multilingual Mandi will employ a comprehensive testing strategy combining unit tests, property-based tests, integration tests, and end-to-end tests. Given the hackathon context, we prioritize testing critical business logic (pricing, negotiation, trust scores) while accepting lighter testing for UI components.

### Property-Based Testing

Property-based testing is the primary method for validating correctness properties defined in this document. We will use **fast-check** (for JavaScript/TypeScript) as our property-based testing library.

**Configuration:**
- Minimum 100 iterations per property test (to ensure comprehensive input coverage)
- Each property test must reference its design document property number
- Tag format: `// Feature: multilingual-mandi, Property N: [property description]`

**Critical Properties to Test:**
1. **Pricing Formula (Property 18)**: Generate random base prices, quality tiers, and demand adjusters; verify formula correctness
2. **Trust Score Calculation (Property 36)**: Generate random rating combinations; verify weighted formula
3. **Negotiation Expiration (Property 26)**: Generate negotiations with various timestamps; verify 24-hour expiration
4. **Search Criteria Matching (Property 63)**: Generate random search criteria and listings; verify all results match criteria
5. **Demand Adjuster Bounds (Property 19)**: Generate various market conditions; verify adjuster stays in [0.8, 1.3]
6. **Round-Trip Properties**: Test all data persistence operations (listings, profiles, messages) for round-trip consistency

**Example Property Test:**
```javascript
// Feature: multilingual-mandi, Property 18: Pricing Formula Correctness
test('pricing formula calculates correctly for all inputs', () => {
  fc.assert(
    fc.property(
      fc.float({min: 1, max: 10000}), // base price
      fc.constantFrom('premium', 'standard', 'basic'), // quality tier
      fc.float({min: 0.8, max: 1.3}), // demand adjuster
      (basePrice, qualityTier, demandAdjuster) => {
        const qualityMultipliers = {premium: 1.2, standard: 1.0, basic: 0.85};
        const expected = basePrice * qualityMultipliers[qualityTier] * demandAdjuster;
        const result = calculateFinalPrice(basePrice, qualityTier, demandAdjuster);
        return Math.abs(result - expected) < 0.01; // floating point tolerance
      }
    ),
    {numRuns: 100}
  );
});
```

### Unit Testing

Unit tests complement property-based tests by focusing on specific examples, edge cases, and error conditions.

**Testing Framework:** Jest (for JavaScript/TypeScript)

**Unit Test Focus Areas:**
1. **Edge Cases**: Empty inputs, boundary values, null/undefined handling
2. **Error Conditions**: Invalid inputs, constraint violations, unauthorized access
3. **Specific Examples**: Known good/bad inputs with expected outputs
4. **Mock Integration Points**: External API calls (BHASHINI, eNAM)

**Balance Principle:**
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples that demonstrate correct behavior
- Use unit tests for integration points and error handling

**Example Unit Tests:**
```javascript
describe('PricingCalculator', () => {
  test('premium quality tier applies 1.2 multiplier', () => {
    const result = calculateFinalPrice(100, 'premium', 1.0);
    expect(result).toBe(120);
  });

  test('rejects invalid quality tier', () => {
    expect(() => calculateFinalPrice(100, 'invalid', 1.0))
      .toThrow('Invalid quality tier');
  });

  test('handles zero base price', () => {
    const result = calculateFinalPrice(0, 'standard', 1.0);
    expect(result).toBe(0);
  });
});
```

### Integration Testing

Integration tests verify that components work together correctly, particularly at service boundaries.

**Focus Areas:**
1. **API Endpoints**: Test complete request/response cycles
2. **Database Operations**: Test CRUD operations with real database (test instance)
3. **External Service Integration**: Test with mocked external APIs
4. **Authentication Flow**: Test OTP generation, verification, and session management
5. **Negotiation Workflow**: Test complete negotiation from offer to transaction

**Tools:**
- Supertest for API endpoint testing
- Test database instance (SQLite in-memory for speed)
- Nock for mocking external HTTP requests

**Example Integration Test:**
```javascript
describe('Negotiation API', () => {
  test('complete negotiation flow creates transaction', async () => {
    // Create listing
    const listing = await createTestListing();
    
    // Buyer makes offer
    const negotiation = await request(app)
      .post('/api/negotiations')
      .send({listingId: listing.id, offer: 90})
      .expect(201);
    
    // Vendor accepts
    const transaction = await request(app)
      .post(`/api/negotiations/${negotiation.body.id}/accept`)
      .send({userId: listing.vendorId})
      .expect(200);
    
    expect(transaction.body.agreedPrice).toBe(90);
    expect(transaction.body.status).toBe('pending');
  });
});
```

### End-to-End Testing

For the hackathon, E2E testing will be minimal and manual, focusing on critical user journeys.

**Critical Journeys to Test Manually:**
1. **Vendor Journey**: Register → Create listing → Receive offer → Negotiate → Accept → Complete transaction
2. **Buyer Journey**: Register → Search listings → Make offer → Negotiate → Accept → Rate vendor
3. **Voice Query**: Speak query → Receive audio response in same language
4. **Dispute Flow**: Raise dispute → Submit evidence → Receive resolution

**Tools (if time permits):**
- Playwright or Cypress for automated E2E tests
- Focus on happy path scenarios only

### Test Coverage Goals

Given hackathon constraints, we aim for:
- **Critical Business Logic**: 90%+ coverage (pricing, negotiation, trust scores)
- **API Endpoints**: 80%+ coverage
- **Service Layer**: 75%+ coverage
- **UI Components**: 50%+ coverage (focus on critical interactions)
- **Overall**: 70%+ coverage

### Testing Priorities for Hackathon

**TIER 1 (Must Test):**
1. Pricing formula correctness (Property 18, 19, 21)
2. Trust score calculation (Property 36)
3. Negotiation expiration (Property 26)
4. Search criteria matching (Property 63)
5. Authentication flow (Properties 1-6)

**TIER 2 (Should Test):**
6. Round-trip properties for data persistence
7. Message translation and delivery
8. Dispute resolution logic
9. Inventory updates on transactions
10. Rate limiting

**TIER 3 (Nice to Have):**
11. Analytics calculations
12. Advisory service notifications
13. Vendor discovery algorithms
14. UI component interactions

### Continuous Integration

**Pre-commit Hooks:**
- Run linter (ESLint)
- Run unit tests for changed files
- Check code formatting (Prettier)

**CI Pipeline (GitHub Actions or similar):**
1. Install dependencies
2. Run linter
3. Run all unit tests
4. Run property-based tests
5. Run integration tests
6. Generate coverage report
7. Build Docker image (if tests pass)

### Test Data Management

**Test Fixtures:**
- Predefined users (vendors and buyers)
- Sample listings across all quality tiers
- Sample negotiations in various states
- Sample transactions with ratings

**Data Generation:**
- Use faker.js for generating realistic test data
- Use fast-check generators for property-based tests
- Reset test database before each integration test suite

### Mocking Strategy

**External Services to Mock:**
1. **BHASHINI API**: Mock with predefined translations and voice responses
2. **eNAM API**: Mock with sample price data for common crops
3. **SMS Gateway**: Mock OTP sending, log to console in test mode
4. **File Storage**: Use local filesystem or in-memory storage for test images

**Mock Implementation:**
- Use dependency injection to swap real services with mocks
- Create mock factories for consistent test data
- Verify mock interactions in integration tests

