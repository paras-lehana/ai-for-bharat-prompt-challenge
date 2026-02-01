# Design Document: The Multilingual Mandi

## Overview

The Multilingual Mandi is a comprehensive full-stack web application that bridges the language gap in agricultural trading across India, serving 146 million farmers with particular focus on the 85% who don't use digital platforms due to language barriers. The system consists of a React-based frontend with modern UI/UX, Node.js/Express backend, SQLite/PostgreSQL database, and integrations with SARVAM AI for multilingual voice and text processing, plus eNAM APIs for market data.

The architecture follows a three-tier model with clear separation between presentation (React UI), business logic (Express API), and data persistence (SQL database). The system emphasizes mobile-first design, offline capability, voice-first interactions through the unified Kisaan Bot assistant, and modern engaging user interfaces to serve users with varying literacy levels.

**Core Problem Addressed**: 85% of India's 146 million farmers don't use digital trading platforms due to language barriers, lack of negotiation support, and trust deficits in existing systems like eNAM.

**Solution Approach**: Enhancement rather than replacement of existing platforms through:
- Voice-first interface in 6+ local languages (Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)
- AI-assisted peer-to-peer negotiation (not auction-based)
- Transparent quality-based pricing formulas
- Direct peer discovery and micro-aggregation capabilities
- Comprehensive trust system with objective metrics
- Seamless integration with government platforms (eNAM, ODOP, GeM)

Key design principles:
- **Voice-first**: Unified Kisaan Bot handles all major tasks through natural conversation
- **Language-inclusive**: Every interaction supports 6+ local languages with automatic translation
- **Transparent**: All pricing formulas and trust algorithms are explainable and visible
- **Trust-building**: Objective metrics, dispute resolution, and peer discovery
- **Modern & Engaging**: Vibrant UI with animations, smooth transitions, and visual feedback
- **Business-focused**: Clear value propositions and farmer-friendly language throughout
- **Progressive enhancement**: Works on basic devices, better on modern ones
- **Accessible**: Comprehensive user guide, discoverable help, and error-free navigation
- **Enhancement-focused**: Improves access to existing platforms rather than competing

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ React Web UI │  │ Kisaan Bot   │  │ PWA Offline  │       │
│  │ (Tailwind)   │  │ Voice Assist │  │ Storage      │       │
│  │ Modern UI    │  │ (Unified)    │  │ Guide System │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js REST API Server                   │   │
│  │  - Authentication Middleware (JWT + OTP)             │   │
│  │  - Rate Limiting & Spam Prevention                   │   │
│  │  - Request Validation                                │   │
│  │  - Error Handling & Logging                          │   │
│  │  - CORS Configuration                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Negotiation  │  │ Pricing      │  │ Trust        │       │
│  │ Engine       │  │ Calculator   │  │ System       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Discovery    │  │ Advisory     │  │ Messaging    │       │
│  │ Service      │  │ Service      │  │ Service      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Kisaan Bot   │  │ Guide        │  │ Analytics    │       │
│  │ AI Service   │  │ Service      │  │ Service      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Image        │  │ UI           │  │ Integration  │       │
│  │ Management   │  │ Enhancement  │  │ Layer        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite (MVP) / PostgreSQL (Production)              │   │
│  │  - Users, Listings, Transactions, Messages           │   │
│  │  - Negotiations, Ratings, Disputes                   │   │
│  │  - Guide Content, Voice Logs, Analytics              │   │
│  │  - Translation Cache, Image Metadata                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ SARVAM AI    │  │ OpenRouter   │  │ eNAM API     │       │
│  │ STT/TTS      │  │ Intent AI    │  │ (Mocked)     │       │
│  │ Translation  │  │ NLP          │  │ Price Data   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Google       │  │ SMS/OTP      │  │ Local Image  │       │
│  │ Translate    │  │ Gateway      │  │ Storage      │       │
│  │ (Fallback)   │  │ (Phone Auth) │  │ (Frontend)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18+ with functional components and hooks
- Tailwind CSS for responsive styling and modern UI
- React Router DOM for navigation
- Axios for API communication with interceptors
- Web Speech API for voice input (with SARVAM fallback)
- Service Workers for PWA offline capability
- LocalStorage for caching and offline data
- React Icons for consistent iconography
- React Markdown for guide content rendering

**Backend:**
- Node.js 18+ with Express.js framework
- JWT for authentication and session management
- Sequelize ORM for database abstraction
- Multer for file uploads and image handling
- Node-cron for scheduled tasks (advisory notifications)
- Winston for comprehensive logging
- Rate limiting middleware for spam prevention
- CORS configuration for cross-origin requests

**Database:**
- SQLite for MVP/development (single file, easy deployment)
- PostgreSQL for production (better concurrency, scalability)
- 14 main tables with proper indexing and relationships
- Translation caching for performance optimization
- Analytics data caching for dashboard performance

**External APIs:**
- SARVAM AI for speech-to-text, text-to-speech, and translation
- OpenRouter AI for intent extraction and natural language processing
- Google Translate API as fallback for translation services
- eNAM API (mocked initially) for market price data
- SMS gateway for OTP delivery and notifications

**Deployment:**
- Docker for containerization
- Docker Compose for local development
- Vercel for frontend hosting
- Render/Railway for backend hosting
- Environment-based configuration
- Local image storage in frontend/public/images/crops/

## Components and Interfaces

### 1. Authentication Service

**Responsibilities:**
- Phone number validation and OTP generation
- OTP verification with 3-retry limit and 5-minute expiration
- JWT token generation and validation
- User profile management with role selection
- Language preference persistence

**Interface:**
```typescript
interface AuthService {
  sendOTP(phoneNumber: string): Promise<{success: boolean, expiresAt: Date}>
  verifyOTP(phoneNumber: string, otp: string): Promise<{token: string, user: User}>
  validateToken(token: string): Promise<User>
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<User>
  checkRetryLimit(phoneNumber: string): Promise<{attemptsRemaining: number}>
}

interface User {
  id: string
  phoneNumber: string
  role: 'vendor' | 'buyer'
  languagePreference: string
  name?: string
  location?: Location
  createdAt: Date
  updatedAt: Date
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
- Speech-to-text conversion via SARVAM API
- Text-to-speech conversion via SARVAM API
- Language detection and translation
- Query parsing and intent extraction
- Support for 6+ local languages (Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)

**Interface:**
```typescript
interface VoiceService {
  transcribeAudio(audioBlob: Blob, language: string): Promise<string>
  synthesizeSpeech(text: string, language: string): Promise<Blob>
  translateText(text: string, fromLang: string, toLang: string): Promise<string>
  parseQuery(text: string, language: string): Promise<QueryIntent>
  getSupportedLanguages(): string[]
  detectLanguage(text: string): Promise<string>
}

interface QueryIntent {
  type: 'price_query' | 'listing_search' | 'help'
  cropName?: string
  location?: string
  parameters: Record<string, any>
  confidence: number
}
```

### 3. Listing Service

**Responsibilities:**
- CRUD operations for product listings
- Image upload and local storage management
- Quality tier assignment and validation
- Listing search and filtering with multilingual support
- Availability management and status updates
- Price calculation integration

**Interface:**
```typescript
interface ListingService {
  createListing(vendorId: string, data: ListingInput): Promise<Listing>
  updateListing(listingId: string, updates: Partial<ListingInput>): Promise<Listing>
  deleteListing(listingId: string): Promise<void>
  getListing(listingId: string): Promise<Listing>
  searchListings(criteria: SearchCriteria): Promise<Listing[]>
  updateAvailability(listingId: string, available: boolean): Promise<Listing>
  getVendorActiveListings(vendorId: string): Promise<Listing[]>
  validateRequiredFields(data: ListingInput): ValidationResult
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
  language?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}
