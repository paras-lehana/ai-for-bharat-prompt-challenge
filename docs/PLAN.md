# THE MULTILINGUAL MANDI

You are building **The Multilingual Mandi**, a real-time linguistic bridge for local trade in India. This is a hackathon project that solves critical gaps in existing agricultural platforms (eNAM, ODOP, GeM) by making trading accessible in local languages with AI-driven negotiation and fair pricing.

***

## PART 1: PROBLEM STATEMENT & CONTEXT

### The Core Problem
India has 146 million farmers, but only ~15% use digital trading platforms like eNAM (Electronic National Agriculture Market). The #1 reason: **language barrier**. Additionally:

- **75% of farmers prefer their local language** (Marathi, Tamil, Kannada, Telugu, etc.), not English/Hindi
- **Information asymmetry**: Vendors don't know real-time prices across mandis; middlemen exploit this
- **No negotiation support**: Manual haggling takes hours; eNAM only allows one-time auctions
- **Trust deficit**: Complex portals feel "government-ish"; vendors fear getting cheated
- **Quality distrust**: No transparent way to price based on quality; flat bidding ignores differences

### Real Evidence from Research
From 2020 IJAE survey of 120 eNAM-registered farmers:
- **85.83%** complain about low prices (same as offline)
- **80.83%** report cartel formation (local traders collude; don't bid against each other online)
- **71.67%** say price is incommensurate with quality
- **60.83%** distrust quality assaying reports
- **54.16%** lack "live trading experience" (uncomfortable with one-time auctions)
- **48.33%** experience delayed payments (3-7 days vs immediate cash need)

### Why Current Platforms Fail

**eNAM Issues**:
- English/Hindi only (excludes 60% of vendors)
- Complex UI for low-literacy users (63% rural population ≤ primary education)
- One-time auction (no negotiation window; cultural mismatch)
- Traders form cartels (low participation means no real competition)
- Manual quality grading (subjective; can be manipulated)
- Slow settlements (farmers need cash same-day for loan repayment)

**ODOP Issues**:
- Subsidy-dependent (not sustainable market mechanism)
- Single-product focus (economic risk if demand drops)
- No buyer linkages (artisans produce; don't know who to sell to)
- No dynamic pricing tools

**GeM Issues**:
- Designed for B2G (Government procurement), not B2B (farmer-to-trader)
- Documentation-heavy (requires GST, PAN, MSME cert—70% small vendors don't have)
- Price control mandate (10% discount breaks mandi economics)

### Our Solution: 7 Core Initiatives

1. **Voice-Based Price Discovery in Local Languages**
   - Vendor calls/speaks → AI understands Marathi/Tamil/Telugu → Returns prices in that language (voice)
   - No reading required; no app navigation needed

2. **AI Negotiation Copilot**
   - Buyer offers ₹28/kg → AI analyzes fair range + context → Suggests counter-offer with reasoning
   - Back-and-forth negotiation (24-hour window), not one-time auction
   - Regional awareness (Punjabi vendors prefer direct; South Indian prefer soft approaches)

3. **Dynamic Quality-Based Pricing (Transparent Formula)**
   - Vendor uploads photo → AI grades quality OR vendor manually selects tier
   - Formula: Final Price = Base Price × Quality Multiplier × Demand Adjuster
   - Example: ₹30 (base) × 1.0 (medium quality) × 0.95 (oversupplied) = ₹28.50/kg
   - Fully transparent breakdown; can't be gamed

4. **Peer Vendor Discovery & Micro-Aggregation**
   - Map shows other vendors selling same crop within 50km
   - Direct messaging (no middleman)
   - AI bundles small vendors: "5 vendors (20kg + 15kg + 30kg + 25kg + 10kg) can fulfill your 100kg order"
   - Optimized delivery routes; shared logistics cost

5. **Smart Trust & Dispute Resolution**
   - Transparent vendor ratings (40% delivery, 30% quality, 20% response, 10% fair pricing)
   - AI arbitrates disputes (analyzed party history, similar cases, market context)
   - Trust badges (Verified Seller, Quality Champion, Fair Dealer, Quick Delivery)
   - Panchayat can nominate "trusted vendor" badges

6. **Integration with Existing Portals (Enhancement, Not Replacement)**
   - Pull live prices from eNAM API (if available)
   - Help ODOP sellers reach wider market via our platform
   - Provide AI-assisted documentation support for GeM registration
   - Eventually feed back transaction data to improve eNAM price feeds

7. **Multilingual Crop Advisory (Market Intelligence)**
   - "Tomato prices fallen 20%; sell now. Onion demand rising; plant next batch."
   - Push notifications in local language
   - Based on real eNAM data + peer transactions + seasonal patterns

***

## PART 2: DOCUMENTATION REQUIREMENTS

### What Kiro Must Create (Separate Documentation)

You will create 8 comprehensive documents in a `/docs` folder. Each must be research-backed and judge-impressing:

#### **1. README.md** (Setup & Overview)
- Project overview (2-3 paragraphs on problem + solution)
- Tech stack used
- Setup instructions (can be deployed locally or on cloud)
- Directory structure explained
- How to run locally (npm install, npm start)
- Deployment instructions (Docker or cloud platform)
- Key features highlighted

#### **2. DESIGN.md** (UI/UX & User Flows)
- User personas (small vendor, farmer, buyer, trader)
- User journey maps for each persona
- Wireframes for core pages:
  - Home/Dashboard
  - Browse Listings (search + filter)
  - Create Listing (product details)
  - Negotiation Chat
  - Vendor Profile
  - Price Info (trends, forecast)
  - Ratings/Reviews
  - Voice Query Interface
- Design system (colors, typography, spacing, responsive breakpoints)
- Mobile-first approach explained
- Accessibility considerations (high contrast, readable fonts, touch targets 48px+)

#### **3. REQUIREMENTS.md** (Functional & Non-Functional)
- **Functional Requirements** (What the system does):
  - User authentication (OTP-based phone login)
  - Create/edit/delete listings
  - Search listings (by product, location, quality tier)
  - Initiate negotiation (offer → counter-offer → accept)
  - Rate & review vendors
  - Find nearby vendors (map + list view)
  - Query prices via voice or text
  - View vendor profiles + history
  
- **Non-Functional Requirements** (How well it does it):
  - Performance: Page load <2s on 4G, voice response <3s
  - Scalability: Support 100+ concurrent users (MVP)
  - Accessibility: WCAG AA compliant
  - Security: HTTPS only, password hashing (bcrypt), CORS configured
  - Reliability: 99% uptime target, graceful error handling
  - Mobile-responsive: 320px to 1920px

#### **4. TECHNICAL_SPEC.md** (Architecture & Implementation Details)
- System architecture diagram (Frontend → Backend → Linguistic Pipeline → External APIs)
- Database schema with all tables:
  - users (phone, language_preference, location, rating, KYC_status)
  - listings (product, quantity, quality_tier, asking_price, photo_urls, location)
  - price_history (product, mandi, date, price, source: enam/manual/peer)
  - negotiations (listing_id, buyer_id, vendor_id, messages, status, final_price)
  - ratings (rater_id, rated_user_id, rating, comment, dimensions)
  - disputes (complaint_text, auto_verdict, human_verdict, status)
  - trust_badges (vendor_id, badge_type, earned_date)

- API Endpoints (REST):
  - POST /auth/send-otp, /auth/verify-otp
  - GET/POST /listings, GET /listings/{id}, PUT /listings/{id}, DELETE /listings/{id}
  - GET /listings (filters: product, location, quality_tier, price_range)
  - POST /negotiations, GET /negotiations/{id}, POST /negotiations/{id}/counter-offer, POST /negotiations/{id}/accept
  - GET /prices/current, /prices/history, /prices/forecast
  - GET /vendors/nearby, GET /vendors/{id}, POST /vendors/{id}/message
  - POST /voice/query (input: audio_base64 + language) → (output: text + audio response)
  - POST /ratings, GET /ratings/{user_id}

- Linguistic Pipeline Architecture:
  ```
  User Input (Voice in local language)
    ↓
  BHASHINI ASR (convert to text)
    ↓
  NLP Intent Recognition (price_query? negotiation? advisory?)
    ↓
  Domain Handler (query eNAM, pricing engine, peer listings)
    ↓
  LLM Response (SARVAM/Dhenu2 with mandi context)
    ↓
  BHASHINI TTS (convert back to voice)
    ↓
  Output (Voice + Text in same language)
  ```

- Code Architecture Pattern:
  - **Abstraction Layer for Linguistic Provider** (allows easy swapping):
    ```javascript
    const linguistic = LinguisticFactory.create(config.LINGUISTIC_PROVIDER);
    // config.LINGUISTIC_PROVIDER = 'bhashini' or 'sarvam'
    // Change 1 variable; entire system works with different provider
    ```
  - Modular services: linguistic/, pricing/, negotiation/, trust/, advisory/
  - Language fallback strategy (if language not supported, fallback to Hindi + offer escalation)

- Key Algorithms Explained:
  - Dynamic Pricing Formula (transparent calculation with breakdown)
  - Negotiation Copilot logic (fair range calculation, context analysis)
  - Vendor discovery algorithm (geographic proximity, product match, quality filter)
  - AI arbitration logic (party history, precedent cases, fairness rules)

- Testing approach (unit tests, integration tests, deployment testing)

#### **5. COMPARISON_WITH_EXISTING.md** ⭐ (JUDGE-WINNING DOCUMENT)
This is the most important documentation. It must be research-backed and detailed.

**Structure**:

**A. eNAM Deep Comparison**
- Current status (1.79 crore farmers, 600 mandis, 15% adoption)
- What eNAM does well (centralized price discovery, transparent bidding, MSP floor)
- Why eNAM fails to scale beyond 15%:
  1. **Language Barrier** (Root Cause #1)
     - Evidence: NABARD survey 2022 = 75% farmers prefer local language
     - eNAM reality: English + Hindi only
     - Impact: Regional language farmers feel excluded
     - Our solution: Voice + 6 languages from Day 1
  
  2. **Complex UI for Low-Literacy Users** (Root Cause #2)
     - Evidence: India Literacy Report 2021 = 63% rural ≤ primary education
     - eNAM reality: Dashboard with 20+ filter options, small text, abbreviations
     - Impact: Low-literacy farmers can't navigate
     - Our solution: Voice-first, simple UI, no reading required
  
  3. **No Negotiation (Only Auction)** (Root Cause #3)
     - Evidence: IJAE 2020 survey = 54.16% uncomfortable with one-time auction
     - eNAM reality: Reverse auction; take it or leave it
     - Impact: Cultural mismatch (Indians negotiate); farmers distrust sudden prices
     - Our solution: Back-and-forth negotiation (24-hour window) with AI reasoning
  
  4. **Cartel Formation** (Root Cause #4)
     - Evidence: IJAE 2020 = 80.83% report trader cartels (local traders collude offline)
     - eNAM reality: Traders can simply not participate; informal agreements prevent bidding
     - Impact: Online prices = offline prices (no farmer benefit)
     - Our solution: Peer discovery (many traders visible); transparency makes cartels harder
  
  5. **Quality Assaying Not Trusted** (Root Cause #5)
     - Evidence: IJAE 2020 = 60.83% distrust quality reports
     - eNAM reality: Manual grading by officers (subjective, can be manipulated)
     - Impact: Farmers dispute grades; process slow
     - Our solution: Transparent formula (automated or manual with clear rules)
  
  6. **Delayed Payments** (Root Cause #6)
     - Evidence: IJAE 2020 = 48.33% experience 3-7 day delays
     - eNAM reality: Quality check → Payment processing → Bank transfer = 7 days
     - Impact: Farmers need immediate cash for loans; forced to borrow at high rates
     - Our solution: Escrow system; same-day access to funds
  
  7. **No Quality-Based Pricing** (Root Cause #7)
     - Evidence: IJAE 2020 = 71.67% say price incommensurate with quality
     - eNAM reality: Flat bidding (all Grade A tomatoes bid to single price)
     - Impact: High-quality produce undersells; low-quality oversells
     - Our solution: Dynamic pricing with quality tiers (transparent multiplier)

- **Comprehensive Comparison Table**:
  | Feature | eNAM | Our Platform | Evidence |
  |---------|------|---------|----------|
  | Language support | English + Hindi | 6 languages + voice | 75% farmers prefer local (NABARD) |
  | Voice interface | ❌ | ✅ | 65% rural prefer voice (InterMedia) |
  | Complex UI | ✅ (20+ filters) | ❌ (simple) | 63% rural ≤ primary education |
  | Negotiation window | ❌ (one-time) | ✅ (24h back-and-forth) | 54.16% uncomfortable with auction (IJAE) |
  | Quality-based pricing | ❌ | ✅ (transparent formula) | 71.67% complain price ≠ quality (IJAE) |
  | Cartel resistance | Low | High (peer discovery) | 80.83% report cartels (IJAE) |
  | Quality trust | ⚠️ (manual) | ✅ (transparent) | 60.83% distrust (IJAE) |
  | Payment speed | 3-7 days | Same-day (escrow) | 48.33% complain delays (IJAE) |
  | Adoption | 15% | 50%+ target | Accessibility is key differentiator |

**B. ODOP Deep Comparison**
- ODOP is subsidy program, not market mechanism
- Why it fails: Over-dependence on single product, no buyer linkages, limited market access
- Our advantage: Sustainable market-driven model, peer discovery, all product types

**C. GeM Deep Comparison**
- GeM designed for B2G, not B2B/farmer trade
- Documentation-heavy (requires GST, PAN)
- Our advantage: Simple registration, local language, no price control mandate

**D. Research Citations**
- IJAE 2020: "Exploring farmers perceived constraints of e-NAM" (120 farmer survey)
- NABARD 2022: Rural Finance Access Survey (language preferences)
- InterMedia Study: Rural digital adoption (voice vs typing)
- India Literacy Report 2021 (education levels)
- eNAM official statistics (adoption rates)
- BHASHINI documentation (language support, accuracy)

**E. Market Segmentation**
- Who uses eNAM? (15% = literate, connected, willing to navigate complex app)
- Who uses ODOP? (5% = registered artisans in identified clusters)
- Who uses GeM? (2% = formal businesses only)
- Who can use our platform? (60-70% = any farmer, any language, any connectivity level)

**F. Unique Positioning**
- "We are the ONLY platform that combines: voice + local language + negotiation + quality pricing + peer discovery + trust system"
- Emphasize: Not replacement to eNAM; we enhance it by making it accessible

#### **6. DEPLOYMENT_GUIDE.md** (How to Deploy)
- Local development setup (npm install, environment variables, database initialization)
- Docker containerization:
  - Dockerfile for backend (Node.js)
  - Dockerfile for frontend (React + Nginx)
  - docker-compose.yml for local testing
  - How to build and run: `docker-compose up --build`

- Cloud deployment options:
  - **Option A**: Vercel (frontend) + Render (backend)
  - **Option B**: AWS (EC2 for backend, S3 for assets)
  - **Option C**: Heroku (both frontend + backend)
  
- Environment variables required (.env.example provided)
- Database migrations (how to initialize SQLite or PostgreSQL)
- Testing checklist before go-live:
  - All CRUD operations work
  - Voice query returns response
  - Search filters function
  - Negotiation chat flows
  - Ratings submit without error
  - Mobile responsive (test at 375px)
  - No console errors

- Post-deployment monitoring:
  - Error logging setup
  - Performance metrics tracking
  - Uptime monitoring

#### **7. HACKATHON_PITCH.md** (For Presentation)
- **2-Minute Elevator Pitch** (Copy-paste ready):
  > "We're solving why 85% of Indian farmers don't use eNAM. Not because the idea is bad, but because the language barrier and auction mechanism don't work culturally. We've built the Multilingual Mandi: voice-based price discovery in local languages, AI-assisted negotiation, and transparent quality-based pricing. First platform where a farmer can speak in Marathi and negotiate directly with buyers without understanding English or complex auctions."

- **10-Slide Deck Outline**:
  1. Problem (85% farmers excluded; eNAM complaints)
  2. Root causes (language, literacy, auctions, cartels)
  3. Our solution (7 initiatives)
  4. Competitive comparison (feature matrix)
  5. Linguistic innovation (voice + 6 languages)
  6. Working demo (show live app)
  7. Market potential (60-70% farmers reachable)
  8. Unique differentiation (first to combine all 7 features)
  9. Deployment ready (Docker + cloud options)
  10. Call to action (scale to all 2,000+ mandis in India)

- **Talking Points for Judges**:
  - "This isn't agritech; it's financial inclusion"
  - "We don't replace eNAM; we make it accessible"
  - "Research shows: 75% farmers prefer local language; 65% prefer voice"
  - "Real numbers: 85.83% eNAM farmers complain about low prices; we solve this with fair pricing formula"
  - "One vendor, one buyer, one middleman removed = ₹5,000-10,000 extra farmer income per season"

- **Competitive Advantages to Emphasize**:
  - Only platform with voice + local language
  - Only platform with negotiation (not auction)
  - Only platform with transparent quality-based pricing
  - Only platform integrating existing portals (not replacing)

#### **8. LINGUISTIC_INTEGRATION.md** (For Developers)
- How BHASHINI APIs work:
  - ASR (Automatic Speech Recognition): Convert voice to text
  - TTS (Text-to-Speech): Convert text to voice
  - Machine Translation: Text-to-text translation
  - Example curl requests for each

- How to integrate BHASHINI:
  - Register at bhashini.gov.in
  - Get API key
  - Call endpoints (with response time expectations: ~500ms average)
  - Error handling (what to do if ASR fails; language not supported)

- How to swap BHASHINI with SARVAM AI:
  - Change config.LINGUISTIC_PROVIDER = 'sarvam'
  - Update endpoint URLs
  - No code changes needed (abstraction layer handles it)

- Language coverage:
  - Phase 1 (MVP): Hindi, Marathi, Punjabi, Tamil, Telugu, Kannada (6 languages = 60% farmers)
  - Phase 2: Gujarati, Malayalam, Odia, Bhojpuri, Maithili, Assamese
  - Fallback strategy (if language not supported, fallback to Hindi)

- Glossary management:
  - Mandi-specific terms (सप्ताह vs हफ्ता = different connotations)
  - Regional negotiation idioms (गरीबी बोली = too low an offer)
  - Quality grading terms (प्रीमियम, मध्यम, निम्न)

- Quality metrics:
  - ASR accuracy targets: 85-90% for Hindi/Tamil/Telugu, 70-75% for tier-2 languages
  - TTS quality: Ensure natural pronunciation
  - Translation accuracy: Colloquial phrases understood

***

## PART 3: APP BUILD INSTRUCTIONS

### Architecture Overview
You are building a **web platform** (mobile-responsive) that works across:
- **Web browser** (primary)
- **Mobile browser** (secondary)
- **Voice IVR** (future; not required for MVP but architecture should support it)

### Tech Stack
- **Frontend**: React.js (with Tailwind CSS for styling)
- **Backend**: Node.js + Express.js
- **Database**: SQLite (MVP) or PostgreSQL (production)
- **Linguistic**: BHASHINI APIs (default) with abstraction layer for SARVAM swap
- **External APIs**: eNAM data (mocked initially), OpenWeather (optional for advisory)
- **Deployment**: Docker locally + Vercel/Render for cloud

### Project Structure (Mandatory)
```
the-multilingual-mandi/
├── frontend/                    # React app
│   ├── public/
│   │   └── images/              # Icons, illustrations
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx       # Voice query button + playback
│   │   │   ├── ListingCard.jsx      # Display product listing
│   │   │   ├── NegotiationChat.jsx  # Offer/counter-offer messages
│   │   │   ├── VendorMap.jsx        # Map + vendor discovery
│   │   │   ├── RatingForm.jsx       # Rate vendor form
│   │   │   ├── SearchBar.jsx        # Search + filter listings
│   │   │   └── NavBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page + dashboard
│   │   │   ├── BrowseListings.jsx   # Search results
│   │   │   ├── CreateListing.jsx    # Vendor: list produce
│   │   │   ├── MyNegotiations.jsx   # Active offer tracking
│   │   │   ├── VendorProfile.jsx    # Profile + ratings
│   │   │   ├── PriceInfo.jsx        # Price trends + forecast
│   │   │   └── Login.jsx            # Phone OTP login
│   │   ├── styles/
│   │   │   ├── tailwind.css         # Design system colors
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── api.js              # API calls
│   │   │   ├── linguistic.js       # BHASHINI integration wrapper
│   │   │   ├── auth.js             # OTP, JWT token management
│   │   │   └── constants.js        # API endpoints, languages, colors
│   │   └── App.jsx
│   └── package.json
│
├── backend/                     # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js           # /auth/send-otp, /auth/verify-otp
│   │   │   ├── listings.js       # /listings CRUD + search
│   │   │   ├── negotiations.js   # /negotiations (offers, counters, accept)
│   │   │   ├── prices.js         # /prices (eNAM + mandi data)
│   │   │   ├── vendors.js        # /vendors/nearby, /vendors/{id}
│   │   │   ├── voice.js          # /voice/query (ASR → response → TTS)
│   │   │   └── ratings.js        # /ratings
│   │   │
│   │   ├── services/
│   │   │   ├── linguistic/
│   │   │   │   ├── BhashiniFrontend.js      # BHASHINI API integration
│   │   │   │   ├── SarvamAIFrontend.js      # Alternative (swappable)
│   │   │   │   ├── LinguisticFactory.js     # Factory pattern (easy swapping)
│   │   │   │   ├── PriceQueryHandler.js     # Intent parsing + response
│   │   │   │   └── NLPIntent.js             # Intent recognition logic
│   │   │   │
│   │   │   ├── pricing/
│   │   │   │   ├── DynamicPricingEngine.js  # Quality-based pricing formula
│   │   │   │   ├── eNAMDataFetcher.js       # Query eNAM API (or mock)
│   │   │   │   └── DemandHeatmap.js         # Aggregated demand analysis
│   │   │   │
│   │   │   ├── negotiation/
│   │   │   │   ├── NegotiationCopilot.js    # Counter-offer suggestions
│   │   │   │   └── DealMatcher.js           # Match buyers + sellers
│   │   │   │
│   │   │   ├── trust/
│   │   │   │   ├── RatingCalculator.js      # Weighted rating formula
│   │   │   │   ├── DisputeArbitrator.js     # AI judgment logic
│   │   │   │   └── BadgeAwarder.js          # Trust badge logic
│   │   │   │
│   │   │   └── advisory/
│   │   │       └── MarketAdvisoryGenerator.js  # Crop suggestions
│   │   │
│   │   ├── models/
│   │   │   ├── User.js           # Database model for users
│   │   │   ├── Listing.js        # Database model for listings
│   │   │   ├── Negotiation.js    # Database model for negotiations
│   │   │   ├── Rating.js         # Database model for ratings
│   │   │   └── Dispute.js        # Database model for disputes
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification
│   │   │   ├── errorHandler.js   # Global error handling
│   │   │   └── logger.js         # Request logging
│   │   │
│   │   ├── utils/
│   │   │   ├── database.js       # SQLite initialization + connection
│   │   │   └── validators.js     # Input validation
│   │   │
│   │   └── app.js               # Express.js setup (routes, middleware)
│   │
│   └── package.json
│
├── data/                        # Mock data for MVP
│   ├── mock_enam_prices.json    # Sample eNAM price data
│   ├── mock_mandis.json         # Mandi locations with coordinates
│   └── sample_listings.json     # Pre-populated sample listings
│
├── docs/                        # Documentation (created earlier)
│   ├── README.md
│   ├── DESIGN.md
│   ├── REQUIREMENTS.md
│   ├── TECHNICAL_SPEC.md
│   ├── COMPARISON_WITH_EXISTING.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── HACKATHON_PITCH.md
│   └── LINGUISTIC_INTEGRATION.md
│
├── .env.example                 # Environment variables template
├── docker-compose.yml           # Docker local development
├── Dockerfile.backend           # Backend containerization
├── Dockerfile.frontend          # Frontend containerization
└── package.json                 # Root scripts (start, build, test)
```

***

### Feature Implementation Priority (Tier-Based)

#### **TIER 1: MUST HAVE (Core Differentiators)** — These MUST work
1. ✅ **User Authentication**
   - Phone number input → Send OTP via SMS (use Twilio test mode for MVP)
   - Enter OTP → JWT token issued
   - Token stored in localStorage; used for all API calls

2. ✅ **Listings CRUD**
   - Create: Vendor fills (product name, quantity, unit, quality tier, asking price, description, location)
   - Read: Display listings with all details
   - Update: Vendor can edit their own listing
   - Delete: Vendor can remove listing
   - Search/Filter: By product name, location (50km radius), quality tier, price range

3. ✅ **Price Display**
   - Show current prices (from mock eNAM data or manual entry)
   - Display base price + quality adjustment breakdown
   - Show suggested asking price for vendors (with formula explanation)

4. ✅ **Negotiation Flow**
   - Buyer makes offer (offer price + message)
   - Vendor sees offer notification
   - Vendor responds with counter-offer (price + message)
   - Buyer receives counter
   - Back-and-forth messaging (text-based; voice fallback ok)
   - Accept deal → Negotiation closes

5. ✅ **Vendor Discovery**
   - Map showing nearby vendors (50km radius)
   - List view of vendors + their ratings
   - Click vendor → See profile + past transactions + ratings
   - Direct message button (opens chat)

6. ✅ **Rating System**
   - After transaction closes, both parties get rating form
   - 5-star rating + optional comment
   - Rating stored in database
   - Vendor's average rating displayed on profile

7. ✅ **Voice Price Query** (Key Differentiator)
   - Button: "🎤 Ask Price"
   - Click → Browser opens microphone
   - User speaks: "टमाटर का भाव क्या है?" (Kannada/Tamil/Marathi)
   - Show: "Processing..." spinner
   - Response: Text + audio (Vendor receives: "आज दिल्ली मंडी में टमाटर ₹30-35/kg चल रहा है")
   - Simple, no complex dialogs
   - **Implementation**: Call `/voice/query` endpoint with audio + language

8. ✅ **Responsive Design (Mobile-First)**
   - All pages work at 375px (iPhone SE)
   - Touch targets 48px minimum
   - Typography: 16px minimum for readability
   - High contrast (WCAG AA)
   - No horizontal scrolling

***

#### **TIER 2: SHOULD HAVE (Enhances MVP; Partial OK)** — 70%+ functional ok
9. ⚠️ **Dynamic Pricing Formula**
   - Show pricing breakdown (formula explanation)
   - Allow vendor to see suggested price
   - Quality tiers (Premium/Medium/Low) with multipliers
   - Can show static multipliers initially (1.2 / 1.0 / 0.8)
   - Backend logic can be simplified (not full ML)

10. ⚠️ **Negotiation Copilot**
    - Show "AI Suggestion: Counter at ₹31/kg (fair range ₹30-33)"
    - Can be static suggestions initially (based on simple heuristics)
    - Full AI reasoning can be post-hackathon

11. ⚠️ **Dispute Resolution UI**
    - Show form: "Report Issue" → complaint text → submit
    - Backend: Save to database; admin can review
    - Full AI arbitration can be mock/manual initially

12. ⚠️ **Crop Advisory**
    - Show notification: "Tomato prices falling; sell now"
    - Can be hardcoded data initially (not real-time ML)
    - Show as in-app notification banner

13. ⚠️ **eNAM Price Integration**
    - Load mock eNAM prices from CSV
    - Show "Latest eNAM data: Delhi market"
    - Full API integration can be post-hackathon

14. ⚠️ **Micro-Aggregation Suggestion**
    - Show: "5 vendors + 2 FPOs can fulfill 100kg order"
    - Can be hardcoded suggestions initially
    - Routing optimization can be post-hackathon

***

#### **TIER 3: CAN SKIP (Nice-to-Have; Mockups Sufficient)** — Show but don't need full function
15. ❌ **Photo Quality Analysis**
    - Vendor can upload photo → AI analyzes quality
    - MVP: Vendor manually selects quality tier
    - Photo analysis can be post-hackathon

16. ❌ **Payment Gateway Integration**
    - Show payment flow (UPI / Bank Transfer mockup)
    - Don't need to process actual payments
    - Test mode only (show form; don't submit)

17. ❌ **SMS IVR Gateway**
    - Document architecture: "Farmer can call this number in local language"
    - Show Twilio integration code (commented)
    - Full IVR can be post-hackathon

18. ❌ **Advanced Analytics Dashboard**
    - Show mockup: "Seller Dashboard with stats"
    - Can display hardcoded data
    - Full analytics can be post-hackathon

***

### Code Quality Standards (Non-Negotiable)

#### **Every File Must Have**:
1. **Header Comment** (explain purpose):
   ```javascript
   /**
    * FILE: src/services/pricing/DynamicPricingEngine.js
    * 
    * PURPOSE: Calculate fair, transparent prices based on quality + demand
    * 
    * KEY FUNCTIONS:
    *  - calculatePrice(listing, context) → returns {finalPrice, breakdown}
    *  - getBasePrice(product, location) → queries eNAM or mandi data
    *  - getQualityMultiplier(tier) → returns 0.8 (low) to 1.2 (premium)
    * 
    * INTEGRATION POINTS:
    *  - Reads from: eNAM API, local database
    *  - Called by: /listings POST endpoint, NegotiationCopilot
    * 
    * TODO/IMPROVEMENTS:
    *  - [ ] Add ML model for dynamic adjustment
    *  - [ ] Implement seasonality factor
    * 
    * LINGUISTIC NOTE:
    *  - All user-facing strings use i18n for localization
    *  - Pricing formula explanation auto-generates in user's language
    */
   ```

2. **Function Comments** (explain logic):
   ```javascript
   /**
    * calculatePrice(listing, context)
    * 
    * Calculates final selling price using transparent formula:
    * Final Price = Base Price × Quality Multiplier × Demand Adjuster
    * 
    * @param {Object} listing - {product, quantity, quality_tier, photo_urls}
    * @param {Object} context - {location, language}
    * @returns {Object} {basePrice, qualityMultiplier, demandAdjuster, finalPrice, breakdown}
    * 
    * ALGORITHM:
    * 1. Get base price (regional eNAM average)
    * 2. Determine quality tier (from manual selection or photo analysis)
    * 3. Get demand adjuster (supply vs demand ratio)
    * 4. Multiply: base × quality × demand = final price
    * 5. Generate transparent breakdown (localized explanation)
    * 
    * EXAMPLE:
    *   Input: Tomato, medium quality, Delhi region
    *   Output: ₹30 (base) × 1.0 (medium) × 0.95 (oversupplied) = ₹28.50/kg
    */
   ```

3. **TODO Comments** (mark incomplete):
   ```javascript
   // TODO: Implement real eNAM API call
   // Current: Mock data from CSV
   // Future: Call https://api.enam.gov.in/... endpoint
   
   // HACK: Hardcoded multipliers; should be fetched from ML model
   
   // NOTE: Language fallback to Hindi if Kannada not supported
   ```

4. **No Hardcoded Secrets**:
   - API keys in `.env` files (never in code)
   - Database credentials in environment variables

5. **Error Handling**:
   - Try-catch blocks for all API calls
   - User-friendly error messages (not technical stack traces)
   - Graceful degradation (if service fails, show alternative)

***

### UI/UX Implementation

#### **Design System (Use Tailwind CSS)**
- **Colors**: 
  - Primary: Teal/Green (Indian agricultural feel)
  - Secondary: Orange (warmth, market energy)
  - Neutral: Gray (for balance)
  - Status: Green (success), Red (error), Orange (warning), Blue (info)

- **Typography**:
  - Headings: Bold, 24px-32px
  - Body: 16px regular, 18px line height
  - Small text: 14px (not smaller; accessibility)

- **Spacing**: 8px grid (8, 16, 24, 32, 48px)

- **Buttons**:
  - Primary: Solid, 16px font, 48px tall
  - Secondary: Outline, same size
  - Loading state: Spinner + disabled
  - Hover/Active states: Color change

- **Forms**:
  - Label above input
  - Clear error messages below field
  - Required fields marked with *
  - Success/error icon indicators

- **Accessibility**:
  - Color contrast 4.5:1 (WCAG AA)
  - Focus visible (outline on keyboard tab)
  - Alt text on all images
  - Form labels associated with inputs
  - Skip to main content link

#### **Page/Component Specifications**

**Home Page** (Landing + Dashboard)
- Hero section: "Talk, Trade, Thrive in Your Language"
- Quick stats: X listings, Y transactions, Z farmers helped
- Call-to-action: "Start Trading" (login button)
- Featured listings (3-4 top products)
- Voice query button prominent (🎤)
- Navigation: Browse | My Listings | My Offers | Profile | Prices

**Browse Listings Page**
- Large search bar at top (product name)
- Filters: Location (km radius), Quality (Premium/Medium/Low), Price range
- Results: Grid of cards (mobile 1 column, tablet 2, desktop 3)
- Each card shows: Product image (placeholder if none), name, quantity, asking price, vendor name, vendor rating (⭐), location
- Click card → Details page

**Create Listing Page** (Vendor side)
- Form fields:
  - Product name (autocomplete from common list: tomato, onion, potato, etc.)
  - Quantity (number input)
  - Unit (dropdown: kg, bags, liters, etc.)
  - Quality tier (radio: Premium / Medium / Low)
  - Description (optional text area)
  - Photo upload (optional; show placeholder if none)
  - Location (address input + map pin)
- Show suggested price based on quality + location
- "Price Breakdown" button (shows formula explanation)
- Submit button: "List Now"

**Negotiation Chat Page**
- Vendor name + profile pic at top
- Product summary: "20kg Tomatoes (Medium Quality)"
- Chat history: Messages with timestamps
- Latest offer highlighted: "₹28/kg" (buyer) vs "₹31/kg?" (vendor counter)
- Input field at bottom: Enter price + message
- Action buttons: Accept deal | Reject | Propose new price
- Timer: "24 hours to respond" if idle

**Vendor Profile Page**
- Profile picture + name
- Rating: ⭐⭐⭐⭐ (4.2/5 from 18 reviews)
- Trust badges: ✓ Verified Seller, Quality Champion
- Recent transactions: Last 5 listings
- Reviews: Show 3-5 most recent (name, rating, comment, date)
- Contact button: Direct message

**Voice Query Interface** (Minimal, unobtrusive)
- Button: "🎤 Ask Price" (always visible in header or sidebar)
- Click → Browser requests microphone permission
- Recording: Visual indicator (animated mic icon)
- "Listening... Listening..." text
- Timeout after 10 seconds of silence
- Response appears as card: Text + play button for audio
- Can dismiss card; go back to browsing

**Map/Vendor Discovery Page**
- Full-width map (centered on user location)
- Pins for each vendor (color-coded by product or rating)
- Click pin → Popup with vendor name, product, rating, "Message" button
- List view toggle: Show all vendors in 50km as scrollable list
- Filter: By product, by rating (⭐4+, all)

**Price Info Page**
- Price trend graph: X-axis = time, Y-axis = price (₹/kg)
- Product selector: Dropdown (tomato, onion, etc.)
- Time range: Last 7 days, 30 days, 3 months
- Show eNAM data (if available) vs peer transaction data
- Advisory banner: "Prices falling; sell now" or "Demand rising; plant more"

***

### Key Features: Detailed Implementation Notes

#### **Feature 1: Voice Price Query**

**User Flow**:
```
User taps "🎤 Ask Price" button
  ↓
Browser requests microphone access (standard permission prompt)
  ↓
User speaks: "टमाटर का भाव?" (Kannada/Marathi/etc.)
  ↓
Recording stops (auto-detect silence after 2 seconds)
  ↓
Show spinner: "Processing voice..."
  ↓
Backend processes:
  - Call BHASHINI ASR: "कर्नाटक में टमाटर के भाव का जानकारी चाहिए"
  - Parse intent: type = "price_query", product = "tomato", location = "Karnataka"
  - Query prices: eNAM + mandi data + peer listings
  - Call LLM: Generate response in same language
  - Call BHASHINI TTS: Get audio file
  ↓
Show result card:
  Text: "कर्नाटक में आज टमाटर ₹28-32/kg चल रहा है। बैंगलोर ₹30। बेंगलुरु कुछ हलका सप्लाई है।"
  Audio: Play button (🔊) with waveform
  ↓
User can close card; continue browsing or take action
```

**Backend Implementation** (`/voice/query` endpoint):
```javascript
POST /voice/query
Request body: {
  audioBase64: "base64-encoded audio data",
  languageCode: "mr" (or "ta", "te", "kn", "hi", "gu", "pa")
}

Response: {
  success: true,
  text: "टमाटर का भाव ₹30-32/kg है",
  audio: "base64-encoded response audio",
  languageCode: "mr"
}
```

**Code Structure**:
- `frontend/src/components/VoiceInput.jsx` - React component
- `backend/src/routes/voice.js` - Express route handler
- `backend/src/services/linguistic/BhashiniFrontend.js` - BHASHINI API calls
- `backend/src/services/linguistic/LinguisticFactory.js` - Provider selection

**Testing**:
- Test with mock audio (don't require real microphone)
- Test language detection (speaker uses Kannada; system detects correctly)
- Test fallback (if language not supported, fallback to Hindi)
- Test error handling (if microphone denied, show message)

***

#### **Feature 2: Negotiation with Copilot Suggestions**

**User Flow (Buyer)**:
```
Buyer browses listings
Finds: "20kg Tomatoes (Medium Quality) - ₹35/kg"
Taps "Make Offer"
  ↓
Opens negotiation form:
- Quantity: 20 kg (auto-filled from listing)
- Offer price: [text input] (buyer types ₹28/kg)
- Message: "Can you do ₹28?" (optional)
- Taps "Send Offer"
  ↓
Vendor receives notification: "New offer: ₹28/kg"
Vendor opens offer
  ↓
Copilot shows: "Suggestion: Fair range ₹30-33. Counter at ₹31/kg."
  "Reasoning: Quality is medium, demand is moderate, market avg ₹30.50"
  ↓
Vendor responds: "₹31/kg" (accepts suggestion)
  OR
Vendor responds: "₹32/kg, take it or leave it" (ignores copilot)
  ↓
Buyer receives counter-offer
Decision: Accept ₹31/kg OR counter again
  ↓
Negotiation continues until:
  - Deal accepted (price agreed)
  - Deal rejected (either party walks away)
  - Timeout (24 hours; deal expires)
```

**Backend Implementation** (`/negotiations` endpoints):
```javascript
POST /negotiations
Request: {
  listingId: "uuid",
  buyerId: "uuid",
  initialOfferPrice: 28,
  message: "Can you do ₹28/kg?"
}

POST /negotiations/{id}/counter-offer
Request: {
  counterPrice: 31,
  message: "₹31/kg final"
}

POST /negotiations/{id}/accept
Request: { acceptPrice: 31 }
Response: { status: "accepted", finalPrice: 31 }
```

**Code Structure**:
- `frontend/src/components/NegotiationChat.jsx` - Chat UI
- `backend/src/routes/negotiations.js` - Route handler
- `backend/src/services/negotiation/NegotiationCopilot.js` - Copilot logic
  - `suggestCounterOffer(negotiation, responderRole)` - Analyzes context, suggests fair price
  - `generateReasoning(...)` - Explains reasoning in user's language

**Copilot Logic** (Simplified for MVP):
```javascript
function suggestCounterOffer(negotiation) {
  const listing = negotiation.listing;
  const lastOffer = negotiation.messages[negotiation.messages.length - 1].price;
  
  // STEP 1: Get base price (from eNAM or mandi data)
  const basePrice = getPriceForProduct(listing.product, listing.location);
  
  // STEP 2: Adjust for quality
  let fairMin = basePrice * 0.95;
  let fairMax = basePrice * 1.05;
  if (listing.quality_tier === 'premium') fairMax *= 1.2;
  if (listing.quality_tier === 'low') fairMin *= 0.85;
  
  // STEP 3: Count competing sellers (if many, buyer can demand lower)
  const competitorCount = countSimilarListings(listing.product, listing.location);
  if (competitorCount > 10) fairMin *= 0.98; // Supply high; can negotiate lower
  
  // STEP 4: Suggest counter based on role
  if (responderRole === 'vendor') {
    // Vendor received low offer
    const suggestion = Math.max(lastOffer + 2, fairMin + 1);
  } else {
    // Buyer wants to counter vendor's asking price
    const suggestion = Math.min(listing.askingPrice - 2, fairMax - 1);
  }
  
  return {
    suggestedPrice: suggestion,
    reasoning: `Fair range ₹${fairMin}-${fairMax}. 
                 Quality: ${listing.quality_tier}. 
                 Competitors: ${competitorCount}. 
                 Suggest: ₹${suggestion}/kg`,
    fairMin,
    fairMax
  };
}
```

**For MVP**: Copilot can suggest simple numbers (hardcoded logic ok; full ML can be post-hackathon).

***

#### **Feature 3: Dynamic Quality-Based Pricing**

**What Vendor Sees**:
```
Vendor creates listing for 20kg tomatoes

Step 1: Select quality tier
Radio options:
○ Premium (Large, uniform color, pest-free)
○ Medium (Mixed size, acceptable quality)
○ Low (Small, discolored, minor damage)

Vendor selects: "Medium"

Step 2: App shows pricing breakdown:
+───────────────────────────────────+
│ आपकी किंमत की गणना                │
├───────────────────────────────────┤
│ आधार मूल्य (eNAM):  ₹30/kg       │
│ गुणवत्ता समायोजन:   ×1.0 (मध्यम) │
│ बाजार मांग:        ×0.95 (अधिक) │
├───────────────────────────────────┤
│ अनुशंसित कीमत:      ₹28.50/kg    │
│                                   │
│ आप ±5% समायोजन कर सकते हैं।     │
│ 10% से अधिक = चेतावणी             │
│                                   │
│ [₹27.50] [अनुशंसित] [₹29.95]     │
└───────────────────────────────────┘

Step 3: Vendor can:
- Accept recommended price (₹28.50/kg)
- Adjust within 5% (±₹1.43 = ₹27-30)
- Override (but system warns if >10% deviation)

Step 4: Vendor lists at their chosen price
```

**Backend Implementation** (`/prices` endpoint):
```javascript
POST /prices/calculate
Request: {
  productName: "tomato",
  quantity: 20,
  qualityTier: "medium",
  location: "Delhi"
}

Response: {
  basePrice: 30,
  qualityMultiplier: 1.0,
  demandAdjuster: 0.95,
  finalPrice: 28.50,
  breakdown: {
    "title": "आपकी किंमत की गणना",
    "basePrice": "आधार मूल्य (eNAM): ₹30/kg",
    "quality": "गुणवत्ता समायोजन: ×1.0 (मध्यम)",
    "demand": "बाजार मांग: ×0.95",
    "final": "अनुशंसित कीमत: ₹28.50/kg",
    "note": "आप ±5% समायोजन कर सकते हैं।"
  },
  fairRange: { min: 27, max: 30 }
}
```

**Code Structure**:
- `frontend/src/components/QualityTierSelector.jsx` - Tier selection + pricing display
- `backend/src/services/pricing/DynamicPricingEngine.js` - Pricing calculation
  - `calculatePrice(listing, context)` - Main calculation
  - `getBasePrice(product, location)` - Fetch eNAM or mandi data
  - `getQualityMultiplier(tier)` - Return 0.8 / 1.0 / 1.2
  - `getDemandAdjuster(product, location)` - Calculate supply/demand ratio
  - `validatePrice(listedPrice, suggestedPrice)` - Warn if too high

**For MVP**:
- Quality multipliers: Fixed (Premium 1.2, Medium 1.0, Low 0.8)
- Base prices: Mocked from CSV (eNAM API can be integrated later)
- Demand adjuster: Simple heuristic (count active listings of same product)

***

#### **Feature 4: Multilingual Support (Voice + Text)**

**Implementation**:
1. **Language Detection**:
   - Ask user their preferred language during login (or detect from browser)
   - Store in `users.language_preference` database field
   - Default: Detect from phone locale (if possible)

2. **Frontend Localization**:
   - Use `react-i18n` or similar for text translations
   - All user-facing strings in separate JSON files:
     ```json
     // locales/mr.json (Marathi)
     {
       "home.title": "मंडी खोलें",
       "home.subtitle": "आपकी भाषेत व्यापार करा",
       "button.list": "यादी करा",
       "button.search": "शोधा"
     }
     ```
   - Frontend automatically loads correct locale based on user preference

3. **Voice Interface**:
   - When user clicks "🎤 Ask Price", pass their language code to backend
   - Backend calls BHASHINI ASR in that language
   - Response generated in same language, TTS also in same language

4. **Linguistic Abstraction Layer** (Key for swappability):
   ```javascript
   // src/services/linguistic/LinguisticFactory.js
   class LinguisticFactory {
     static create(provider) {
       if (provider === 'bhashini') return new BhashiniFrontend();
       if (provider === 'sarvam') return new SarvamAIFrontend();
       throw new Error(`Unknown provider: ${provider}`);
     }
   }

   // Usage in code (anywhere):
   const linguistic = LinguisticFactory.create(config.LINGUISTIC_PROVIDER);
   const transcript = await linguistic.transcribeAudio(audio, 'mr');
   // If config changes from BHASHINI to SARVAM, 
   // only config file changes; no code changes needed
   ```

5. **Language Fallback**:
   - If user's language not supported, fallback to Hindi
   - Show message: "आपकी भाषा समर्थित नहीं है। हिंदी में सेवा दे रहे हैं।"
   - Offer to escalate to human support

6. **Language Coverage (MVP)**:
   - Phase 1: Hindi, Marathi, Punjabi, Tamil, Telugu, Kannada
   - Phase 2: Gujarati, Malayalam, Odia, Bhojpuri (add later)
   - Glossary: Mandi-specific terms translated to each language

***

### Complete Feature Showcase (What Judges See)

#### **Home Page** (Shows All Features at a Glance)
- Hero: "Trade in Your Language. Negotiate Fairly. Earn More."
- Feature badges (small text below, promoting each initiative):
  - 🎤 "Voice in 6 Languages"
  - 💬 "AI Negotiation"
  - 📊 "Fair Pricing"
  - 🗺️ "Find Vendors Nearby"
  - ⭐ "Trusted Community"
  - 🔗 "Connected to eNAM"
  - 📈 "Market Insights"

- Quick stats: "1,000+ Listings | 500+ Vendors | ₹50 Lakh Traded"

- Call-to-action buttons:
  - "🎤 Ask Price" (prominent)
  - "Browse Listings"
  - "Start Selling" (login first)

- Feature cards (expandable):
  ```
  [🎤 Voice Queries]
  "Ask prices in your language. 
   No app needed for basic queries."
  
  [💬 Smart Negotiations]
  "Negotiate back-and-forth with AI guidance.
   Get fair prices based on quality."
  
  [🗺️ Find Peers]
  "Discover vendors selling same products.
   Direct contact, no middleman."
  
  [⭐ Trust System]
  "Transparent ratings and AI arbitration.
   Safe trading for all."
  
  [📊 Fair Pricing]
  "Quality-based dynamic pricing.
   See exactly how your price is calculated."
  
  [🔗 Government Integration]
  "Works with eNAM, ODOP, GeM.
   Enhances existing portals."
  ```

#### **Working Features Demonstrated** (MVP Can Show All 7)

1. ✅ **Voice query** - Working demo with mock eNAM data
2. ✅ **Negotiate** - Working chat between buyer/seller (mock data)
3. ✅ **Browse listings** - Live search + filter (mock listings loaded)
4. ✅ **Quality pricing** - Show formula + suggested prices
5. ✅ **Vendor discovery** - Map showing nearby vendors (mock data)
6. ✅ **Ratings** - Show system + let judge rate a vendor
7. ✅ **Crop advisory** - Show notifications (can be hardcoded)

#### **Non-Working Features Acknowledged** (UI Only)

- Payment flow (show mockup, don't process)
- Advanced dispute arbitration (show form, backend manual)
- Photo quality analysis (vendor selects grade manually)
- eNAM real-time API (using mock CSV data)
- SMS IVR (show architecture in docs)

**All should be labeled clearly**:
```
[Feature Name] (MVP: Core functionality)
[Feature Name] (Partial: UI only; logic coming)
[Feature Name] (Roadmap: Post-hackathon)
```

***

### Deployment Instructions

#### **Option 1: Docker (Recommended for Hackathon)**

**Create Dockerfile.backend**:
```dockerfile
FROM node:16
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

**Create Dockerfile.frontend**:
```dockerfile
FROM node:16 as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/src ./src
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
```

**Create docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: sqlite:///mandi.db
      BHASHINI_API_KEY: ${BHASHINI_API_KEY}
    volumes:
      - ./data:/app/data

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

**To run**:
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

#### **Option 2: Cloud Deployment (Post-Hackathon)**

**Vercel (Frontend)**:
```bash
vercel deploy
# Sets up CI/CD; auto-deploys on git push
```

**Render (Backend)**:
```bash
# Connect GitHub repo
# Select Render from dashboard
# Deploy with environment variables
```

***

### Testing Before Submission

**Checklist** (Test yourself before judges see):
- [ ] Create user account (OTP works)
- [ ] Create listing (all fields submit)
- [ ] Search listings (filters work)
- [ ] Make offer on listing (creates negotiation)
- [ ] Receive counter-offer (notification appears)
- [ ] Accept deal (closes negotiation)
- [ ] Rate vendor (form submits)
- [ ] Voice query works (returns response in <3 seconds)
- [ ] At least 2 languages (toggle language, UI updates)
- [ ] Mobile responsive (test at 375px width)
- [ ] No console errors (check DevTools)
- [ ] All buttons clickable (no dead links)
- [ ] Error messages clear (understand what went wrong)

***

### Success Criteria

#### **For Judges' Testing** (5-minute demo):
1. ✅ App loads without errors
2. ✅ Can create account + browse listings
3. ✅ Can make offer → receive counter → accept
4. ✅ Voice query returns price (at least one language)
5. ✅ Mobile responsive (no horizontal scroll)
6. ✅ Code is commented (judges can understand logic)
7. ✅ Docs are thorough (COMPARISON_WITH_EXISTING.md impresses)

#### **For Hackathon Judges**:
- **Novelty**: Are 7 initiatives unique to your platform? (vs eNAM/ODOP/GeM)
- **Completeness**: Do major features work? (80%+ functionality ok)
- **Code Quality**: Well-structured? Comments explain logic?
- **Linguistic**: Voice + 2+ languages working smoothly?
- **Presentation**: Can you explain differentiation? Have talking points memorized?
- **Deployment**: Does it actually run? (locally or cloud)

***

## FINAL REMINDERS FOR KIRO

1. **Research is embedded in this prompt** - Use the statistics, evidence, and problem statements provided
2. **Documentation is non-negotiable** - 8 separate docs, especially COMPARISON_WITH_EXISTING.md
3. **Features should showcase breadth** - Show all 7 initiatives (even if some partial)
4. **Code quality matters** - Every file commented; abstraction layer for swappability
5. **Linguistic innovation is your edge** - Voice + 6 languages = judge-impressing
6. **Deployment must work** - Test before submission; no crashes or broken features
7. **UI/UX should be beautiful** - High contrast, responsive, touch-friendly, professional
8. **The pitch should resonate** - "Not replacing eNAM; making it accessible" = winning narrative

***
