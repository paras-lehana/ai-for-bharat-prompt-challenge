# Requirements Document: The Multilingual Mandi

## Introduction

The Multilingual Mandi is a real-time linguistic bridge for local trade in India, designed to make agricultural trading accessible to the 146 million farmers across India, particularly the 85% who currently don't use digital trading platforms due to language barriers. The system addresses critical gaps in existing platforms (eNAM, ODOP, GeM) by providing voice-based interactions in local languages, AI-driven negotiation support, transparent pricing, and trust-building mechanisms.

## Glossary

- **Mandi_System**: The complete multilingual trading platform
- **Voice_Interface**: The voice-based query and response system using BHASHINI APIs
- **Negotiation_Engine**: The AI-powered negotiation assistance system
- **Pricing_Calculator**: The transparent quality-based pricing formula system
- **Discovery_Service**: The peer vendor discovery and micro-aggregation system
- **Trust_System**: The rating and dispute resolution system
- **Integration_Layer**: The connector to external platforms (eNAM, ODOP, GeM)
- **Advisory_Service**: The multilingual crop market intelligence system
- **Vendor**: A farmer or seller listing products on the platform
- **Buyer**: A trader or purchaser looking for products
- **Listing**: A product offering with price, quality, and quantity information
- **Negotiation_Session**: A time-bound (24-hour) back-and-forth price negotiation
- **Quality_Tier**: A grade assigned to products (e.g., Premium, Standard, Basic)
- **Trust_Score**: A composite rating based on delivery, quality, response, and pricing fairness
- **Local_Language**: Regional languages including Marathi, Tamil, Telugu, and others

## Requirements

### Requirement 1: User Authentication and Profile Management

**User Story:** As a vendor or buyer, I want to register and authenticate using my phone number, so that I can securely access the platform without needing email or complex passwords.

#### Acceptance Criteria

1. WHEN a user provides a valid phone number, THE Mandi_System SHALL send an OTP for verification
2. WHEN a user enters a valid OTP within 5 minutes, THE Mandi_System SHALL authenticate the user and create a session
3. WHEN a user enters an invalid OTP, THE Mandi_System SHALL reject authentication and allow up to 3 retry attempts
4. WHEN a new user completes OTP verification, THE Mandi_System SHALL create a user profile with role selection (Vendor or Buyer)
5. THE Mandi_System SHALL store user language preference for all future interactions
6. WHEN a user updates their profile information, THE Mandi_System SHALL validate and persist the changes immediately

### Requirement 2: Voice-Based Price Discovery in Local Languages

**User Story:** As a vendor with low literacy, I want to speak my query in my local language and hear prices back in the same language, so that I can access market information without reading or navigating complex interfaces.

#### Acceptance Criteria

1. WHEN a vendor speaks a price query in a supported local language, THE Voice_Interface SHALL transcribe the audio to text using BHASHINI APIs
2. WHEN the Voice_Interface receives transcribed text, THE Mandi_System SHALL extract the crop name and location from the query
3. WHEN a valid crop and location are identified, THE Mandi_System SHALL retrieve current market prices from the database and eNAM integration
4. WHEN market prices are retrieved, THE Voice_Interface SHALL generate a response in the same local language as the query
5. WHEN the response is generated, THE Voice_Interface SHALL convert the text to speech and return audio to the user
6. THE Mandi_System SHALL support at minimum Marathi, Tamil, and Telugu languages
7. IF the Voice_Interface cannot understand the query, THEN THE Mandi_System SHALL request clarification in the user's language

### Requirement 3: Product Listing Management

**User Story:** As a vendor, I want to create and manage product listings with details about crop type, quantity, quality, and base price, so that buyers can discover and purchase my products.

#### Acceptance Criteria

1. WHEN a vendor creates a listing, THE Mandi_System SHALL require crop type, quantity, unit, base price, and quality tier
2. WHEN a vendor uploads a product photo, THE Mandi_System SHALL store the image and associate it with the listing
3. WHERE photo quality analysis is available, THE Mandi_System SHALL suggest a quality tier based on image analysis
4. WHEN a vendor selects a quality tier manually, THE Mandi_System SHALL accept Premium, Standard, or Basic grades
5. WHEN a listing is created, THE Mandi_System SHALL calculate the final price using the transparent pricing formula
6. THE Mandi_System SHALL allow vendors to update listing details including price, quantity, and availability status
7. WHEN a vendor marks a listing as sold or unavailable, THE Mandi_System SHALL hide it from buyer searches
8. THE Mandi_System SHALL display all active listings from a vendor on their profile page