```

### 4. Pricing Calculator Service

**Responsibilities:**
- Calculate final prices using transparent formula: Final_Price = Base_Price × Quality_Multiplier × Demand_Adjuster
- Determine quality multipliers (Premium: 1.2, Standard: 1.0, Basic: 0.85)
- Calculate demand adjusters with bounds (0.8 - 1.3)
- Provide complete price breakdowns with explanations
- Real-time price recalculation on component changes

**Interface:**
```typescript
interface PricingService {
  calculateFinalPrice(basePrice: number, qualityTier: string, cropType: string, location: Location): Promise<PriceResult>
  getQualityMultiplier(qualityTier: string): number
  getDemandAdjuster(cropType: string, location: Location): Promise<number>
  getPriceBreakdown(listingId: string): Promise<PriceBreakdown>
  recalculatePrice(listingId: string): Promise<PriceResult>
  validatePricingBounds(demandAdjuster: number): boolean
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
  formula: string
}
```

### 5. Negotiation Engine Service

**Responsibilities:**
- Create and manage 24-hour negotiation sessions
- Analyze offers and suggest counter-offers with reasoning
- Track negotiation history and multiple rounds
- Handle session expiration and notifications
- Finalize agreements and create transactions
- Consider regional pricing variations

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
  getUserNegotiations(userId: string): Promise<Negotiation[]>
  withdrawNegotiation(negotiationId: string, userId: string): Promise<void>
}

interface Negotiation {
  id: string
  listingId: string
  buyerId: string
  vendorId: string
  status: 'active' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
  offers: Offer[]
  createdAt: Date
  expiresAt: Date
  timeRemaining: number
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
    qualityTier: string
  }
}
```

### 6. Discovery Service

**Responsibilities:**
- Find nearby vendors with similar products within 50km radius
- Calculate distances between vendors
- Identify micro-aggregation opportunities
- Manage vendor collaborations and combined listings
- Calculate weighted average pricing for aggregations
- Handle proportional payment distribution

**Interface:**
```typescript
interface DiscoveryService {
  findNearbyVendors(cropType: string, location: Location, radiusKm: number): Promise<VendorMatch[]>
  identifyAggregationOpportunities(listingId: string): Promise<AggregationSuggestion[]>
  createAggregatedListing(vendorIds: string[], listingDetails: AggregatedListingInput): Promise<AggregatedListing>
  calculateCombinedPricing(listings: Listing[]): Promise<number>
  getVendorContactInfo(vendorId: string): Promise<VendorContact>
  suggestBulkOrderAggregation(orderId: string): Promise<AggregationSuggestion[]>
}

interface VendorMatch {
  vendorId: string
  vendorName: string
  listing: Listing
  distanceKm: number
  trustScore: number
  contactInfo: VendorContact
}

interface VendorContact {
  name: string
  phoneNumber: string
  location: Location
  preferredLanguage: string
}

interface AggregationSuggestion {
  vendors: VendorMatch[]
  combinedQuantity: number
  weightedPrice: number
  potentialBuyers: string[]
  estimatedSavings: number
}

interface AggregatedListing extends Listing {
  participatingVendors: {
    vendorId: string
    quantity: number
    contribution: number
    paymentShare: number
  }[]
}
```

### 7. Trust System Service

**Responsibilities:**
- Calculate trust scores using formula: 40% delivery + 30% quality + 20% response + 10% fair pricing
- Manage ratings and reviews with 1-5 star system
- Award badges (Trusted Vendor: 4.5+ score, 20+ transactions; Verified Seller: 4.0+ score, 50+ transactions)
- Handle dispute creation and AI-powered resolution
- Monitor vendor performance and flag low-trust accounts
- Track response times automatically

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
  flagLowTrustAccount(vendorId: string): Promise<void>
  trackResponseTime(vendorId: string, responseTimeMs: number): Promise<void>
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
  deliveryRating: number // 1-5 stars
  qualityRating: number  // 1-5 stars
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
  resolutionDeadline: Date
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
  factors: {
    deliveryProof: boolean
    qualityEvidence: boolean
    communicationLogs: boolean
    pastBehavior: string
  }
}

interface Reputation {
  trustScore: TrustScore
  badges: string[]
  totalTransactions: number
  disputeRate: number
  responseTimeAvg: number
  flagged: boolean
}
```

### 8. Integration Layer Service

**Responsibilities:**
- Fetch live market prices from eNAM API with caching
- Provide GeM documentation assistance in local languages
- Sync transaction data with eNAM (opt-in)
- Handle ODOP product identification and badging
- Manage API failures with cached data fallback

**Interface:**
```typescript
interface IntegrationService {
  fetchENAMPrices(cropType: string, mandiLocation?: string): Promise<ENAMPrice[]>
  getCachedPrice(cropType: string, mandiLocation: string): Promise<ENAMPrice | null>
  getGeMDocumentationGuide(language: string): Promise<DocumentGuide>
  syncTransactionToENAM(transactionId: string): Promise<void>
  identifyODOPProduct(cropType: string, location: Location): Promise<boolean>
  handleAPIFailure(service: string, fallbackData: any): Promise<any>
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
  freshness: 'fresh' | 'stale'
}

interface DocumentGuide {
  steps: DocumentStep[]
  requiredDocuments: string[]
  language: string
  estimatedTime: string
}

interface DocumentStep {
  stepNumber: number
  title: string
  description: string
  helpText: string
  requiredDocuments: string[]
}
```

### 9. Advisory Service

**Responsibilities:**
- Analyze market trends and generate personalized insights
- Send notifications for significant market changes in user's language
- Provide weekly market summaries via SMS/app notifications
- Generate seasonal guidance based on market forecasts
- Consider regional variations and local mandi data

**Interface:**
```typescript
interface AdvisoryService {
  generateMarketInsights(vendorId: string): Promise<MarketInsight[]>
  sendPriceAlert(vendorId: string, cropType: string, priceChange: number): Promise<void>
  getWeeklyReport(vendorId: string): Promise<WeeklyReport>
  getSeasonalGuidance(cropType: string, location: Location): Promise<SeasonalAdvice>
  analyzeMarketConditions(): Promise<MarketCondition[]>
  sendProactiveGuidance(vendorId: string, season: string): Promise<void>
}

interface MarketInsight {
  type: 'price_increase' | 'high_demand' | 'price_drop' | 'seasonal_trend'
  cropType: string
  message: string
  data: {
    currentPrice: number
    historicalAverage: number
    changePercent: number
    regionalVariation: number
  }
  actionable: boolean
  recommendation?: string
  language: string
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
  language: string
  visualCharts: ChartData[]
}

interface SeasonalAdvice {
  cropType: string
  currentSeason: string
  plantingWindow?: {start: Date, end: Date}
  harvestWindow?: {start: Date, end: Date}
  expectedDemand: 'high' | 'medium' | 'low'
  priceForecasts: {month: string, expectedPrice: number}[]
  marketForecast: string
}

interface MarketCondition {
  cropType: string
  condition: 'high_demand' | 'price_drop' | 'seasonal_change'
  severity: 'low' | 'medium' | 'high'
  affectedVendors: string[]
}

