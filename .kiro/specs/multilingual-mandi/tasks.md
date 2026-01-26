# Implementation Plan: The Multilingual Mandi

## Overview

This implementation plan breaks down the Multilingual Mandi into discrete, incremental coding tasks. The approach prioritizes core functionality first (TIER 1 features), then enhances with AI-powered features (TIER 2), and finally adds polish (TIER 3). Each task builds on previous work, with checkpoints to validate progress.

Given the hackathon context, we focus on breadth of features to demonstrate all 7 core initiatives, with some features implemented as functional prototypes rather than production-ready code.

## Tasks

- [x] 1. Project Setup and Infrastructure
  - Initialize Node.js/Express backend with TypeScript
  - Initialize React frontend with Tailwind CSS
  - Set up SQLite database with Sequelize ORM
  - Configure environment variables for API keys (BHASHINI, eNAM)
  - Set up Docker and Docker Compose for local development
  - Create basic project structure with folders for routes, services, models, controllers
  - _Requirements: All (foundational)_

- [x] 2. Database Schema and Models
  - [x] 2.1 Create Sequelize models for core entities
    - Implement User, OTP, Listing, Negotiation, Offer, Transaction models
    - Define relationships and foreign keys
    - Add validation rules and constraints
    - _Requirements: 1.1-1.6, 3.1-3.8, 5.1-5.9, 14.1-14.9_
  
  - [ ]* 2.2 Write property test for data model round-trips
    - **Property 6: Profile Update Round-Trip**
    - **Property 12: Image Association Round-Trip**
    - **Property 15: Listing Update Round-Trip**
    - **Validates: Requirements 1.6, 3.2, 3.6**
  
  - [x] 2.3 Create models for trust and messaging
    - Implement Rating, TrustScore, Dispute, Evidence, Message models
    - Define relationships and indexes
    - _Requirements: 7.1-7.9, 8.1-8.8, 13.1-13.9_
  
  - [x] 2.4 Create models for integration and analytics
    - Implement ENAMPrice cache model
    - Add indexes for performance
    - _Requirements: 9.1-9.8_


- [ ] 3. Authentication Service Implementation
  - [ ] 3.1 Implement phone number validation and OTP generation
    - Create AuthService with sendOTP method
    - Validate Indian phone number format (+91XXXXXXXXXX)
    - Generate 6-digit OTP with 5-minute expiration
    - Store OTP in database
    - _Requirements: 1.1_
  
  - [ ]* 3.2 Write property test for OTP generation
    - **Property 1: OTP Generation for Valid Phone Numbers**
    - **Validates: Requirements 1.1**
  
  - [ ] 3.3 Implement OTP verification and session creation
    - Create verifyOTP method with retry limit (3 attempts)
    - Generate JWT token on successful verification
    - Create user profile for new users
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [ ]* 3.4 Write property tests for OTP verification
    - **Property 2: Valid OTP Authentication**
    - **Property 3: Invalid OTP Rejection with Retry Limit**
    - **Property 4: Profile Creation on First Authentication**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  
  - [ ] 3.5 Implement profile management
    - Create updateProfile method with validation
    - Store language preference
    - _Requirements: 1.5, 1.6_
  
  - [ ]* 3.6 Write property test for language preference persistence
    - **Property 5: Language Preference Persistence**
    - **Validates: Requirements 1.5**

- [ ] 4. API Routes and Middleware
  - Create Express routes for authentication (/api/auth/send-otp, /api/auth/verify-otp)
  - Implement JWT authentication middleware
  - Add request validation middleware
  - Add rate limiting middleware
  - Create error handling middleware with consistent error format
  - _Requirements: 1.1-1.6_

- [ ] 5. Checkpoint - Authentication Flow
  - Ensure all authentication tests pass
  - Manually test OTP flow with Postman or similar tool
  - Verify JWT tokens are generated and validated correctly
  - Ask the user if questions arise


- [ ] 6. Pricing Calculator Service
  - [ ] 6.1 Implement core pricing formula
    - Create PricingService with calculateFinalPrice method
    - Implement formula: Final_Price = Base_Price × Quality_Multiplier × Demand_Adjuster
    - Define quality multipliers (premium: 1.2, standard: 1.0, basic: 0.85)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 6.2 Write property test for pricing formula
    - **Property 18: Pricing Formula Correctness**
    - **Validates: Requirements 4.1**
  
  - [ ] 6.3 Implement demand adjuster calculation
    - Create getDemandAdjuster method considering transaction volume and seasonal patterns
    - Ensure demand adjuster stays between 0.8 and 1.3
    - For MVP, use simplified algorithm based on recent transaction count
    - _Requirements: 4.5, 4.6_
  
  - [ ]* 6.4 Write property test for demand adjuster bounds
    - **Property 19: Demand Adjuster Bounds**
    - **Validates: Requirements 4.6**
  
  - [ ] 6.5 Implement price breakdown generation
    - Create getPriceBreakdown method returning all components with explanation
    - _Requirements: 4.7_
  
  - [ ]* 6.6 Write property test for price breakdown completeness
    - **Property 20: Price Breakdown Completeness**
    - **Validates: Requirements 4.7**