### Requirement 4: Dynamic Quality-Based Pricing with Transparent Formula

**User Story:** As a buyer, I want to see exactly how prices are calculated based on quality, demand, and base price, so that I can trust the pricing is fair and transparent.

#### Acceptance Criteria

1. THE Pricing_Calculator SHALL use the formula: Final_Price = Base_Price × Quality_Multiplier × Demand_Adjuster
2. WHEN a listing has Premium quality tier, THE Pricing_Calculator SHALL apply a Quality_Multiplier of 1.2
3. WHEN a listing has Standard quality tier, THE Pricing_Calculator SHALL apply a Quality_Multiplier of 1.0
4. WHEN a listing has Basic quality tier, THE Pricing_Calculator SHALL apply a Quality_Multiplier of 0.85
5. WHEN calculating Demand_Adjuster, THE Pricing_Calculator SHALL consider recent transaction volume and seasonal patterns
6. THE Pricing_Calculator SHALL ensure Demand_Adjuster remains between 0.8 and 1.3
7. WHEN displaying a listing price, THE Mandi_System SHALL show the complete breakdown: base price, quality multiplier, demand adjuster, and final price
8. WHEN any pricing component changes, THE Pricing_Calculator SHALL recalculate the final price immediately

### Requirement 5: AI-Powered Negotiation System

**User Story:** As a buyer, I want AI assistance during price negotiations that suggests fair counter-offers based on market data and context, so that I can negotiate effectively without being exploited.

#### Acceptance Criteria

1. WHEN a buyer makes an initial offer on a listing, THE Negotiation_Engine SHALL create a Negotiation_Session with a 24-hour expiration
2. WHEN a buyer's offer is below the fair price range, THE Negotiation_Engine SHALL analyze market data and suggest a counter-offer to the vendor
3. WHEN generating a counter-offer, THE Negotiation_Engine SHALL provide reasoning based on quality tier, recent transactions, and regional pricing
4. WHEN a vendor receives a counter-offer suggestion, THE Mandi_System SHALL allow the vendor to accept, reject, or modify the suggestion
5. THE Negotiation_Engine SHALL support multiple rounds of back-and-forth negotiation within the 24-hour window
6. WHEN either party accepts an offer, THE Negotiation_Engine SHALL finalize the negotiation and create a transaction record
7. WHEN 24 hours elapse without agreement, THE Negotiation_Engine SHALL expire the Negotiation_Session and notify both parties
8. THE Negotiation_Engine SHALL consider regional pricing variations when suggesting counter-offers
9. WHEN a negotiation is finalized, THE Mandi_System SHALL update the listing availability status

### Requirement 6: Peer Vendor Discovery and Micro-Aggregation

**User Story:** As a vendor, I want to discover other vendors selling the same crop within my region and collaborate on bulk orders, so that I can increase my bargaining power and reach larger buyers.

#### Acceptance Criteria

1. WHEN a vendor views their listing, THE Discovery_Service SHALL display a map showing other vendors with the same crop within 50km
2. WHEN a vendor selects another vendor on the map, THE Mandi_System SHALL display that vendor's contact information and listing details
3. THE Mandi_System SHALL provide direct messaging capability between vendors without intermediary access
4. WHEN multiple small vendors have similar listings, THE Discovery_Service SHALL identify potential micro-aggregation opportunities
5. WHEN a bulk order request exceeds a single vendor's capacity, THE Discovery_Service SHALL suggest combining inventory from nearby vendors
6. THE Discovery_Service SHALL calculate combined pricing for aggregated orders using weighted averages based on quality tiers
7. WHEN vendors agree to aggregate, THE Mandi_System SHALL create a combined listing with all participating vendors listed
8. THE Mandi_System SHALL distribute payment proportionally to participating vendors based on their contribution

### Requirement 7: Trust System with Transparent Ratings

**User Story:** As a buyer, I want to see vendor ratings based on objective criteria like delivery, quality, and fairness, so that I can make informed decisions about whom to trade with.

#### Acceptance Criteria

1. THE Trust_System SHALL calculate Trust_Score using the formula: 40% delivery + 30% quality + 20% response + 10% fair pricing
2. WHEN a transaction completes, THE Mandi_System SHALL prompt the buyer to rate delivery timeliness (1-5 stars)
3. WHEN a transaction completes, THE Mandi_System SHALL prompt the buyer to rate product quality match (1-5 stars)
4. THE Trust_System SHALL measure response time automatically based on message reply timestamps
5. THE Trust_System SHALL calculate fair pricing score by comparing final negotiated price to market average
6. WHEN a vendor achieves Trust_Score above 4.5 for 20+ transactions, THE Trust_System SHALL award a "Trusted Vendor" badge
7. WHEN a vendor achieves Trust_Score above 4.0 for 50+ transactions, THE Trust_System SHALL award a "Verified Seller" badge
8. THE Mandi_System SHALL display Trust_Score and badges prominently on vendor profiles and listings
9. WHEN a vendor's Trust_Score falls below 3.0, THE Mandi_System SHALL flag the account for review