interface ChartData {
  type: 'line' | 'bar' | 'pie'
  data: any[]
  title: string
  description: string
}
```

### 10. Messaging Service

**Responsibilities:**
- Send and receive messages with automatic translation
- Track read receipts and typing indicators
- Monitor response times for trust score calculation
- Prevent spam with rate limiting (10 messages/hour for new users)
- Support image sharing within message threads
- Create listing-associated message threads

**Interface:**
```typescript
interface MessagingService {
  sendMessage(senderId: string, recipientId: string, content: MessageContent): Promise<Message>
  getThread(userId1: string, userId2: string, listingId?: string): Promise<Message[]>
  markAsRead(messageId: string, userId: string): Promise<void>
  translateMessage(messageId: string, targetLanguage: string): Promise<string>
  getResponseTime(vendorId: string): Promise<number>
  checkSpamLimit(userId: string): Promise<boolean>
  createListingThread(buyerId: string, vendorId: string, listingId: string): Promise<string>
  sendRealTimeMessage(message: Message): Promise<void>
  queueOfflineMessage(message: Message): Promise<void>
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
  deliveryStatus: 'sent' | 'delivered' | 'read'
}
```

### 11. Unified Voice Assistant Service (Kisaan Bot)

**Responsibilities:**
- Capture and process voice input from users
- Transcribe audio using SARVAM STT API
- Extract intent and parameters using OpenRouter AI
- Execute appropriate API calls based on extracted intent
- Provide user-friendly confirmations and error messages
- Handle microphone permissions and errors gracefully
- Support all major platform functions through voice
- Provide detailed logging for debugging

**Interface:**
```typescript
interface KisaanBotService {
  captureVoiceInput(): Promise<Blob>
  transcribeAudio(audioBlob: Blob, language: string): Promise<string>
  extractIntent(transcribedText: string, language: string): Promise<VoiceIntent>
  executeIntent(intent: VoiceIntent, userId: string): Promise<IntentResult>
  formatConfirmation(intent: VoiceIntent, language: string): Promise<string>
  handleError(error: Error, language: string): Promise<string>
  logVoiceInteraction(userId: string, intent: VoiceIntent, result: IntentResult): Promise<void>
  handleMicrophonePermission(): Promise<boolean>
  getSupportedIntents(): string[]
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
  language: string
}

interface IntentResult {
  success: boolean
  data?: any
  redirectUrl?: string
  errorMessage?: string
  apiCallsMade: string[]
  executionTime: number
}
```

### 12. Guide Service

**Responsibilities:**
- Serve comprehensive guide content to users
- Automatically translate guide content based on user language preference
- Cache translations for performance optimization
- Organize guide content into discoverable sections (Getting Started, Features, Troubleshooting)
- Ensure error-free navigation to guide pages
- Provide guide highlights and call-to-actions

**Interface:**
```typescript
interface GuideService {
  getGuideContent(section: string, language: string): Promise<GuideContent>
  translateGuide(content: string, targetLanguage: string): Promise<string>
  getCachedTranslation(section: string, language: string): Promise<string | null>
  getAllSections(): Promise<GuideSection[]>
  validateGuideRouting(): Promise<boolean>
  getGuideHighlights(language: string): Promise<GuideHighlight[]>
  organizeContentSections(): Promise<GuideOrganization>
}

interface GuideContent {
  section: string
  title: string
  content: string
  language: string
  lastUpdated: Date
  subsections?: GuideSection[]
}

interface GuideSection {
  id: string
  title: string
  order: number
  description?: string
  subsections?: GuideSection[]
}

interface GuideHighlight {
  title: string
  description: string
  icon: string
  section: string
  callToAction: string
}

interface GuideOrganization {
  gettingStarted: GuideSection[]
  features: GuideSection[]
  troubleshooting: GuideSection[]
}
```

### 13. UI Enhancement Service

**Responsibilities:**
- Manage modern UI components and animations
- Handle loading states and smooth transitions
- Provide consistent visual feedback for user interactions
- Manage vibrant, farmer-friendly color schemes
- Handle image loading and fallback mechanisms
- Ensure accessibility compliance (contrast ratios, focus indicators)
- Support mobile-optimized layouts and touch interactions

**Interface:**
```typescript
interface UIEnhancementService {
  getColorScheme(): ColorScheme
  generateLoadingAnimation(type: string): AnimationConfig
  createTransition(fromState: string, toState: string): TransitionConfig
  handleImageFallback(imagePath: string): string
  validateAccessibility(component: UIComponent): AccessibilityReport
  getHoverEffects(elementType: string): EffectConfig
  optimizeForMobile(component: UIComponent): UIComponent
  ensureTouchTargetSize(element: UIElement): boolean
}

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  success: string
  warning: string
  error: string
  farmerFriendly: boolean
}

interface AnimationConfig {
  type: 'spinner' | 'pulse' | 'fade' | 'slide'
  duration: number
  easing: string
  smooth: boolean
}

interface TransitionConfig {
  duration: number
  timing: string
  properties: string[]
  smooth: boolean
}

interface AccessibilityReport {
  contrastRatio: number
  focusIndicators: boolean
  keyboardNavigation: boolean
  screenReaderCompatible: boolean
  touchTargetSize: boolean
  issues: string[]
}

interface UIComponent {
  type: string
  properties: Record<string, any>
  accessibility: AccessibilityReport
}

interface UIElement {
  width: number
  height: number
  interactive: boolean
}

interface EffectConfig {
  hover: boolean
  focus: boolean
  active: boolean
  transition: TransitionConfig
}
```

### 14. Image Management Service

**Responsibilities:**
- Store and serve crop images locally from frontend/public/images/crops/
- Handle image fallbacks for missing images with generic placeholders
- Ensure consistent image display across all pages (Home, Browse Listings, Listing Detail)
- Manage image optimization and loading
- Update seed data with correct local image paths
- Support all major crops (wheat, rice, maize, cotton, groundnut, sugarcane, soybean, onion, potato, tomato)

**Interface:**
```typescript
interface ImageManagementService {
  getLocalImagePath(cropType: string): string
  validateImageExists(imagePath: string): boolean
  getPlaceholderImage(): string
  optimizeImage(imagePath: string, dimensions: ImageDimensions): Promise<string>
  updateSeedDataImagePaths(): Promise<void>
  preloadCriticalImages(): Promise<void>
  handleImageLoadError(imagePath: string): string
  ensureMajorCropImages(): Promise<boolean>
  validateImageConsistency(): Promise<ImageValidationReport>
}

interface ImageDimensions {
  width: number
  height: number
  quality?: number
}

interface ImageValidationReport {
  missingImages: string[]
  brokenPaths: string[]
  seedDataInconsistencies: string[]
  allMajorCropsPresent: boolean
}
```

### 15. Analytics Service

**Responsibilities:**
- Generate vendor dashboards with sales metrics and trust scores
- Calculate best-selling crops and most profitable quality tiers
- Compare vendor prices to regional averages
- Track negotiation success rates and discount percentages
- Provide buyer demographics and repeat customer analysis
- Export transaction data in CSV format
- Cache analytics data for performance

**Interface:**
```typescript
interface AnalyticsService {
  generateVendorDashboard(vendorId: string): Promise<VendorDashboard>
  calculateBestSellingCrops(vendorId: string): Promise<CropAnalysis[]>
  comparePricesToRegionalAverage(vendorId: string): Promise<PriceComparison[]>
  calculateNegotiationMetrics(vendorId: string): Promise<NegotiationMetrics>
  getBuyerDemographics(vendorId: string): Promise<BuyerDemographics>
  exportTransactionData(vendorId: string, format: 'csv' | 'json'): Promise<string>
  generateSalesTrends(vendorId: string, period: string): Promise<TrendData>
  cacheAnalyticsData(vendorId: string, data: any): Promise<void>
}

interface VendorDashboard {
  totalSales: number
  activeListings: number
  pendingNegotiations: number
  trustScore: TrustScore
  salesTrends: TrendData
  recentActivity: ActivityItem[]
}

interface CropAnalysis {
  cropType: string
  totalSales: number
  averagePrice: number
  transactionCount: number
  profitability: number
}

interface PriceComparison {
  cropType: string
  vendorPrice: number
  regionalAverage: number
  difference: number
  percentageDifference: number
}

interface NegotiationMetrics {
  successRate: number
  averageDiscount: number
  totalNegotiations: number
  acceptedOffers: number
  averageNegotiationTime: number
}