- [ ] 7. Listing Service Implementation
  - [ ] 7.1 Implement listing CRUD operations
    - Create ListingService with createListing, updateListing, deleteListing, getListing methods
    - Validate required fields (crop type, quantity, unit, base price, quality tier)
    - Calculate final price using PricingService
    - Handle image upload and storage (local filesystem for MVP)
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_
  
  - [ ]* 7.2 Write property tests for listing operations
    - **Property 11: Required Fields Validation**
    - **Property 13: Quality Tier Validation**
    - **Property 14: Automatic Price Calculation**
    - **Validates: Requirements 3.1, 3.4, 3.5**
  
  - [ ] 7.3 Implement listing search and filtering
    - Create searchListings method with criteria matching
    - Filter by crop type, location radius, quality tier, price range
    - Exclude unavailable listings from search results
    - Implement sorting by price, distance, trust_score, relevance
    - _Requirements: 3.7, 12.1, 12.3, 12.4_
  
  - [ ]* 7.4 Write property tests for search functionality
    - **Property 16: Unavailable Listings Exclusion from Search**
    - **Property 63: Search Criteria Matching**
    - **Property 65: Search Result Sorting**
    - **Validates: Requirements 3.7, 12.1, 12.3**
  
  - [ ] 7.5 Implement vendor profile listing display
    - Filter listings by vendor ID and status 'active'
    - _Requirements: 3.8_
  
  - [ ]* 7.6 Write property test for active listings filter
    - **Property 17: Active Listings on Vendor Profile**
    - **Validates: Requirements 3.8**