### Requirement 8: Dispute Resolution System

**User Story:** As a buyer or vendor, I want an AI-powered system to help resolve disputes fairly when transactions go wrong, so that I have recourse without expensive legal processes.

#### Acceptance Criteria

1. WHEN a buyer or vendor raises a dispute, THE Mandi_System SHALL create a dispute case with all transaction details
2. WHEN a dispute is created, THE Trust_System SHALL notify both parties and request evidence submission within 48 hours
3. WHEN both parties submit evidence, THE Trust_System SHALL analyze transaction history, messages, ratings, and submitted evidence
4. WHEN the Trust_System completes analysis, THE Mandi_System SHALL generate a resolution recommendation with detailed reasoning
5. THE Trust_System SHALL consider factors including: delivery proof, quality evidence, communication logs, and past behavior
6. WHEN a resolution is recommended, THE Mandi_System SHALL allow both parties to accept or escalate to human review
7. IF both parties accept the AI resolution, THEN THE Mandi_System SHALL execute the recommended action (refund, partial payment, etc.)
8. WHEN a dispute is resolved, THE Trust_System SHALL update Trust_Scores based on the outcome and party behavior

### Requirement 9: Integration with Existing Government Platforms

**User Story:** As a vendor, I want the platform to pull live prices from eNAM and help me access ODOP and GeM opportunities, so that I can benefit from government initiatives without learning multiple systems.

#### Acceptance Criteria

1. THE Integration_Layer SHALL fetch live market prices from eNAM API for major crops and mandis
2. WHEN displaying price information, THE Mandi_System SHALL indicate the source (eNAM, local transactions, or both)
3. WHERE eNAM API is unavailable, THE Integration_Layer SHALL use cached data with a timestamp indicating freshness
4. WHEN a vendor sells an ODOP-registered product, THE Mandi_System SHALL highlight the listing with an ODOP badge
5. THE Integration_Layer SHALL provide AI-assisted documentation support for vendors registering on GeM
6. WHEN a vendor requests GeM assistance, THE Mandi_System SHALL guide them through required documents in their local language
7. THE Integration_Layer SHALL sync transaction data with eNAM when vendors opt-in to data sharing
8. WHEN eNAM prices are displayed, THE Mandi_System SHALL show the mandi location and last updated timestamp

### Requirement 10: Multilingual Crop Advisory and Market Intelligence

**User Story:** As a vendor, I want to receive timely market intelligence and crop advisory in my local language, so that I can make informed decisions about when and what to sell.

#### Acceptance Criteria

1. WHEN market conditions change significantly, THE Advisory_Service SHALL send push notifications to relevant vendors in their preferred language
2. THE Advisory_Service SHALL analyze eNAM data, peer transactions, and seasonal patterns to generate insights
3. WHEN a vendor's crop is in high demand, THE Advisory_Service SHALL notify them with current price trends and buyer interest
4. WHEN prices for a vendor's crop drop below historical averages, THE Advisory_Service SHALL alert them with context and recommendations
5. THE Advisory_Service SHALL provide weekly market summaries in the vendor's local language via SMS or app notification
6. WHEN a vendor views advisory content, THE Mandi_System SHALL display information in simple language with visual charts
7. THE Advisory_Service SHALL consider regional variations and local mandi data when generating recommendations
8. WHEN seasonal planting or harvest periods approach, THE Advisory_Service SHALL send proactive guidance based on market forecasts

### Requirement 11: Responsive Mobile-First Interface

**User Story:** As a user with a basic smartphone, I want the interface to work smoothly on my device with minimal data usage, so that I can access the platform from rural areas with poor connectivity.

#### Acceptance Criteria

1. THE Mandi_System SHALL render all interfaces responsively for screen sizes from 320px to 1920px width
2. WHEN a user accesses the platform on mobile, THE Mandi_System SHALL prioritize mobile-optimized layouts and touch interactions
3. THE Mandi_System SHALL lazy-load images and use compressed formats to minimize data usage
4. WHEN network connectivity is poor, THE Mandi_System SHALL display cached content and queue actions for later sync
5. THE Mandi_System SHALL provide offline capability for viewing saved listings and messages
6. WHEN the user interface loads, THE Mandi_System SHALL display content in the user's preferred language
7. THE Mandi_System SHALL use large touch targets (minimum 44px) for all interactive elements
8. WHEN forms are displayed, THE Mandi_System SHALL use appropriate input types and validation for mobile keyboards