interface BuyerDemographics {
  locationDistribution: {location: string, count: number}[]
  repeatCustomerRate: number
  averageOrderValue: number
  topBuyers: {buyerId: string, totalPurchases: number}[]
}

interface TrendData {
  period: string
  data: {date: string, value: number}[]
  trend: 'increasing' | 'decreasing' | 'stable'
}

interface ActivityItem {
  type: string
  description: string
  timestamp: Date
  importance: 'high' | 'medium' | 'low'
}
```

## Data Models

### Database Schema

The database consists of 14 main tables designed to support all platform functionality with proper indexing and relationships. The schema supports both SQLite (MVP) and PostgreSQL (production) with Sequelize ORM abstraction.

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
CREATE INDEX idx_users_language ON users(language_preference);
```

**OTP Table:**
```sql
CREATE TABLE otps (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  retry_count INTEGER DEFAULT 0,
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
  images TEXT, -- JSON array of local image paths
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
CREATE INDEX idx_listings_quality ON listings(quality_tier);
CREATE INDEX idx_listings_price ON listings(final_price);
```

**Negotiations Table:**
```sql
CREATE TABLE negotiations (
  id VARCHAR(36) PRIMARY KEY,
  listing_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  vendor_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'expired', 'withdrawn')),
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
CREATE INDEX idx_offers_type ON offers(offer_type);
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
CREATE INDEX idx_transactions_created ON transactions(created_at);
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
  flagged BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES users(id)
);

CREATE INDEX idx_trust_vendor ON trust_scores(vendor_id);
CREATE INDEX idx_trust_overall ON trust_scores(overall_score);
CREATE INDEX idx_trust_flagged ON trust_scores(flagged);
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
  evidence_deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (initiator_id) REFERENCES users(id),
  FOREIGN KEY (respondent_id) REFERENCES users(id)
);

CREATE INDEX idx_disputes_transaction ON disputes(transaction_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_deadline ON disputes(evidence_deadline);
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
CREATE INDEX idx_evidence_type ON evidence(evidence_type);
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
  delivery_status VARCHAR(20) DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'read')),
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
CREATE INDEX idx_messages_status ON messages(delivery_status);
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
  source VARCHAR(20) DEFAULT 'enam_api' CHECK (source IN ('enam_api', 'cached')),
  freshness VARCHAR(10) DEFAULT 'fresh' CHECK (freshness IN ('fresh', 'stale')),
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_enam_crop ON enam_prices(crop_type);
CREATE INDEX idx_enam_location ON enam_prices(mandi_location);
CREATE INDEX idx_enam_expires ON enam_prices(expires_at);
CREATE INDEX idx_enam_source ON enam_prices(source);
```

**Voice Interaction Logs Table:**
```sql
CREATE TABLE voice_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  raw_audio_path VARCHAR(500),
  transcribed_text TEXT,
  detected_language VARCHAR(10),
  extracted_intent VARCHAR(50),
  intent_parameters TEXT, -- JSON
  confidence_score DECIMAL(4, 3),
  api_calls_made TEXT, -- JSON array
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  response_time_ms INTEGER,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_voice_user ON voice_logs(user_id);
CREATE INDEX idx_voice_intent ON voice_logs(extracted_intent);
CREATE INDEX idx_voice_created ON voice_logs(created_at);
CREATE INDEX idx_voice_success ON voice_logs(success);
```

**Guide Content Table:**
```sql
CREATE TABLE guide_content (
  id VARCHAR(36) PRIMARY KEY,
  section_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(10) NOT NULL,
  order_index INTEGER DEFAULT 0,
  parent_section VARCHAR(100),
  section_type VARCHAR(20) DEFAULT 'content' CHECK (section_type IN ('getting_started', 'features', 'troubleshooting', 'content')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guide_section ON guide_content(section_id);
CREATE INDEX idx_guide_language ON guide_content(language);
CREATE INDEX idx_guide_parent ON guide_content(parent_section);
CREATE INDEX idx_guide_order ON guide_content(order_index);
CREATE INDEX idx_guide_type ON guide_content(section_type);
```

**Translation Cache Table:**
```sql
CREATE TABLE translation_cache (
  id VARCHAR(36) PRIMARY KEY,
  source_text_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of source text
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  translation_service VARCHAR(50) NOT NULL, -- 'google', 'sarvam'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX idx_translation_unique ON translation_cache(source_text_hash, source_language, target_language);
CREATE INDEX idx_translation_expires ON translation_cache(expires_at);
CREATE INDEX idx_translation_service ON translation_cache(translation_service);
```

**Analytics Cache Table:**
```sql
CREATE TABLE analytics_cache (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'sales_summary', 'price_trends', 'buyer_demographics'
  time_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  data TEXT NOT NULL, -- JSON
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_analytics_user ON analytics_cache(user_id);
CREATE INDEX idx_analytics_type ON analytics_cache(metric_type);
CREATE INDEX idx_analytics_expires ON analytics_cache(expires_at);
```

### Data Validation Rules

**User Data:**
- Phone numbers must match Indian format: +91XXXXXXXXXX
- Language preference must be one of: 'en', 'hi', 'mr', 'ta', 'te', 'kn', 'pa' (minimum 6 supported languages)
- Role must be either 'vendor' or 'buyer'
- Name must be non-empty string when provided
- Location coordinates must be valid latitude/longitude pairs

**Listing Data:**
- Quantity must be positive decimal
- Base price must be positive decimal
- Quality tier must be 'premium', 'standard', or 'basic'
- Quality multiplier: premium=1.2, standard=1.0, basic=0.85
- Demand adjuster must be between 0.8 and 1.3 (inclusive)
- Final price = base_price × quality_multiplier × demand_adjuster
- Images must be valid local paths in /images/crops/ directory
- Crop type must match supported crops in assets-config.json
- All required fields (crop type, quantity, unit, base price, quality tier) must be present

**Negotiation Data:**
- Expiration must be exactly 24 hours from creation
- Offers must be positive amounts
- Status transitions: active → (accepted | rejected | expired | withdrawn)
- Only buyer and vendor can participate in negotiation
- Maximum 10 offers per negotiation session

**Rating Data:**
- All ratings must be integers between 1 and 5 (inclusive)
- Ratings can only be submitted after transaction status is 'delivered'
- One rating per transaction per buyer
- Delivery and quality ratings are mandatory

**Trust Score Data:**
- All scores must be between 0.0 and 5.0
- Overall score = 0.4×delivery + 0.3×quality + 0.2×response + 0.1×fair_pricing
- Response time calculated from message timestamps
- Fair pricing score based on market price comparison
- Badges awarded based on thresholds:
  - "Trusted Vendor": overall_score ≥ 4.5 AND transaction_count ≥ 20
  - "Verified Seller": overall_score ≥ 4.0 AND transaction_count ≥ 50
- Accounts flagged when overall_score < 3.0

**Voice Interaction Data:**
- Intent must be one of: 'price_query', 'create_listing', 'make_offer', 'search_listings', 'general_help'
- Confidence score must be between 0.0 and 1.0
- Language must be supported language code
- Audio files must be in supported formats (wav, mp3, m4a)
- Transcribed text must be non-empty for successful interactions

**Message Data:**
- Text content or images must be present (not both empty)
- Original language must be valid language code
- Thread ID must be consistent for conversation
- Rate limiting: max 10 messages per hour for new users (< 7 days old)
- Image attachments must be valid image formats
- Delivery status must be valid: 'sent', 'delivered', 'read'

**Guide Content Data:**
- Section ID must be unique per language
- Content must be non-empty
- Language must be supported language code
- Order index must be non-negative integer
- Parent section must exist if specified
- Section type must be 'getting_started', 'features', or 'troubleshooting'

**Translation Cache Data:**
- Source text hash must be SHA-256 format
- Source and target languages must be different
- Translation service must be 'google' or 'sarvam'
- Expiration must be future timestamp
- Translated text must be non-empty

