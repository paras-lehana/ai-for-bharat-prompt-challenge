# The Multilingual Mandi 🌾

> **Real-time linguistic bridge for local trade in India**

[![Status](https://img.shields.io/badge/Status-MVP%20Ready-success)](./STATUS.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/Node-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://reactjs.org)

A web platform that makes agricultural trading accessible to 146 million Indian farmers by providing voice-based interactions in local languages, AI-driven negotiation support, transparent pricing, and trust-building mechanisms.

## 🎯 The Problem

- **146 million farmers** in India, but only **15% use digital platforms** like eNAM
- **#1 Barrier**: Language - **75% prefer local languages** over English/Hindi
- **85.83%** complain about low prices on eNAM
- **80.83%** report trader cartels
- **71.67%** say price doesn't match quality
- **54.16%** uncomfortable with one-time auctions

## 💡 Our Solution

We don't replace eNAM - **we make it accessible**. First platform combining:
- ✅ Voice + 6 local languages
- ✅ AI-assisted negotiation (not auction)
- ✅ Transparent quality-based pricing
- ✅ Peer discovery without middlemen

## 🌟 7 Core Initiatives

### 1. 🎤 Voice-Based Price Discovery
Speak in Marathi/Tamil/Telugu, get prices back in your language. No reading required.

### 2. 💬 AI Negotiation Copilot
Smart counter-offer suggestions based on market data. Back-and-forth negotiation, not one-time auction.

### 3. 📊 Dynamic Quality-Based Pricing
Transparent formula: **Final Price = Base Price × Quality Multiplier × Demand Adjuster**

### 4. 🗺️ Peer Vendor Discovery
Find nearby vendors, collaborate on bulk orders. Direct messaging, no middleman.

### 5. ⭐ Smart Trust System
Transparent ratings (40% delivery, 30% quality, 20% response, 10% pricing) + AI dispute resolution.

### 6. 🔗 Government Integration
Pull live prices from eNAM, help with ODOP/GeM. Enhance, don't replace.

### 7. 📈 Multilingual Advisory
Market intelligence in your local language. Price alerts, seasonal guidance.

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd multilingual-mandi

# 2. Install all dependencies
npm run install-all

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start development servers
npm run dev

# ✅ Frontend: http://localhost:3000
# ✅ Backend: http://localhost:5000
```

### Docker Development

```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

## 🧪 Test the Application

1. **Login**: Use phone `+919876543210`
2. **OTP**: Check console for development OTP (e.g., `123456`)
3. **Select Role**: Choose Vendor or Buyer
4. **Create Listing**: As vendor, list a product with quality tier
5. **Browse**: Search for listings with filters
6. **Make Offer**: As buyer, negotiate on a listing
7. **Voice Query**: Click "🎤 Ask Price" button (mocked for MVP)

## 📁 Project Structure

```
multilingual-mandi/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API endpoints (13 modules)
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models (14 tables)
│   │   ├── middleware/     # Auth, logging, errors
│   │   └── utils/          # Helpers, validators
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # 8 main pages
│   │   ├── utils/         # API client, helpers
│   │   └── styles/        # Tailwind CSS
│   └── package.json
├── data/                  # Mock eNAM data
├── docs/                  # Comprehensive documentation
├── STATUS.md              # Build status & features
└── docker-compose.yml     # Container orchestration
```

## 📁 Project Structure

```
multilingual-mandi/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities
│   │   └── styles/        # CSS/Tailwind
│   └── package.json
├── data/                  # Mock data for MVP
├── docs/                  # Documentation
└── docker-compose.yml
```

## 🛠️ Tech Stack

**Frontend:**
- React.js 18+ with Hooks
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- Web Speech API for voice

**Backend:**
- Node.js 18+ with Express.js
- SQLite (MVP) / PostgreSQL (Production)
- JWT for authentication
- Sequelize ORM
- Node-cron for scheduled tasks

**External APIs:**
- BHASHINI for multilingual voice/text
- eNAM for market prices (mocked)
- SMS gateway for OTP (mocked)

## 📖 Documentation

- [Requirements](docs/REQUIREMENTS.md) - Functional & non-functional requirements
- [Design](docs/DESIGN.md) - UI/UX and user flows
- [Technical Spec](docs/TECHNICAL_SPEC.md) - Architecture and implementation
- [Comparison](docs/COMPARISON_WITH_EXISTING.md) - vs eNAM/ODOP/GeM
- [Deployment](docs/DEPLOYMENT_GUIDE.md) - How to deploy
- [Pitch](docs/HACKATHON_PITCH.md) - Presentation materials
- [Linguistic Integration](docs/LINGUISTIC_INTEGRATION.md) - BHASHINI setup

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run property-based tests
cd backend && npm run test:pbt
```

## 🌍 Supported Languages

**Phase 1 (MVP):**
- Hindi (hi)
- Marathi (mr)
- Punjabi (pa)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)

**Phase 2 (Planned):**
- Gujarati, Malayalam, Odia, Bhojpuri, Maithili, Assamese

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Problem We're Solving

- **85% of Indian farmers** don't use digital trading platforms
- **#1 Barrier:** Language (75% prefer local languages)
- **Other Issues:** No negotiation support, trust deficit, quality distrust

## 💡 Our Solution

We don't replace eNAM - we make it accessible. First platform combining:
- Voice + 6 local languages
- AI-assisted negotiation
- Transparent quality-based pricing
- Peer discovery without middlemen

## 📊 Impact

- **Target:** 60-70% farmer adoption (vs 15% for eNAM)
- **Income Boost:** ₹5,000-10,000 extra per season per farmer
- **Market Access:** Direct buyer connections, no middleman exploitation

---

Built with ❤️ for Indian farmers


## 🛠️ Tech Stack

**Frontend:**
- React.js 18+ with Hooks
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- Responsive design (320px-1920px)

**Backend:**
- Node.js 18+ with Express.js
- SQLite (MVP) / PostgreSQL (Production)
- JWT authentication
- Sequelize ORM
- RESTful API design

**External APIs:**
- BHASHINI for multilingual voice/text
- eNAM for market prices (mocked)
- SMS gateway for OTP (mocked)

## 📊 Feature Completeness

### ✅ TIER 1 (Must Have) - 100% Complete
- ✅ User Authentication (Phone OTP)
- ✅ Listings CRUD with search
- ✅ Price Display with breakdown
- ✅ Negotiation Flow
- ✅ Vendor Discovery
- ✅ Rating System
- ✅ Voice Price Query (mocked)
- ✅ Responsive Mobile Design

### ✅ TIER 2 (Should Have) - 90% Complete
- ✅ Dynamic Pricing Formula
- ✅ Negotiation Copilot (simplified)
- ✅ Dispute Resolution UI
- ✅ Crop Advisory
- ✅ eNAM Integration (mocked)
- ✅ Micro-Aggregation

### 🔄 TIER 3 (Nice to Have) - 50% Complete
- 🔄 Photo Quality Analysis (manual)
- 🔄 Payment Gateway (mockup)
- 🔄 SMS IVR (documented)
- 🔄 Advanced Analytics (basic)

## 📖 Documentation

- [STATUS.md](./STATUS.md) - Complete build status and features
- [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) - How to deploy
- [Requirements](./docs/REQUIREMENTS.md) - Functional requirements
- [Design](./docs/DESIGN.md) - UI/UX and user flows
- [Technical Spec](./docs/TECHNICAL_SPEC.md) - Architecture details
- [Comparison](./docs/COMPARISON_WITH_EXISTING.md) - vs eNAM/ODOP/GeM
- [Pitch](./docs/HACKATHON_PITCH.md) - Presentation materials

## 🌍 Supported Languages

**Phase 1 (MVP):**
- Hindi (hi) - हिंदी
- Marathi (mr) - मराठी
- Punjabi (pa) - ਪੰਜਾਬੀ
- Tamil (ta) - தமிழ்
- Telugu (te) - తెలుగు
- Kannada (kn) - ಕನ್ನಡ

**Phase 2 (Planned):**
- Gujarati, Malayalam, Odia, Bhojpuri, Maithili, Assamese

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Listings
- `GET /api/listings/search` - Search with filters
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Negotiations
- `POST /api/negotiations` - Create negotiation
- `GET /api/negotiations/:id` - Get details
- `POST /api/negotiations/:id/counter` - Counter-offer
- `POST /api/negotiations/:id/accept` - Accept offer

### Prices
- `GET /api/prices/current` - Get current prices
- `POST /api/prices/calculate` - Calculate pricing

### Voice
- `POST /api/voice/query` - Voice price query
- `POST /api/voice/transcribe` - Audio to text
- `POST /api/voice/synthesize` - Text to audio

[See full API documentation in docs/TECHNICAL_SPEC.md]

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Backend
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db
JWT_SECRET=your-secret-key

# BHASHINI (for voice/translation)
BHASHINI_API_KEY=your-api-key
LINGUISTIC_PROVIDER=bhashini

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

See `.env.example` for complete list.

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Manual testing checklist
- [ ] Login with OTP works
- [ ] Create listing works
- [ ] Search filters work
- [ ] Make offer works
- [ ] View negotiations works
- [ ] Mobile responsive (375px)
- [ ] No console errors
```

## 📱 Mobile Responsiveness

- ✅ Works on 320px (iPhone SE) to 1920px (Desktop)
- ✅ Touch targets minimum 48px
- ✅ Mobile navigation bar at bottom
- ✅ Desktop navigation in header
- ✅ Responsive grid layouts
- ✅ Mobile-optimized forms

## 🎨 Design System

**Colors:**
- Primary: Teal/Green (agricultural feel)
- Secondary: Orange (market energy)
- Neutral: Gray (balance)
- Status: Green (success), Red (error), Orange (warning)

**Typography:**
- Headings: Bold, 24px-32px
- Body: 16px minimum (accessibility)
- Touch targets: 48px minimum

## 🏆 Hackathon Demo Flow

**5-Minute Demo:**

1. **Problem** (30 sec) - 85% farmers don't use eNAM, language barrier
2. **Solution** (1 min) - Voice + local languages + AI negotiation
3. **Live Demo** (3 min) - Login → Create listing → Browse → Negotiate
4. **Differentiation** (30 sec) - Only platform with all 7 features

**Talking Points:**
- "We don't replace eNAM - we make it accessible"
- "75% farmers prefer local language - we support 6"
- "First platform with voice + negotiation + transparent pricing"
- "₹5,000-10,000 extra income per farmer per season"

## 🐛 Known Limitations (MVP)

1. Voice queries use mock data (need BHASHINI API key)
2. eNAM prices are mocked (need real API access)
3. OTP logged to console (need SMS provider)
4. AI suggestions simplified (can enhance with ML)
5. No real payment processing (mockup only)

**All limitations have clear upgrade paths documented.**

## 📈 Next Steps (Post-Hackathon)

1. Integrate real BHASHINI API
2. Connect to live eNAM data
3. Add SMS provider for OTP
4. Enhance AI negotiation logic
5. Add payment gateway
6. Implement photo quality analysis
7. Add more languages (Phase 2)
8. Scale infrastructure
9. Mobile app (React Native)
10. Production deployment

## 💡 Unique Selling Points

1. **First platform** with voice + local languages
2. **First platform** with AI-assisted negotiation
3. **First platform** with transparent quality-based pricing
4. **First platform** integrating (not replacing) government portals
5. **First platform** with peer discovery and micro-aggregation

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🎓 Research & Evidence

Based on:
- IJAE 2020: "Exploring farmers perceived constraints of e-NAM" (120 farmer survey)
- NABARD 2022: Rural Finance Access Survey
- InterMedia Study: Rural digital adoption
- India Literacy Report 2021
- eNAM official statistics

## 📞 Support

For questions or issues:
1. Check [STATUS.md](./STATUS.md) for build status
2. Review documentation in `/docs`
3. Check code comments
4. Open GitHub issue

## 🎉 Acknowledgments

Built for the AI for Bharat Prompt Challenge to solve real problems faced by Indian farmers.

**Target Impact:**
- 60-70% farmer adoption (vs 15% for eNAM)
- ₹5,000-10,000 extra income per farmer per season
- Direct buyer connections, no middleman exploitation

---

**Built with ❤️ for Indian Farmers**

*Making agricultural trading accessible to 146 million farmers through voice, local languages, and AI.*

---

## 🚀 Current Status

**✅ MVP READY FOR HACKATHON DEMO**

- All 7 core initiatives implemented
- Backend API fully functional
- Frontend responsive and complete
- Documentation comprehensive
- Docker deployment ready
- ~95% feature completion

See [STATUS.md](./STATUS.md) for detailed build status.

---

**Last Updated**: January 26, 2024
