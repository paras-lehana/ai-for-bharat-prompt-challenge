---
inclusion: always
---

# Product Context & Development Guidelines

**Multilingual Mandi** is a web platform making agricultural trading accessible to 146 million Indian farmers through voice-based interactions in local languages, AI-driven negotiation support, and transparent pricing mechanisms.

## Core Product Principles

### Problem Context
- Target: 146M Indian farmers (only 15% use digital platforms like eNAM)
- Primary barrier: Language preference (75% prefer local over English/Hindi)
- Secondary issues: No negotiation support, trust deficit, quality assessment gaps

### Solution Philosophy
**Enhancement, not replacement** - We make eNAM accessible rather than competing with it:
- Voice-first interface in 6 local languages (Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)
- AI-assisted negotiation (peer-to-peer, not auction-based)
- Formula-driven transparent pricing based on quality
- Direct peer discovery eliminating middleman dependency

## Feature Implementation Guidelines

### Core Features (Priority Order)
1. **Voice Interface** - Primary interaction method, local language support mandatory
2. **AI Negotiation** - Counter-offer suggestions, not automated trading
3. **Quality-Based Pricing** - Transparent formula using quality multipliers
4. **Peer Discovery** - Vendor-to-vendor connections for bulk collaboration
5. **Trust System** - Rating-based with AI dispute resolution
6. **eNAM Integration** - Price data enhancement, not replacement
7. **Advisory Services** - Market intelligence in local languages

### User Experience Principles
- **Voice-first design** - All features must be accessible via voice commands
- **Language inclusivity** - UI text must support all 6 target languages
- **Transparency** - Pricing formulas and trust scores must be visible
- **Simplicity** - Complex agricultural concepts simplified for farmer UX

## Development Context

### User Roles & Permissions
- **Vendors** (Farmers selling) - Create listings, negotiate, view analytics
- **Buyers** (Traders/farmers purchasing) - Browse, negotiate, bulk ordering
- **System** - AI services, pricing calculations, dispute resolution

### Business Logic Constraints
- **Pricing** - Must use quality-tier multipliers from assets-config.json
- **Languages** - All user-facing content must support configured languages
- **Trust Scores** - Calculated based on transaction history and ratings
- **Negotiations** - Peer-to-peer only, no automated acceptance
- **Quality Assessment** - Based on standardized tiers (Premium, Good, Average, Poor)

### Integration Requirements
- **eNAM API** - For baseline price data (mocked in MVP)
- **Sarvam AI** - Speech-to-text, text-to-speech, translation services
- **BHASHINI** - Government multilingual processing (future)
- **OpenRouter** - AI model access for negotiation assistance

### Success Metrics Context
- Target: 60-70% farmer adoption (vs current 15% for eNAM)
- Economic impact: ₹5,000-10,000 additional income per farmer per season
- Social impact: Direct buyer connections, reduced middleman exploitation

## Implementation Guidelines

### When Adding Features
- Ensure voice interface compatibility
- Add multilingual support from day one
- Consider farmer digital literacy levels
- Maintain pricing formula transparency
- Preserve peer-to-peer interaction model

### When Modifying Existing Features
- Test voice interface functionality
- Verify language support across all text
- Validate pricing calculations against quality tiers
- Ensure trust score accuracy
- Maintain eNAM data integration

### MVP Status
Platform is 95% feature complete and production-ready for demo deployment.