**Image Management Data:**
- All crop images must be stored locally in frontend/public/images/crops/
- Major crops must have images: wheat, rice, maize, cotton, groundnut, sugarcane, soybean, onion, potato, tomato
- Image paths in listings must reference local storage, not external URLs
- Missing images must fallback to generic placeholder
- Seed data must reference correct local image paths

**Transaction Management Data:**
- Status must be one of: 'pending', 'confirmed', 'in_transit', 'delivered', 'disputed'
- Agreed price must be positive
- Quantity must match negotiated amount
- Status transitions must follow logical flow: pending → confirmed → in_transit → delivered
- Inventory must be updated on transaction completion

**Analytics Data:**
- Metric types must be valid: 'sales_summary', 'price_trends', 'buyer_demographics'
- Time periods must be valid: 'daily', 'weekly', 'monthly'
- Data must be valid JSON format
- Cache expiration must be future timestamp
- User must exist in users table


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

**Property 5: Language Preference Round-Trip**
*For any* user, setting a language preference and then retrieving the user profile should return the same language preference (round-trip property).
**Validates: Requirements 1.5**

**Property 6: Profile Update Round-Trip**
*For any* valid profile update, immediately retrieving the profile should reflect all the updated fields (round-trip property).
**Validates: Requirements 1.6**

### Voice Interface Properties

**Property 7: Voice Transcription via SARVAM**
*For any* voice query in a supported language, the system should successfully transcribe the audio to text using SARVAM STT API.
**Validates: Requirements 2.1**

**Property 8: Query Parsing and Extraction**
*For any* valid voice query containing a crop name and location, the system should successfully extract both the crop name and location.
**Validates: Requirements 2.2**

**Property 9: Price Retrieval for Valid Queries**
*For any* valid crop and location combination, the system should return at least one price (from database or eNAM).
**Validates: Requirements 2.3**

**Property 10: Voice Query Language Consistency**
*For any* voice query in a supported language, the response audio should be in the same language as the input query.
**Validates: Requirements 2.4**

**Property 11: Text-to-Speech Response Generation**
*For any* generated response text, the system should convert it to speech and return audio to the user.
**Validates: Requirements 2.5**

**Property 12: Minimum Language Support**
*For any* of the minimum required languages (Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi), the system should support voice queries and responses.
**Validates: Requirements 2.6**

**Property 13: Malformed Query Clarification**
*For any* voice query that cannot be parsed, the system should request clarification in the user's language.
**Validates: Requirements 2.7**

### Listing Management Properties

**Property 14: Required Fields Validation**
*For any* listing creation attempt, if any required field (crop type, quantity, unit, base price, quality tier) is missing, the system should reject the listing.
**Validates: Requirements 3.1**

**Property 15: Image Association Round-Trip**
*For any* listing with an uploaded image, retrieving the listing should return the same image URL (round-trip property).
**Validates: Requirements 3.2**

**Property 16: AI Quality Tier Suggestion**
*For any* uploaded product photo with available quality analysis, the system should suggest a quality tier based on image analysis.
**Validates: Requirements 3.3**

**Property 17: Quality Tier Validation**
*For any* listing, the quality tier must be one of: 'premium', 'standard', or 'basic'.
**Validates: Requirements 3.4**

**Property 18: Automatic Price Calculation**
*For any* listing creation, the final price should equal base_price × quality_multiplier × demand_adjuster.
**Validates: Requirements 3.5**

**Property 19: Listing Update Round-Trip**
*For any* listing update, immediately retrieving the listing should reflect all updated fields (round-trip property).
**Validates: Requirements 3.6**

**Property 20: Unavailable Listings Exclusion from Search**
*For any* search query, listings marked as 'sold' or 'unavailable' should not appear in the search results.
**Validates: Requirements 3.7**

**Property 21: Active Listings on Vendor Profile**
*For any* vendor profile, only listings with status 'active' should be displayed.
**Validates: Requirements 3.8**

### Pricing Calculator Properties

**Property 22: Pricing Formula Correctness**
*For any* listing with base price B, quality multiplier Q, and demand adjuster D, the final price should equal B × Q × D.
**Validates: Requirements 4.1**

**Property 23: Premium Quality Multiplier**
*For any* listing with premium quality tier, the quality multiplier should be exactly 1.2.
**Validates: Requirements 4.2**

**Property 24: Standard Quality Multiplier**
*For any* listing with standard quality tier, the quality multiplier should be exactly 1.0.
**Validates: Requirements 4.3**

**Property 25: Basic Quality Multiplier**
*For any* listing with basic quality tier, the quality multiplier should be exactly 0.85.
**Validates: Requirements 4.4**

**Property 26: Demand Adjuster Calculation**
*For any* crop and location, the demand adjuster should be calculated based on recent transaction volume and seasonal patterns.
**Validates: Requirements 4.5**

**Property 27: Demand Adjuster Bounds**
*For any* listing, the demand adjuster must be between 0.8 and 1.3 (inclusive).
**Validates: Requirements 4.6**

**Property 28: Price Breakdown Completeness**
*For any* listing, the price breakdown should include base price, quality multiplier, demand adjuster, final price, and explanation text.
**Validates: Requirements 4.7**

**Property 29: Price Recalculation on Component Change**
*For any* listing, if any pricing component (base price, quality tier, or demand factors) changes, the final price should be recalculated immediately.
**Validates: Requirements 4.8**

### Negotiation Engine Properties

**Property 30: Negotiation Session Creation with 24-Hour Expiration**
*For any* initial offer on a listing, the system should create a negotiation session that expires exactly 24 hours from creation.
**Validates: Requirements 5.1**

**Property 31: Counter-Offer Suggestion for Low Offers**
*For any* buyer offer below the fair price range, the system should generate a counter-offer suggestion with reasoning.
**Validates: Requirements 5.2**

**Property 32: Counter-Offer Reasoning Generation**
*For any* generated counter-offer, the system should provide reasoning based on quality tier, recent transactions, and regional pricing.
**Validates: Requirements 5.3**

**Property 33: Vendor Counter-Offer Options**
*For any* counter-offer suggestion received by a vendor, the system should allow the vendor to accept, reject, or modify the suggestion.
**Validates: Requirements 5.4**

**Property 34: Multiple Negotiation Rounds**
*For any* negotiation session, the system should support multiple back-and-forth offers within the 24-hour window.
**Validates: Requirements 5.5**

**Property 35: Transaction Creation on Acceptance**
*For any* negotiation where either party accepts an offer, the system should create a transaction record with the agreed price.
**Validates: Requirements 5.6**

**Property 36: Negotiation Expiration After 24 Hours**
*For any* negotiation session, if 24 hours elapse without acceptance, the status should be updated to 'expired'.
**Validates: Requirements 5.7**

**Property 37: Regional Pricing Consideration**
*For any* two identical listings in different regions, the counter-offer suggestions should differ based on regional pricing data.
**Validates: Requirements 5.8**

**Property 38: Listing Status Update on Finalization**
*For any* finalized negotiation, the associated listing status should be updated to reflect reduced availability or 'sold' status.
**Validates: Requirements 5.9**

### Discovery Service Properties

**Property 39: Nearby Vendor Discovery Within Radius**
*For any* vendor viewing their listing, all vendors shown on the map should be within 50km and selling the same crop type.
**Validates: Requirements 6.1**

**Property 40: Vendor Contact Information Display**
*For any* vendor selected on the map, the system should display that vendor's contact information and listing details.
**Validates: Requirements 6.2**

**Property 41: Vendor Messaging Delivery**
*For any* message sent between vendors, the message should be delivered and stored in the message thread.
**Validates: Requirements 6.3**

**Property 42: Micro-Aggregation Opportunity Identification**
*For any* set of vendors with similar listings (same crop, similar quality, nearby location), the system should identify them as aggregation opportunities.
**Validates: Requirements 6.4**