### Requirement 12: Search and Discovery

**User Story:** As a buyer, I want to search for products by crop type, location, quality, and price range, so that I can quickly find vendors that meet my requirements.

#### Acceptance Criteria

1. WHEN a buyer enters search criteria, THE Mandi_System SHALL return listings matching crop type, location radius, quality tier, and price range
2. THE Mandi_System SHALL support search queries in local languages with automatic translation to database queries
3. WHEN search results are displayed, THE Mandi_System SHALL sort by relevance, distance, price, or Trust_Score based on user preference
4. THE Mandi_System SHALL display search results with key information: crop name, vendor name, price, quality tier, distance, and Trust_Score
5. WHEN a buyer applies filters, THE Mandi_System SHALL update results in real-time without page reload
6. THE Mandi_System SHALL save recent searches for quick access
7. WHEN no results match search criteria, THE Mandi_System SHALL suggest nearby alternatives or similar crops
8. THE Mandi_System SHALL support voice-based search queries through the Voice_Interface

### Requirement 13: Messaging and Communication

**User Story:** As a buyer and vendor, I want to communicate directly through the platform in our preferred languages, so that we can discuss details, negotiate, and build trust.

#### Acceptance Criteria

1. WHEN a buyer contacts a vendor, THE Mandi_System SHALL create a message thread associated with the specific listing
2. THE Mandi_System SHALL support text messages with automatic translation between different local languages
3. WHEN a message is sent, THE Mandi_System SHALL deliver it in real-time if both parties are online
4. WHEN a user is offline, THE Mandi_System SHALL queue messages and send push notifications upon delivery
5. THE Mandi_System SHALL display message read receipts and typing indicators
6. WHEN a user sends a message, THE Mandi_System SHALL store it with timestamp and sender identification
7. THE Mandi_System SHALL allow users to share images within message threads
8. THE Trust_System SHALL monitor message response times for Trust_Score calculation
9. THE Mandi_System SHALL prevent spam by limiting messages from new users to 10 per hour

### Requirement 14: Transaction Management

**User Story:** As a buyer and vendor, I want to track the complete lifecycle of transactions from negotiation to delivery, so that both parties have clear expectations and accountability.

#### Acceptance Criteria

1. WHEN a negotiation is finalized, THE Mandi_System SHALL create a transaction record with agreed price, quantity, and delivery terms
2. THE Mandi_System SHALL assign transaction status: Pending, Confirmed, In_Transit, Delivered, or Disputed
3. WHEN a vendor confirms a transaction, THE Mandi_System SHALL notify the buyer and update status to Confirmed
4. WHEN a vendor marks goods as shipped, THE Mandi_System SHALL update status to In_Transit and notify the buyer
5. WHEN a buyer confirms receipt, THE Mandi_System SHALL update status to Delivered and trigger rating prompts
6. THE Mandi_System SHALL display transaction history for both buyers and vendors with filtering by status and date
7. WHEN a transaction is completed, THE Mandi_System SHALL update inventory counts for the vendor's listing
8. THE Mandi_System SHALL generate transaction summaries for accounting and tax purposes
9. WHERE payment gateway integration is available, THE Mandi_System SHALL process payments and hold funds in escrow until delivery confirmation

### Requirement 15: Analytics and Reporting

**User Story:** As a vendor, I want to see analytics about my sales, popular products, and pricing trends, so that I can optimize my business strategy.

#### Acceptance Criteria

1. THE Mandi_System SHALL display vendor dashboard with total sales, active listings, pending negotiations, and Trust_Score
2. WHEN a vendor views analytics, THE Mandi_System SHALL show sales trends over time with visual charts
3. THE Mandi_System SHALL identify the vendor's best-selling crops and most profitable quality tiers
4. WHEN displaying pricing analytics, THE Mandi_System SHALL compare the vendor's prices to regional averages
5. THE Mandi_System SHALL show negotiation success rates and average discount percentages
6. THE Mandi_System SHALL provide buyer demographics including location distribution and repeat customer rates
7. WHERE sufficient data exists, THE Mandi_System SHALL generate predictive insights for optimal pricing and timing
8. THE Mandi_System SHALL allow vendors to export transaction data in CSV format for external analysis