- [ ] 8. API Routes for Listings
  - Create Express routes for listings (/api/listings)
  - Implement POST /api/listings (create)
  - Implement GET /api/listings/:id (get single)
  - Implement PUT /api/listings/:id (update)
  - Implement DELETE /api/listings/:id (delete)
  - Implement GET /api/listings/search (search with query params)
  - Implement GET /api/vendors/:id/listings (vendor's listings)
  - Add authentication middleware to protect routes
  - _Requirements: 3.1-3.8, 12.1-12.8_


- [ ] 9. Checkpoint - Listings and Pricing
  - Ensure all listing and pricing tests pass
  - Manually test listing creation with different quality tiers
  - Verify price calculations are correct
  - Test search functionality with various filters
  - Ask the user if questions arise

- [ ] 10. Negotiation Engine Implementation
  - [ ] 10.1 Implement negotiation session management
    - Create NegotiationService with createNegotiation method
    - Set 24-hour expiration on creation
    - Store initial buyer offer
    - _Requirements: 5.1_
  
  - [ ]* 10.2 Write property test for negotiation creation
    - **Property 22: Negotiation Session Creation with 24-Hour Expiration**
    - **Validates: Requirements 5.1**
  
  - [ ] 10.3 Implement offer analysis and counter-offer suggestion
    - Create analyzeOffer method that calculates fair price range
    - Use listing price, eNAM data, and recent transactions for context
    - Generate counter-offer suggestion with reasoning
    - Consider regional pricing variations
    - _Requirements: 5.2, 5.3, 5.8_
  
  - [ ]* 10.4 Write property tests for negotiation logic
    - **Property 23: Counter-Offer Suggestion for Low Offers**
    - **Property 27: Regional Pricing Consideration**
    - **Validates: Requirements 5.2, 5.3, 5.8**
  
  - [ ] 10.5 Implement negotiation workflow
    - Create submitCounterOffer, acceptOffer, rejectOffer methods
    - Support multiple rounds of negotiation
    - Create transaction on acceptance
    - Update listing status on finalization
    - _Requirements: 5.4, 5.5, 5.6, 5.9_
  
  - [ ]* 10.6 Write property tests for negotiation workflow
    - **Property 24: Multiple Negotiation Rounds**
    - **Property 25: Transaction Creation on Acceptance**
    - **Property 28: Listing Status Update on Finalization**
    - **Validates: Requirements 5.5, 5.6, 5.9**
  
  - [ ] 10.7 Implement negotiation expiration
    - Create scheduled task (cron job) to expire negotiations after 24 hours
    - Update status to 'expired' and notify both parties
    - _Requirements: 5.7_
  
  - [ ]* 10.8 Write property test for expiration
    - **Property 26: Negotiation Expiration After 24 Hours**
    - **Validates: Requirements 5.7**

- [ ] 11. API Routes for Negotiations
  - Create Express routes for negotiations (/api/negotiations)
  - Implement POST /api/negotiations (create with initial offer)
  - Implement POST /api/negotiations/:id/counter (submit counter-offer)
  - Implement POST /api/negotiations/:id/accept (accept offer)
  - Implement POST /api/negotiations/:id/reject (reject offer)
  - Implement GET /api/negotiations/:id (get negotiation details)
  - Implement GET /api/negotiations/buyer/:buyerId (buyer's negotiations)
  - Implement GET /api/negotiations/vendor/:vendorId (vendor's negotiations)
  - _Requirements: 5.1-5.9_


- [ ] 12. Trust System Implementation
  - [ ] 12.1 Implement trust score calculation
    - Create TrustService with calculateTrustScore method
    - Implement formula: 0.4×delivery + 0.3×quality + 0.2×response + 0.1×fair_pricing
    - Calculate response time from message timestamps
    - Calculate fair pricing score by comparing to market average
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [ ]* 12.2 Write property tests for trust score calculation
    - **Property 36: Trust Score Formula Correctness**
    - **Property 37: Response Time Calculation from Messages**
    - **Property 38: Fair Pricing Score Calculation**
    - **Validates: Requirements 7.1, 7.4, 7.5**
  
  - [ ] 12.3 Implement rating submission
    - Create submitRating method for delivery and quality ratings
    - Trigger rating prompts after transaction delivery
    - Update trust scores after new ratings
    - _Requirements: 7.2, 7.3_
  
  - [ ] 12.4 Implement badge awarding
    - Create awardBadge method with threshold checks
    - Award "Trusted Vendor" badge for score ≥ 4.5 and 20+ transactions
    - Award "Verified Seller" badge for score ≥ 4.0 and 50+ transactions
    - Flag accounts with score < 3.0 for review
    - _Requirements: 7.6, 7.7, 7.9_
  
  - [ ]* 12.5 Write property tests for badge awarding
    - **Property 39: Trusted Vendor Badge Award**
    - **Property 40: Verified Seller Badge Award**
    - **Property 41: Low Trust Score Flagging**
    - **Validates: Requirements 7.6, 7.7, 7.9**

- [ ] 13. Dispute Resolution Implementation
  - [ ] 13.1 Implement dispute creation and evidence submission
    - Create createDispute method with transaction details
    - Notify both parties and set 48-hour evidence deadline
    - Store evidence submissions (text, images, message logs)
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 13.2 Write property test for dispute creation
    - **Property 42: Dispute Case Creation**
    - **Property 43: Evidence Submission Notification**
    - **Validates: Requirements 8.1, 8.2**
  
  - [ ] 13.3 Implement dispute analysis and resolution
    - Create analyzeDispute method that considers all evidence
    - Generate resolution recommendation (refund_full, refund_partial, no_refund, reship)
    - Provide detailed reasoning for recommendation
    - For MVP, use rule-based logic; can enhance with ML later
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ]* 13.4 Write property test for resolution generation
    - **Property 44: Resolution Recommendation Generation**
    - **Validates: Requirements 8.4**
  
  - [ ] 13.5 Implement resolution execution
    - Create resolveDispute method that executes accepted resolutions
    - Update trust scores based on dispute outcome
    - _Requirements: 8.7, 8.8_
  
  - [ ]* 13.6 Write property tests for resolution execution
    - **Property 45: Resolution Execution on Acceptance**
    - **Property 46: Trust Score Update on Dispute Resolution**
    - **Validates: Requirements 8.7, 8.8**

- [ ] 14. API Routes for Trust and Disputes
  - Create routes for ratings (/api/ratings)
  - Create routes for disputes (/api/disputes)
  - Implement POST /api/ratings (submit rating)
  - Implement GET /api/vendors/:id/reputation (get trust score and badges)
  - Implement POST /api/disputes (create dispute)
  - Implement POST /api/disputes/:id/evidence (submit evidence)
  - Implement GET /api/disputes/:id (get dispute details)
  - Implement POST /api/disputes/:id/resolve (accept/reject resolution)
  - _Requirements: 7.1-7.9, 8.1-8.8_


- [ ] 15. Checkpoint - Negotiation and Trust Systems
  - Ensure all negotiation and trust tests pass
  - Manually test complete negotiation flow from offer to transaction
  - Verify trust scores calculate correctly
  - Test dispute creation and resolution
  - Ask the user if questions arise

- [ ] 16. BHASHINI Integration for Voice and Translation
  - [ ] 16.1 Create BHASHINI API client with abstraction layer
    - Implement VoiceService with methods for transcription, synthesis, translation
    - Create abstraction layer to support SARVAM API swap
    - Handle API authentication and error handling
    - Implement caching for translations to reduce API calls
    - _Requirements: 2.1, 2.4, 2.5_
  
  - [ ] 16.2 Implement voice query processing
    - Create parseQuery method to extract crop name and location from transcribed text
    - Use simple NLP or regex patterns for MVP
    - Handle multiple languages (Marathi, Tamil, Telugu minimum)
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 16.3 Write property tests for voice interface
    - **Property 7: Voice Query Language Consistency**
    - **Property 8: Query Parsing Extraction**
    - **Property 9: Price Retrieval for Valid Queries**
    - **Property 10: Malformed Query Clarification**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.7**
  
  - [ ] 16.3 Implement message translation
    - Add automatic translation to MessagingService
    - Translate messages between different user language preferences
    - Store original and translated versions
    - _Requirements: 13.2_
  
  - [ ]* 16.4 Write property test for message translation
    - **Property 72: Message Translation Between Languages**
    - **Validates: Requirements 13.2**

- [ ] 17. API Routes for Voice Interface
  - Create routes for voice queries (/api/voice)
  - Implement POST /api/voice/query (accept audio, return audio response)
  - Implement POST /api/voice/transcribe (audio to text)
  - Implement POST /api/voice/synthesize (text to audio)
  - Implement POST /api/translate (text translation)
  - Handle multipart/form-data for audio uploads
  - _Requirements: 2.1-2.8_

- [ ] 18. eNAM Integration Layer
  - [ ] 18.1 Create eNAM API client (mocked for MVP)
    - Implement IntegrationService with fetchENAMPrices method
    - For MVP, use mock data with realistic crop prices
    - Implement caching with expiration timestamps
    - Handle API failures gracefully with cached fallback
    - _Requirements: 9.1, 9.3_
  
  - [ ]* 18.2 Write property tests for eNAM integration
    - **Property 47: eNAM Price Fetching**
    - **Property 48: Price Source Indication**
    - **Property 49: Cached Data Fallback on API Failure**
    - **Property 53: eNAM Price Metadata Display**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.8**
  
  - [ ] 18.3 Implement ODOP and GeM support
    - Add ODOP badge display for registered products
    - Create GeM documentation guide in multiple languages
    - Implement opt-in eNAM data sync (basic version)
    - _Requirements: 9.4, 9.5, 9.6, 9.7_
  
  - [ ]* 18.4 Write property tests for integration features
    - **Property 50: ODOP Badge Display**
    - **Property 51: GeM Assistance Language Consistency**
    - **Property 52: Opt-In eNAM Data Sync**
    - **Validates: Requirements 9.4, 9.6, 9.7**


- [ ] 19. Discovery Service for Vendor Collaboration
  - [ ] 19.1 Implement nearby vendor discovery
    - Create DiscoveryService with findNearbyVendors method
    - Calculate distances using Haversine formula
    - Filter vendors within 50km radius with same crop type
    - Return vendor matches with distance and trust score
    - _Requirements: 6.1_
  
  - [ ]* 19.2 Write property test for vendor discovery
    - **Property 29: Nearby Vendor Discovery Within Radius**
    - **Validates: Requirements 6.1**
  
  - [ ] 19.3 Implement micro-aggregation logic
    - Create identifyAggregationOpportunities method
    - Identify vendors with similar listings (same crop, similar quality, nearby)
    - Suggest combining inventory for bulk orders
    - Calculate weighted average pricing for aggregated listings
    - _Requirements: 6.4, 6.5, 6.6_
  
  - [ ]* 19.4 Write property tests for aggregation
    - **Property 31: Micro-Aggregation Opportunity Identification**
    - **Property 32: Bulk Order Aggregation Suggestion**
    - **Property 33: Weighted Average Pricing for Aggregation**
    - **Validates: Requirements 6.4, 6.5, 6.6**
  
  - [ ] 19.5 Implement aggregated listing creation
    - Create createAggregatedListing method
    - Track participating vendors and their contributions
    - Implement proportional payment distribution
    - _Requirements: 6.7, 6.8_
  
  - [ ]* 19.6 Write property tests for aggregated listings
    - **Property 34: Combined Listing Creation on Agreement**
    - **Property 35: Proportional Payment Distribution**
    - **Validates: Requirements 6.7, 6.8**

- [ ] 20. Messaging Service Implementation
  - [ ] 20.1 Implement core messaging functionality
    - Create MessagingService with sendMessage, getThread methods
    - Create message threads associated with listings
    - Store messages with timestamps and sender info
    - Support text and image messages
    - _Requirements: 13.1, 13.6, 13.7_
  
  - [ ]* 20.2 Write property tests for messaging
    - **Property 71: Message Thread Creation on Contact**
    - **Property 75: Message Persistence with Timestamp**
    - **Property 76: Image Sharing in Messages**
    - **Validates: Requirements 13.1, 13.6, 13.7**
  
  - [ ] 20.3 Implement real-time and offline messaging
    - Add real-time delivery for online users (WebSocket or polling)
    - Queue messages for offline users
    - Send push notifications on message delivery
    - Implement read receipts and typing indicators
    - _Requirements: 13.3, 13.4, 13.5_
  
  - [ ]* 20.4 Write property tests for message delivery
    - **Property 73: Real-Time Message Delivery**
    - **Property 74: Offline Message Queuing**
    - **Validates: Requirements 13.3, 13.4**
  
  - [ ] 20.5 Implement spam prevention
    - Add rate limiting for new users (10 messages per hour)
    - Track message counts and enforce limits
    - _Requirements: 13.9_
  
  - [ ]* 20.6 Write property test for rate limiting
    - **Property 78: New User Message Rate Limiting**
    - **Validates: Requirements 13.9**

- [ ] 21. API Routes for Discovery and Messaging
  - Create routes for discovery (/api/discovery)
  - Create routes for messaging (/api/messages)
  - Implement GET /api/discovery/nearby (find nearby vendors)
  - Implement GET /api/discovery/aggregation/:listingId (get aggregation suggestions)
  - Implement POST /api/messages (send message)
  - Implement GET /api/messages/thread/:userId/:recipientId (get thread)
  - Implement PUT /api/messages/:id/read (mark as read)
  - _Requirements: 6.1-6.8, 13.1-13.9_


- [ ] 22. Transaction Management Implementation
  - [ ] 22.1 Implement transaction lifecycle
    - Create TransactionService with transaction creation on negotiation acceptance
    - Implement status transitions: pending → confirmed → in_transit → delivered → disputed
    - Send notifications on status changes
    - Update listing inventory on completion
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.7_
  
  - [ ]* 22.2 Write property tests for transaction management
    - **Property 79: Transaction Creation on Negotiation Finalization**
    - **Property 80: Transaction Status Assignment**
    - **Property 81: Vendor Confirmation Notification and Status Update**
    - **Property 82: Shipment Status Update and Notification**
    - **Property 83: Delivery Confirmation Triggers Rating**
    - **Property 85: Inventory Update on Transaction Completion**
    - **Validates: Requirements 14.1-14.5, 14.7**
  
  - [ ] 22.3 Implement transaction history and reporting
    - Create methods for transaction history with filtering
    - Generate transaction summaries for accounting
    - Support CSV export of transaction data
    - _Requirements: 14.6, 14.8_
  
  - [ ]* 22.4 Write property tests for transaction features
    - **Property 84: Transaction History Filtering**
    - **Property 86: Transaction Summary Generation**
    - **Validates: Requirements 14.6, 14.8**

- [ ] 23. API Routes for Transactions
  - Create routes for transactions (/api/transactions)
  - Implement GET /api/transactions/:id (get transaction details)
  - Implement PUT /api/transactions/:id/confirm (vendor confirms)
  - Implement PUT /api/transactions/:id/ship (mark as shipped)
  - Implement PUT /api/transactions/:id/deliver (buyer confirms delivery)
  - Implement GET /api/transactions/buyer/:buyerId (buyer's transactions)
  - Implement GET /api/transactions/vendor/:vendorId (vendor's transactions)
  - Implement GET /api/transactions/export (CSV export)
  - _Requirements: 14.1-14.9_

- [ ] 24. Checkpoint - Core Backend Complete
  - Ensure all backend tests pass (unit and property tests)
  - Verify all API endpoints work correctly
  - Test complete user journeys via API (Postman/Insomnia)
  - Check database integrity and relationships
  - Ask the user if questions arise


- [ ] 25. Advisory Service Implementation
  - [ ] 25.1 Implement market insights generation
    - Create AdvisoryService with generateMarketInsights method
    - Analyze eNAM data, peer transactions, and seasonal patterns
    - Generate insights for price increases, high demand, price drops
    - Consider regional variations in recommendations
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.7_
  
  - [ ]* 25.2 Write property tests for advisory service
    - **Property 54: Market Change Notification in Preferred Language**
    - **Property 55: High Demand Notification**
    - **Property 56: Price Drop Alert**
    - **Property 58: Regional Variation in Recommendations**
    - **Validates: Requirements 10.1, 10.3, 10.4, 10.7**
  
  - [ ] 25.3 Implement weekly reports and seasonal guidance
    - Create getWeeklyReport method with sales summary and trends
    - Create getSeasonalGuidance method with planting/harvest windows
    - Send proactive guidance as seasonal periods approach
    - Deliver all content in vendor's preferred language
    - _Requirements: 10.5, 10.6, 10.8_
  
  - [ ]* 25.4 Write property tests for reports and guidance
    - **Property 57: Weekly Summary Language Consistency**
    - **Property 59: Seasonal Guidance Timing**
    - **Validates: Requirements 10.5, 10.8**
  
  - [ ] 25.5 Implement scheduled notification system
    - Create cron jobs for weekly reports
    - Create cron jobs for seasonal guidance
    - Create event-driven notifications for market changes
    - Use SMS or push notifications (mock for MVP)
    - _Requirements: 10.1-10.8_

- [ ] 26. Analytics Service Implementation
  - [ ] 26.1 Implement vendor dashboard analytics
    - Create AnalyticsService with dashboard metrics
    - Calculate total sales, active listings, pending negotiations, trust score
    - Generate sales trends over time
    - Identify best-selling crops and most profitable quality tiers
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 26.2 Write property test for analytics calculations
    - **Property 87: Best-Selling Crop Identification**
    - **Validates: Requirements 15.3**
  
  - [ ] 26.3 Implement pricing and negotiation analytics
    - Compare vendor prices to regional averages
    - Calculate negotiation success rates and average discounts
    - Provide buyer demographics (location, repeat customers)
    - _Requirements: 15.4, 15.5, 15.6_
  
  - [ ]* 26.4 Write property tests for analytics
    - **Property 88: Price Comparison to Regional Average**
    - **Property 89: Negotiation Success Rate Calculation**
    - **Property 90: Buyer Demographics Calculation**
    - **Validates: Requirements 15.4, 15.5, 15.6**

- [ ] 27. API Routes for Advisory and Analytics
  - Create routes for advisory (/api/advisory)
  - Create routes for analytics (/api/analytics)
  - Implement GET /api/advisory/insights/:vendorId (get market insights)
  - Implement GET /api/advisory/weekly/:vendorId (get weekly report)
  - Implement GET /api/advisory/seasonal/:cropType (get seasonal guidance)
  - Implement GET /api/analytics/dashboard/:vendorId (get dashboard metrics)
  - Implement GET /api/analytics/pricing/:vendorId (get pricing analytics)
  - Implement GET /api/analytics/negotiations/:vendorId (get negotiation analytics)
  - _Requirements: 10.1-10.8, 15.1-15.8_


- [ ] 28. React Frontend - Project Setup and Core Components
  - Initialize React app with TypeScript and Tailwind CSS
  - Set up React Router for navigation
  - Create layout components (Header, Footer, Sidebar, Navigation)
  - Set up Axios for API communication with base URL configuration
  - Create authentication context and protected route wrapper
  - Implement responsive mobile-first design with Tailwind
  - _Requirements: 11.1, 11.2, 11.6, 11.7_

- [ ] 29. Authentication UI
  - [ ] 29.1 Create phone number input and OTP request screen
    - Build form with phone number validation
    - Call /api/auth/send-otp endpoint
    - Display success/error messages
    - _Requirements: 1.1_
  
  - [ ] 29.2 Create OTP verification screen
    - Build OTP input form (6 digits)
    - Call /api/auth/verify-otp endpoint
    - Store JWT token in localStorage
    - Redirect to dashboard on success
    - Show retry limit and error messages
    - _Requirements: 1.2, 1.3_
  
  - [ ] 29.3 Create profile setup screen
    - Build form for role selection (vendor/buyer)
    - Build form for language preference selection
    - Build form for name and location (optional)
    - Call /api/auth/profile endpoint
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 30. Listing Management UI
  - [ ] 30.1 Create listing creation form
    - Build form with crop type, quantity, unit, base price, quality tier
    - Add image upload component
    - Display calculated final price with breakdown
    - Call POST /api/listings endpoint
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 4.7_
  
  - [ ] 30.2 Create listing display and edit components
    - Build listing card component with all details
    - Build listing detail view
    - Build listing edit form
    - Implement status toggle (active/unavailable)
    - _Requirements: 3.6, 3.7, 3.8_
  
  - [ ] 30.3 Create vendor profile page
    - Display vendor information and trust score
    - Display all active listings
    - Show badges (Trusted Vendor, Verified Seller)
    - _Requirements: 3.8, 7.8_


- [ ] 31. Search and Discovery UI
  - [ ] 31.1 Create search interface
    - Build search bar with autocomplete for crop types
    - Build filter panel (location, quality tier, price range)
    - Build sort options (price, distance, trust score, relevance)
    - Call GET /api/listings/search endpoint
    - Display results in grid/list view
    - _Requirements: 12.1, 12.3, 12.4, 12.5_
  
  - [ ] 31.2 Create search result components
    - Build listing card for search results
    - Display key information (crop, vendor, price, quality, distance, trust score)
    - Implement real-time filter updates without page reload
    - Show "no results" message with alternative suggestions
    - _Requirements: 12.4, 12.5, 12.7_
  
  - [ ] 31.3 Create vendor discovery map
    - Integrate map component (Leaflet or Google Maps)
    - Display nearby vendors within 50km
    - Show vendor markers with crop type and distance
    - Call GET /api/discovery/nearby endpoint
    - _Requirements: 6.1, 6.2_

- [ ] 32. Negotiation UI
  - [ ] 32.1 Create negotiation initiation
    - Build "Make Offer" button on listing detail page
    - Build offer input form with price
    - Call POST /api/negotiations endpoint
    - Display negotiation created confirmation
    - _Requirements: 5.1_
  
  - [ ] 32.2 Create negotiation dashboard
    - Display active negotiations for buyer and vendor
    - Show negotiation history (all offers and counter-offers)
    - Display AI counter-offer suggestions with reasoning
    - Show time remaining (24-hour countdown)
    - _Requirements: 5.2, 5.3, 5.5, 5.7_
  
  - [ ] 32.3 Create negotiation action components
    - Build counter-offer form
    - Build accept/reject buttons
    - Call POST /api/negotiations/:id/counter, /accept, /reject endpoints
    - Display success/error messages
    - Redirect to transaction page on acceptance
    - _Requirements: 5.4, 5.6_

- [ ] 33. Checkpoint - Frontend Core Features
  - Ensure all frontend components render correctly
  - Test authentication flow end-to-end
  - Test listing creation and search
  - Test negotiation flow
  - Verify mobile responsiveness
  - Ask the user if questions arise


- [ ] 34. Voice Interface UI
  - [ ] 34.1 Create voice query component
    - Build microphone button with recording indicator
    - Use Web Speech API or record audio blob
    - Call POST /api/voice/query endpoint with audio
    - Play audio response
    - Display transcribed query and text response
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 34.2 Add voice query to search page
    - Integrate voice component into search interface
    - Parse voice response to populate search filters
    - Support multiple languages (Marathi, Tamil, Telugu)
    - Show language selector
    - _Requirements: 2.6, 12.8_
  
  - [ ] 34.3 Handle voice errors gracefully
    - Display clarification requests in user's language
    - Provide fallback to text input
    - Show error messages for unsupported languages
    - _Requirements: 2.7_

- [ ] 35. Messaging UI
  - [ ] 35.1 Create message thread component
    - Build message list with sender/recipient distinction
    - Display timestamps and read receipts
    - Show typing indicators
    - Auto-scroll to latest message
    - _Requirements: 13.5, 13.6_
  
  - [ ] 35.2 Create message input component
    - Build text input with send button
    - Add image upload button
    - Call POST /api/messages endpoint
    - Display translated messages when languages differ
    - _Requirements: 13.1, 13.2, 13.7_
  
  - [ ] 35.3 Implement real-time messaging
    - Use WebSocket or polling for real-time updates
    - Show notifications for new messages
    - Queue messages when offline
    - Mark messages as read automatically
    - _Requirements: 13.3, 13.4_

- [ ] 36. Transaction Management UI
  - [ ] 36.1 Create transaction detail page
    - Display transaction information (price, quantity, status)
    - Show buyer and vendor details
    - Display status timeline (pending → confirmed → in_transit → delivered)
    - _Requirements: 14.1, 14.2_
  
  - [ ] 36.2 Create transaction action buttons
    - Build "Confirm" button for vendors
    - Build "Mark as Shipped" button for vendors
    - Build "Confirm Delivery" button for buyers
    - Call PUT /api/transactions/:id/confirm, /ship, /deliver endpoints
    - Trigger rating prompt after delivery confirmation
    - _Requirements: 14.3, 14.4, 14.5_
  
  - [ ] 36.3 Create transaction history page
    - Display list of all transactions
    - Implement filtering by status and date
    - Show transaction summaries
    - Add CSV export button
    - _Requirements: 14.6, 14.8_


- [ ] 37. Trust and Rating UI
  - [ ] 37.1 Create rating submission form
    - Build rating form with delivery and quality ratings (1-5 stars)
    - Display after transaction delivery confirmation
    - Call POST /api/ratings endpoint
    - Show success message
    - _Requirements: 7.2, 7.3_
  
  - [ ] 37.2 Create trust score display component
    - Display overall trust score with breakdown
    - Show individual scores (delivery, quality, response, fair pricing)
    - Display badges (Trusted Vendor, Verified Seller)
    - Show transaction count
    - Use on vendor profiles and listing cards
    - _Requirements: 7.1, 7.6, 7.7, 7.8_

- [ ] 38. Dispute Resolution UI
  - [ ] 38.1 Create dispute creation form
    - Build form with reason, description, evidence upload
    - Call POST /api/disputes endpoint
    - Display confirmation and 48-hour evidence deadline
    - _Requirements: 8.1, 8.2_
  
  - [ ] 38.2 Create dispute detail page
    - Display dispute information and status
    - Show evidence from both parties
    - Display AI resolution recommendation with reasoning
    - Build accept/reject buttons for resolution
    - Call POST /api/disputes/:id/resolve endpoint
    - _Requirements: 8.3, 8.4, 8.6, 8.7_

- [ ] 39. Analytics and Advisory UI
  - [ ] 39.1 Create vendor dashboard
    - Display key metrics (total sales, active listings, pending negotiations, trust score)
    - Show sales trends chart (line or bar chart)
    - Display best-selling crops and profitable quality tiers
    - Call GET /api/analytics/dashboard/:vendorId endpoint
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ] 39.2 Create pricing analytics page
    - Display vendor prices vs. regional averages
    - Show negotiation success rates and average discounts
    - Display buyer demographics (location map, repeat customer rate)
    - Call GET /api/analytics/pricing/:vendorId and /negotiations/:vendorId endpoints
    - _Requirements: 15.4, 15.5, 15.6_
  
  - [ ] 39.3 Create advisory notifications
    - Display market insights (price increases, high demand, price drops)
    - Show weekly market summary
    - Display seasonal guidance with planting/harvest windows
    - Call GET /api/advisory/insights/:vendorId, /weekly/:vendorId, /seasonal/:cropType endpoints
    - Support push notifications (browser notifications for MVP)
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 10.8_


- [ ] 40. Multilingual Support and Localization
  - Set up i18n library (react-i18next)
  - Create translation files for supported languages (English, Hindi, Marathi, Tamil, Telugu)
  - Translate all UI text, labels, buttons, error messages
  - Implement language switcher component
  - Store language preference in user profile and localStorage
  - Apply language preference on app load
  - _Requirements: 1.5, 2.6, 11.6_

- [ ] 41. Offline Support and PWA Features
  - Configure service worker for offline capability
  - Implement caching strategy for listings and messages
  - Add "Add to Home Screen" prompt
  - Display cached content when offline
  - Queue actions (messages, offers) for sync when online
  - Show offline indicator in UI
  - _Requirements: 11.3, 11.4, 11.5_

- [ ] 42. Responsive Design and Mobile Optimization
  - Ensure all components are mobile-responsive (320px to 1920px)
  - Use Tailwind responsive classes (sm:, md:, lg:, xl:)
  - Optimize touch targets (minimum 44px)
  - Test on various screen sizes and devices
  - Optimize images with lazy loading and compression
  - Use appropriate input types for mobile keyboards
  - _Requirements: 11.1, 11.2, 11.3, 11.7, 11.8_

- [ ] 43. Checkpoint - Frontend Complete
  - Ensure all frontend features work correctly
  - Test complete user journeys (vendor and buyer)
  - Verify voice interface works in multiple languages
  - Test offline functionality
  - Verify mobile responsiveness on real devices
  - Ask the user if questions arise

- [ ] 44. Integration Testing and Bug Fixes
  - Run complete integration test suite
  - Test all API endpoints with frontend
  - Fix any bugs discovered during testing
  - Test error handling and edge cases
  - Verify all property-based tests pass
  - Check database integrity after various operations
  - _Requirements: All_


- [ ] 45. Docker and Deployment Setup
  - [ ] 45.1 Create Dockerfiles
    - Create Dockerfile for backend (Node.js)
    - Create Dockerfile for frontend (React build)
    - Optimize images for size (multi-stage builds)
    - _Requirements: All (deployment)_
  
  - [ ] 45.2 Create Docker Compose configuration
    - Define services for backend, frontend, database
    - Set up networking between containers
    - Configure environment variables
    - Add volume mounts for development
    - _Requirements: All (deployment)_
  
  - [ ] 45.3 Deploy to cloud (Vercel/Render)
    - Deploy frontend to Vercel
    - Deploy backend to Render or Railway
    - Set up PostgreSQL database (or continue with SQLite)
    - Configure environment variables in cloud
    - Set up HTTPS and custom domain (if available)
    - _Requirements: All (deployment)_

- [ ] 46. Documentation and Demo Preparation
  - [ ] 46.1 Create README.md
    - Document project overview and features
    - List all 7 core initiatives with implementation status
    - Provide setup instructions (local and Docker)
    - Document API endpoints
    - Include screenshots and demo video link
    - _Requirements: All_
  
  - [ ] 46.2 Create API documentation
    - Document all API endpoints with request/response examples
    - Use Swagger/OpenAPI or Postman collection
    - Include authentication requirements
    - Document error codes and messages
    - _Requirements: All_
  
  - [ ] 46.3 Prepare demo data
    - Create seed script with sample users, listings, negotiations
    - Include data for all 7 initiatives
    - Create demo accounts (vendor and buyer)
    - Prepare demo script for presentation
    - _Requirements: All_
  
  - [ ] 46.4 Create comparison document
    - Document how Multilingual Mandi addresses gaps in eNAM, ODOP, GeM
    - Highlight linguistic innovation as key differentiator
    - Show integration with existing platforms
    - Include metrics and success criteria
    - _Requirements: All_

- [ ] 47. Final Testing and Polish
  - Run complete end-to-end test of all features
  - Test with demo data and demo accounts
  - Fix any remaining bugs or UI issues
  - Optimize performance (lazy loading, caching, compression)
  - Test deployment on cloud
  - Verify all 7 core initiatives are functional
  - Ensure mobile responsiveness
  - Test voice interface in multiple languages
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Focus on TIER 1 features first, then TIER 2, then TIER 3 as time permits
- Some features (photo quality analysis, payment gateway) can be mocked or simplified for hackathon
- Prioritize breadth (showing all 7 initiatives) over depth (production-ready implementation)