**Property 43: Bulk Order Aggregation Suggestion**
*For any* bulk order that exceeds a single vendor's quantity, the system should suggest combining inventory from nearby vendors.
**Validates: Requirements 6.5**

**Property 44: Weighted Average Pricing for Aggregation**
*For any* aggregated listing, the combined price should be the weighted average of participating vendors' prices based on their quantity contributions.
**Validates: Requirements 6.6**

**Property 45: Combined Listing Creation on Agreement**
*For any* set of vendors agreeing to aggregate, the system should create a combined listing with all participating vendors listed.
**Validates: Requirements 6.7**

**Property 46: Proportional Payment Distribution**
*For any* aggregated order payment, each vendor should receive payment proportional to their quantity contribution.
**Validates: Requirements 6.8**

### Trust System Properties

**Property 47: Trust Score Formula Correctness**
*For any* vendor with ratings, the overall trust score should equal (0.4 × delivery_score) + (0.3 × quality_score) + (0.2 × response_score) + (0.1 × fair_pricing_score).
**Validates: Requirements 7.1**

**Property 48: Delivery Rating Prompt on Transaction Completion**
*For any* completed transaction, the system should prompt the buyer to rate delivery timeliness (1-5 stars).
**Validates: Requirements 7.2**

**Property 49: Quality Rating Prompt on Transaction Completion**
*For any* completed transaction, the system should prompt the buyer to rate product quality match (1-5 stars).
**Validates: Requirements 7.3**

**Property 50: Response Time Calculation from Messages**
*For any* vendor, the response score should be calculated automatically from message timestamp differences.
**Validates: Requirements 7.4**

**Property 51: Fair Pricing Score Calculation**
*For any* transaction, the fair pricing score should be based on comparing the final negotiated price to the market average for that crop and quality.
**Validates: Requirements 7.5**

**Property 52: Trusted Vendor Badge Award**
*For any* vendor with overall trust score ≥ 4.5 and transaction count ≥ 20, the system should award a "Trusted Vendor" badge.
**Validates: Requirements 7.6**

**Property 53: Verified Seller Badge Award**
*For any* vendor with overall trust score ≥ 4.0 and transaction count ≥ 50, the system should award a "Verified Seller" badge.
**Validates: Requirements 7.7**

**Property 54: Trust Score and Badge Display**
*For any* vendor profile or listing, the trust score and badges should be displayed prominently.
**Validates: Requirements 7.8**

**Property 55: Low Trust Score Flagging**
*For any* vendor whose trust score falls below 3.0, the system should flag the account for review.
**Validates: Requirements 7.9**

### Dispute Resolution Properties

**Property 56: Dispute Case Creation**
*For any* buyer or vendor raising a dispute on a transaction, the system should create a dispute case with all transaction details.
**Validates: Requirements 8.1**

**Property 57: Evidence Submission Notification**
*For any* newly created dispute, both parties should be notified and given 48 hours to submit evidence.
**Validates: Requirements 8.2**

**Property 58: Dispute Analysis with Evidence**
*For any* dispute with evidence from both parties, the system should analyze transaction history, messages, ratings, and submitted evidence.
**Validates: Requirements 8.3**

**Property 59: Resolution Recommendation Generation**
*For any* dispute with completed analysis, the system should generate a resolution recommendation with detailed reasoning.
**Validates: Requirements 8.4**

**Property 60: Comprehensive Factor Analysis**
*For any* dispute analysis, the system should consider delivery proof, quality evidence, communication logs, and past behavior.
**Validates: Requirements 8.5**

**Property 61: Resolution Options Availability**
*For any* dispute resolution recommendation, both parties should be able to accept or escalate to human review.
**Validates: Requirements 8.6**

**Property 62: Resolution Execution on Acceptance**
*For any* dispute resolution accepted by both parties, the system should execute the recommended action (refund, partial payment, etc.).
**Validates: Requirements 8.7**

**Property 63: Trust Score Update on Dispute Resolution**
*For any* resolved dispute, the trust scores of involved parties should be updated based on the outcome and their behavior.
**Validates: Requirements 8.8**

### Integration Layer Properties

**Property 64: eNAM Price Fetching**
*For any* supported crop type, the system should be able to fetch or retrieve cached eNAM prices.
**Validates: Requirements 9.1**

**Property 65: Price Source Indication**
*For any* displayed price, the system should indicate whether the source is 'enam_api', 'cached', or 'local_transactions'.
**Validates: Requirements 9.2**

**Property 66: Cached Data Fallback on API Failure**
*For any* eNAM API request that fails, the system should return cached data with a timestamp indicating when it was fetched.
**Validates: Requirements 9.3**

**Property 67: ODOP Badge Display**
*For any* listing of an ODOP-registered product, the system should display an ODOP badge on the listing.
**Validates: Requirements 9.4**

**Property 68: GeM Documentation Assistance**
*For any* vendor requesting GeM assistance, the system should provide AI-assisted documentation support.
**Validates: Requirements 9.5**

**Property 69: GeM Assistance Language Consistency**
*For any* vendor requesting GeM assistance, the guidance should be provided in the vendor's preferred language.
**Validates: Requirements 9.6**

**Property 70: Opt-In eNAM Data Sync**
*For any* vendor who opts in to data sharing, their transaction data should be synced with eNAM.
**Validates: Requirements 9.7**

**Property 71: eNAM Price Metadata Display**
*For any* displayed eNAM price, the system should show the mandi location and last updated timestamp.
**Validates: Requirements 9.8**

### Advisory Service Properties

**Property 72: Market Change Notification in Preferred Language**
*For any* significant market condition change, affected vendors should receive notifications in their preferred language.
**Validates: Requirements 10.1**

**Property 73: Market Data Analysis for Insights**
*For any* market insight generation, the system should analyze eNAM data, peer transactions, and seasonal patterns.
**Validates: Requirements 10.2**

**Property 74: High Demand Notification**
*For any* vendor whose crop experiences high demand, the system should send a notification with current price trends.
**Validates: Requirements 10.3**

**Property 75: Price Drop Alert**
*For any* crop price that drops below historical average, vendors selling that crop should receive an alert with context.
**Validates: Requirements 10.4**

**Property 76: Weekly Summary Language Consistency**
*For any* vendor, weekly market summaries should be delivered in the vendor's preferred language.
**Validates: Requirements 10.5**

**Property 77: Advisory Content Display Format**
*For any* vendor viewing advisory content, the information should be displayed in simple language with visual charts.
**Validates: Requirements 10.6**

**Property 78: Regional Variation in Recommendations**
*For any* two vendors in different regions selling the same crop, the advisory recommendations should differ based on regional market data.
**Validates: Requirements 10.7**

**Property 79: Seasonal Guidance Timing**
*For any* crop with defined planting or harvest seasons, vendors should receive proactive guidance as those periods approach.
**Validates: Requirements 10.8**

### Mobile and Responsive Interface Properties

**Property 80: Responsive Screen Size Support**
*For any* screen size from 320px to 1920px width, all interfaces should render responsively.
**Validates: Requirements 11.1**

**Property 81: Mobile-Optimized Layout Priority**
*For any* user accessing the platform on mobile, the system should prioritize mobile-optimized layouts and touch interactions.
**Validates: Requirements 11.2**

**Property 82: Data Usage Optimization**
*For any* page load, the system should lazy-load images and use compressed formats to minimize data usage.
**Validates: Requirements 11.3**

**Property 83: Poor Connectivity Cached Content**
*For any* user with poor network connectivity, the system should display cached content rather than failing to load.
**Validates: Requirements 11.4**

**Property 84: Offline Listing Access**
*For any* saved listing, users should be able to view it even when offline.
**Validates: Requirements 11.5**

**Property 85: UI Language Preference Application**
*For any* user, when the UI loads, all content should be displayed in the user's preferred language.
**Validates: Requirements 11.6**

**Property 86: Touch Target Size Compliance**
*For any* interactive element, the touch target should be at least 44px in size.
**Validates: Requirements 11.7**

**Property 87: Mobile Form Optimization**
*For any* form displayed on mobile, the system should use appropriate input types and validation for mobile keyboards.
**Validates: Requirements 11.8**

### Search and Discovery Properties

**Property 88: Search Criteria Matching**
*For any* search with specified criteria (crop type, location, quality tier, price range), all returned listings should match ALL specified criteria.
**Validates: Requirements 12.1**

**Property 89: Multilingual Search Equivalence**
*For any* search query, searching in different supported languages for the same crop should return equivalent results.
**Validates: Requirements 12.2**

**Property 90: Search Result Sorting**
*For any* search with a specified sort preference (price, distance, trust_score, relevance), results should be correctly ordered by that criterion.
**Validates: Requirements 12.3**

**Property 91: Search Result Completeness**
*For any* search result listing, it should include crop name, vendor name, price, quality tier, distance, and trust score.
**Validates: Requirements 12.4**

**Property 92: Real-Time Filter Updates**
*For any* applied filter change, the search results should update to reflect the new filter without requiring a page reload.
**Validates: Requirements 12.5**

**Property 93: Recent Search Persistence**
*For any* search performed by a user, it should be saved and retrievable from recent searches.
**Validates: Requirements 12.6**

**Property 94: Alternative Suggestions on No Results**
*For any* search query that returns no results, the system should provide alternative suggestions or similar crops.
**Validates: Requirements 12.7**

**Property 95: Voice Search Integration**
*For any* voice-based search query, the system should produce the same search results as an equivalent text-based query.
**Validates: Requirements 12.8**

### Messaging Properties

**Property 96: Message Thread Creation on Contact**
*For any* buyer contacting a vendor about a listing, the system should create a message thread associated with that listing.
**Validates: Requirements 13.1**

**Property 97: Message Translation Between Languages**
*For any* message sent in one language to a recipient with a different language preference, the message should be automatically translated.
**Validates: Requirements 13.2**

**Property 98: Real-Time Message Delivery**
*For any* message sent when both parties are online, the message should be delivered in real-time (within seconds).
**Validates: Requirements 13.3**

**Property 99: Offline Message Queuing**
*For any* message sent to an offline user, the message should be queued and delivered when the user comes online, with a push notification sent.
**Validates: Requirements 13.4**

**Property 100: Message Read Receipts and Typing Indicators**
*For any* message thread, the system should display read receipts and typing indicators.
**Validates: Requirements 13.5**

**Property 101: Message Persistence with Timestamp**
*For any* sent message, it should be stored in the database with a timestamp and sender identification.
**Validates: Requirements 13.6**

**Property 102: Image Sharing in Messages**
*For any* image shared in a message thread, the image should be stored and retrievable by both parties.
**Validates: Requirements 13.7**

**Property 103: Response Time Tracking**
*For any* vendor, the response time score should be calculated from the time differences between received messages and sent replies.
**Validates: Requirements 13.8**

**Property 104: New User Message Rate Limiting**
*For any* new user (account age < 7 days), the system should limit them to 10 messages per hour.
**Validates: Requirements 13.9**

### Transaction Management Properties

**Property 105: Transaction Creation on Negotiation Finalization**
*For any* finalized negotiation, the system should create a transaction record with the agreed price, quantity, and delivery terms.
**Validates: Requirements 14.1**

**Property 106: Transaction Status Assignment**
*For any* created transaction, it should have a valid status from: 'pending', 'confirmed', 'in_transit', 'delivered', or 'disputed'.
**Validates: Requirements 14.2**

**Property 107: Vendor Confirmation Notification and Status Update**
*For any* vendor confirming a transaction, the buyer should be notified and the transaction status should update to 'confirmed'.
**Validates: Requirements 14.3**

**Property 108: Shipment Status Update and Notification**
*For any* vendor marking goods as shipped, the transaction status should update to 'in_transit' and the buyer should be notified.
**Validates: Requirements 14.4**

**Property 109: Delivery Confirmation Triggers Rating**
*For any* buyer confirming receipt, the transaction status should update to 'delivered' and rating prompts should be triggered.
**Validates: Requirements 14.5**

**Property 110: Transaction History Filtering**
*For any* user viewing transaction history, filtering by status or date should return only transactions matching the filter criteria.
**Validates: Requirements 14.6**

**Property 111: Inventory Update on Transaction Completion**
*For any* completed transaction, the vendor's listing quantity should be reduced by the transaction quantity.
**Validates: Requirements 14.7**

**Property 112: Transaction Summary Generation**
*For any* transaction, the system should be able to generate a summary including all key details for accounting purposes.
**Validates: Requirements 14.8**

**Property 113: Payment Processing and Escrow**
*For any* transaction with payment gateway integration, the system should process payments and hold funds in escrow until delivery confirmation.
**Validates: Requirements 14.9**

### Analytics Properties

**Property 114: Vendor Dashboard Metrics Display**
*For any* vendor, the dashboard should display total sales, active listings, pending negotiations, and trust score.
**Validates: Requirements 15.1**

**Property 115: Sales Trends Visualization**
*For any* vendor viewing analytics, the system should show sales trends over time with visual charts.
**Validates: Requirements 15.2**

**Property 116: Best-Selling Crop Identification**
*For any* vendor with multiple crop types sold, the analytics should correctly identify the crop with the highest total sales value.
**Validates: Requirements 15.3**

**Property 117: Price Comparison to Regional Average**
*For any* vendor's listing, the pricing analytics should compare the vendor's price to the calculated regional average for that crop and quality.
**Validates: Requirements 15.4**

**Property 118: Negotiation Success Rate Calculation**
*For any* vendor, the negotiation success rate should equal (accepted negotiations / total negotiations) × 100.
**Validates: Requirements 15.5**

**Property 119: Buyer Demographics Calculation**
*For any* vendor, buyer demographics should be calculated from actual transaction data including location distribution and repeat customer rates.
**Validates: Requirements 15.6**

**Property 120: Predictive Analytics Generation**
*For any* vendor with sufficient data, the system should generate predictive insights for optimal pricing and timing.
**Validates: Requirements 15.7**

**Property 121: CSV Export Validity**
*For any* vendor exporting transaction data, the generated CSV file should be valid and contain all transaction records with proper formatting.
**Validates: Requirements 15.8**

### Unified Voice Assistant (Kisaan Bot) Properties

**Property 122: Voice Input Capture**
*For any* user activating Kisaan Bot, the system should successfully capture audio from the device microphone.
**Validates: Requirements 16.1**

**Property 123: Audio Transcription via SARVAM**
*For any* captured audio, the system should transcribe it to text using SARVAM STT API.
**Validates: Requirements 16.2**

**Property 124: Intent Extraction via OpenRouter**
*For any* transcribed text, the system should extract user intent and parameters using OpenRouter AI.
**Validates: Requirements 16.3**

**Property 125: Intent Support Completeness**
*For any* supported intent (price_query, create_listing, make_offer, search_listings, general_help), the system should correctly identify and process it.
**Validates: Requirements 16.4**

**Property 126: User Confirmation Display**
*For any* extracted intent and parameters, the system should display them in business-friendly language for user confirmation.
**Validates: Requirements 16.5**

**Property 127: API Execution After Confirmation**
*For any* confirmed intent, the system should execute the appropriate API call with extracted parameters.
**Validates: Requirements 16.6**

**Property 128: Successful Redirection**
*For any* successful API call, the system should redirect the user to the relevant page.
**Validates: Requirements 16.7**

**Property 129: Error Handling in User Language**
*For any* failed API call, the system should explain the error in the user's language.
**Validates: Requirements 16.8**

**Property 130: Microphone Permission Error Handling**
*For any* microphone permission error, the system should handle it gracefully with clear instructions.
**Validates: Requirements 16.9**

**Property 131: Voice Processing Logging**
*For any* voice processing interaction, the system should provide detailed logging for debugging purposes.
**Validates: Requirements 16.10**

### User Guide Properties

**Property 132: Guide Page Routing**
*For any* user navigating to the Guide page, the system should display content without routing errors.
**Validates: Requirements 17.1**

**Property 133: Automatic Guide Translation**
*For any* user with a non-English language preference, guide content should be automatically translated.
**Validates: Requirements 17.2**

**Property 134: No Manual Translation Prompts**
*For any* guide page, the system should NOT display "use google translate" messages.
**Validates: Requirements 17.3**

**Property 135: Guide Home Page Highlights**
*For any* home page view, guide highlights and call-to-action should be displayed.
**Validates: Requirements 17.4**

**Property 136: Guide Footer Links**
*For any* page in the application, a guide link should be present in the footer.
**Validates: Requirements 17.5**

**Property 137: Floating Guide Button**
*For any* page in the application, a floating guide button should be accessible.
**Validates: Requirements 17.6**

**Property 138: Translation Caching**
*For any* translated guide content, the translation should be cached for performance optimization.
**Validates: Requirements 17.7**

**Property 139: Guide Content Organization**
*For any* guide content, it should be organized into clear sections: Getting Started, Features, Troubleshooting.
**Validates: Requirements 17.8**

### Login Experience Properties

**Property 140: Business Benefits Display**
*For any* user viewing the login page, at least 6 business benefits should be displayed.
**Validates: Requirements 18.1**

**Property 141: Farmer Value Proposition Focus**
*For any* content on the login page, it should focus on farmer value propositions, not technical implementation details.
**Validates: Requirements 18.2**

**Property 142: No Technical Jargon**
*For any* text on the login page, technical terms (API names, model names) should NOT be displayed.
**Validates: Requirements 18.3**

**Property 143: Farmer-Friendly Language**
*For any* feature description on the login page, language should be clear and farmer-friendly.
**Validates: Requirements 18.4**

**Property 144: Visual Icons for Benefits**
*For any* business benefit displayed on the login page, it should include a visual icon.
**Validates: Requirements 18.5**

**Property 145: Specific Benefits Highlighting**
*For any* login page view, the system should highlight benefits such as fair pricing, voice assistance, local language support, trust system, market intelligence, and easy negotiation.
**Validates: Requirements 18.6**

**Property 146: Engaging Visual Design**
*For any* login page view, the system should use engaging visual design with good color contrast and spacing.
**Validates: Requirements 18.7**

### Modern UI Properties

**Property 147: Consistent Color Scheme**
*For any* page in the application, the color scheme should be consistent and vibrant.
**Validates: Requirements 19.1**

**Property 148: Smooth Transitions**
*For any* page navigation or state change, transitions should be smooth and animated.
**Validates: Requirements 19.2**

**Property 149: Interactive Feedback**
*For any* interactive element (button, card), hover effects should provide visual feedback.
**Validates: Requirements 19.3**

**Property 150: Loading State Indication**
*For any* data fetching operation, loading animations should be displayed.
**Validates: Requirements 19.4**

**Property 151: Micro-Interaction Feedback**
*For any* user action, micro-interactions should provide feedback to the user.
**Validates: Requirements 19.5**

**Property 152: Card-Based Design Consistency**
*For any* card-based element, the design should be consistent with shadows and depth.
**Validates: Requirements 19.6**

**Property 153: Typography Hierarchy**
*For any* text content, proper typography hierarchy should be used with readable fonts.
**Validates: Requirements 19.7**

**Property 154: Consistent Iconography**
*For any* page in the application, iconography should be consistent across all pages.
**Validates: Requirements 19.8**

**Property 155: Mobile Animation Performance**
*For any* animation or effect, it should work smoothly on mobile devices.
**Validates: Requirements 19.9**

**Property 156: Accessibility Compliance**
*For any* UI element, good accessibility should be maintained (contrast ratios, focus indicators).
**Validates: Requirements 19.10**

### Image Management Properties

**Property 157: Local Image Storage**
*For any* crop image, it should be stored locally in frontend/public/images/crops/.
**Validates: Requirements 20.1**

**Property 158: Major Crop Image Availability**
*For any* major crop (wheat, rice, maize, cotton, groundnut, sugarcane, soybean, onion, potato, tomato), images should be downloaded and stored locally.
**Validates: Requirements 20.2**

**Property 159: Local Image Path Usage**
*For any* displayed listing, the image path should reference local storage, NOT external URLs.
**Validates: Requirements 20.3**

**Property 160: Image Fallback Handling**
*For any* missing crop image, a generic placeholder should be displayed without breaking the UI.
**Validates: Requirements 20.4**

**Property 161: Image Loading Consistency**
*For any* listing displayed on Home page, Browse Listings page, or Listing Detail page, images should load correctly.
**Validates: Requirements 20.5**

**Property 162: Seed Data Image Path Updates**
*For any* seeded listing data, it should reference local image paths rather than external URLs.
**Validates: Requirements 20.6**

**Property 163: Graceful Image Error Handling**
*For any* image loading error, the system should handle it gracefully without breaking the UI.
**Validates: Requirements 20.7**

### Functional Negotiations Management Properties

**Property 164: Negotiation Detail Navigation**
*For any* "View Details" click on a negotiation, the system should navigate to the negotiation detail page.
**Validates: Requirements 21.1**

**Property 165: Negotiation Withdrawal API Call**
*For any* "Withdraw" click on a negotiation, the system should call the appropriate API to cancel the negotiation.
**Validates: Requirements 21.2**

**Property 166: Loading State Display During Data Fetching**
*For any* negotiation data fetching operation, loading states should be displayed.
**Validates: Requirements 21.3**

**Property 167: API Error Handling with User-Friendly Messages**
*For any* negotiation API error, the system should handle it gracefully with user-friendly error messages.
**Validates: Requirements 21.4**

**Property 168: Negotiations List Update After Withdrawal**
*For any* withdrawal action, the negotiations list should be updated to reflect the change.
**Validates: Requirements 21.5**

**Property 169: Negotiation Detail Information Completeness**
*For any* negotiation detail view, it should display listing info, offer history, time remaining, and status.
**Validates: Requirements 21.6**

**Property 170: Console Error Prevention**
*For any* message channel operation, the system should prevent browser console errors related to message channel closures.
**Validates: Requirements 21.7**reaking the UI.
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
// Feature: multilingual-mandi, Property 22: Pricing Formula Correctness
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
1. Pricing formula correctness (Properties 22, 27, 28)
2. Trust score calculation (Property 47)
3. Negotiation expiration (Property 36)
4. Search criteria matching (Property 88)
5. Authentication flow (Properties 1-6)
6. Voice interface core functionality (Properties 7-13)
7. OTP generation and validation (Properties 1-3)

**TIER 2 (Should Test):**
8. Round-trip properties for data persistence (Properties 5, 6, 15, 19)
9. Message translation and delivery (Properties 96-104)
10. Dispute resolution logic (Properties 56-63)
11. Inventory updates on transactions (Property 111)
12. Rate limiting (Property 104)
13. Image management (Properties 157-163)
14. Kisaan Bot voice processing (Properties 122-131)

**TIER 3 (Nice to Have):**
15. Analytics calculations (Properties 114-121)
16. Advisory service notifications (Properties 72-79)
17. Vendor discovery algorithms (Properties 39-46)
18. UI component interactions (Properties 147-156)
19. Guide system functionality (Properties 132-139)
20. Login experience validation (Properties 140-146)

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

