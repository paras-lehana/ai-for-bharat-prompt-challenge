# Technology Stack Documentation

## Overview

The Multilingual Mandi is a full-stack web application built with modern JavaScript technologies, designed for agricultural trading with multilingual support and AI-powered features.

## Frontend Stack

### Core Framework
- **React 18.2.0** - Component-based UI library
  - Functional components with Hooks
  - Context API for state management
  - React Router DOM 6.20.1 for navigation
  
### Styling & UI
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
  - Mobile-first responsive design
  - Custom color schemes for agricultural theme
  - PostCSS 8.4.32 for processing
  - Autoprefixer 10.4.16 for browser compatibility

### Build Tools
- **Vite 5.0.8** - Fast build tool and dev server
  - Hot Module Replacement (HMR)
  - Optimized production builds
  - @vitejs/plugin-react 4.2.1

### Additional Libraries
- **Axios 1.6.2** - HTTP client for API calls
- **React Icons 4.12.0** - Icon library
- **React Markdown 10.1.0** - Markdown rendering
- **Recharts 2.10.3** - Charts for analytics
- **Leaflet 1.9.4** - Maps for vendor discovery
- **React Leaflet 4.2.1** - React wrapper for Leaflet

### File Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── KisaanBot.jsx        # Voice assistant
│   │   ├── NavBar.jsx           # Navigation
│   │   ├── LoadingSpinner.jsx   # Loading states
│   │   └── TranslatedText.jsx   # Translation wrapper
│   ├── pages/            # Route pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── BrowseListings.jsx
│   │   ├── CreateListing.jsx
│   │   ├── ListingDetail.jsx
│   │   ├── MyNegotiations.jsx
│   │   ├── VendorProfile.jsx
│   │   ├── PriceInfo.jsx
│   │   └── Guide.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.js       # Authentication state
│   ├── hooks/            # Custom hooks
│   │   └── useTranslation.js    # Translation hook
│   ├── utils/            # Utilities
│   │   ├── api.js               # API client
│   │   └── cropImageMapper.js   # Image mapping
│   ├── styles/           # Global styles
│   │   └── index.css
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/
│   └── images/
│       └── crops/        # Local crop images
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Backend Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
  - RESTful API design
  - Middleware-based architecture
  - Route modularization

### Database
- **SQLite 5.1.6** - Embedded database (MVP/Development)
  - Single file database
  - Zero configuration
  - Easy deployment
- **Sequelize 6.35.0** - ORM (Object-Relational Mapping)
  - Model definitions
  - Migrations support
  - Query abstraction
  - PostgreSQL-ready for production

### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2** - Token-based authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Express Rate Limit 7.1.5** - API rate limiting
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### File Handling
- **Multer 1.4.5-lts.1** - File upload middleware
  - Image uploads for listings
  - Audio uploads for voice queries

### External API Integration
- **Axios 1.6.2** - HTTP client
  - SARVAM API (Speech-to-Text, Text-to-Speech)
  - OpenRouter AI (Intent extraction, negotiation analysis)
  - eNAM price data

### Utilities
- **Node-cron 3.0.3** - Scheduled tasks
  - Negotiation expiration
  - Market advisory notifications
- **Winston 3.11.0** - Logging
  - Error tracking
  - Request logging
  - Debug information
- **UUID 9.0.1** - Unique ID generation
- **Joi 17.11.0** - Data validation

### File Structure
```
backend/
├── src/
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── listings.js
│   │   ├── negotiations.js
│   │   ├── prices.js
│   │   ├── vendors.js
│   │   ├── voice.js
│   │   ├── ratings.js
│   │   ├── disputes.js
│   │   ├── messages.js
│   │   ├── discovery.js
│   │   ├── transactions.js
│   │   ├── advisory.js
│   │   └── analytics.js
│   ├── services/         # Business logic
│   │   ├── AIService.js         # OpenRouter integration
│   │   ├── AuthService.js       # Authentication
│   │   ├── PricingService.js    # Price calculations
│   │   ├── TranslationService.js # SARVAM integration
│   │   └── TrustService.js      # Trust score calculations
│   ├── models/           # Database models (Sequelize)
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Negotiation.js
│   │   ├── Transaction.js
│   │   ├── Rating.js
│   │   ├── Message.js
│   │   └── ... (14 models total)
│   ├── middleware/       # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── logger.js            # Request logging
│   ├── utils/            # Utilities
│   │   ├── database.js          # DB initialization
│   │   ├── validators.js        # Input validation
│   │   └── seed.js              # Seed data
│   └── app.js            # Express app setup
├── data/                 # Static data
├── logs/                 # Log files
├── mandi.db              # SQLite database file
└── package.json
```

## External Services & APIs

### SARVAM API
- **Purpose**: Speech-to-Text (STT) and Text-to-Speech (TTS)
- **Endpoint**: https://api.sarvam.ai
- **Features**:
  - Voice transcription in 22 Indian languages
  - Audio synthesis for voice responses
  - High accuracy for regional accents
- **Usage**: Voice queries, Kisaan Bot

### OpenRouter AI
- **Purpose**: AI-powered intent extraction and analysis
- **Model**: Qwen/Qwen2.5-72B-Instruct
- **Endpoint**: https://openrouter.ai/api/v1
- **Features**:
  - Intent extraction from voice queries
  - Negotiation counter-offer suggestions
  - Listing description generation
- **Usage**: Voice interface, negotiation engine

### eNAM API (Mocked)
- **Purpose**: Market price data
- **Status**: Mocked for MVP (real API integration planned)
- **Features**:
  - Live crop prices from mandis
  - Historical price trends
  - Regional price variations
- **Usage**: Price discovery, market advisory

## Development Tools

### Root Level
- **Concurrently 8.2.2** - Run multiple npm scripts
  - Simultaneous frontend and backend development
  - Single command to start both servers

### Testing
- **Jest 29.7.0** - Testing framework (backend)
- **Supertest 6.3.3** - HTTP assertion library
- **Fast-check 3.15.0** - Property-based testing
- **Custom test scripts** - API integration tests

### DevOps
- **Docker** - Containerization
  - Dockerfile.backend
  - Dockerfile.frontend
  - docker-compose.yml
- **Environment Variables** - Configuration
  - .env files for secrets
  - .env.example for templates

## Database Schema

### Core Tables
1. **users** - User accounts and profiles
2. **otps** - OTP verification codes
3. **listings** - Product listings
4. **negotiations** - Negotiation sessions
5. **offers** - Individual offers in negotiations
6. **transactions** - Completed transactions
7. **ratings** - User ratings
8. **trust_scores** - Vendor trust scores
9. **disputes** - Dispute cases
10. **evidence** - Dispute evidence
11. **messages** - Direct messages
12. **enam_prices** - Cached market prices

### Relationships
- Users → Listings (one-to-many)
- Listings → Negotiations (one-to-many)
- Negotiations → Offers (one-to-many)
- Negotiations → Transactions (one-to-one)
- Transactions → Ratings (one-to-one)
- Users → Trust Scores (one-to-one)
- Transactions → Disputes (one-to-one)
- Users ↔ Messages (many-to-many)

## API Architecture

### RESTful Design
- **Base URL**: http://localhost:5000/api
- **Authentication**: JWT Bearer tokens
- **Content Type**: application/json
- **Error Format**: Consistent JSON error responses

### Endpoint Categories
1. **/auth** - Authentication (OTP, login, profile)
2. **/listings** - Product listings CRUD
3. **/negotiations** - Negotiation management
4. **/prices** - Market price queries
5. **/vendors** - Vendor discovery
6. **/voice** - Voice interface
7. **/ratings** - Rating submission
8. **/disputes** - Dispute resolution
9. **/messages** - Messaging
10. **/discovery** - Vendor discovery
11. **/transactions** - Transaction management
12. **/advisory** - Market advisory
13. **/analytics** - Analytics dashboard

## Deployment Architecture

### Development
```
┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │
│ Vite:3001   │     │ Express:5000│
└─────────────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   SQLite    │
                    │  mandi.db   │
                    └─────────────┘
```

### Production (Docker)
```
┌──────────────────────────────────┐
│         Docker Network           │
│                                  │
│  ┌─────────────┐  ┌────────────┐│
│  │  Frontend   │  │  Backend   ││
│  │  Container  │  │ Container  ││
│  │  (Nginx)    │  │ (Node.js)  ││
│  └──────┬──────┘  └─────┬──────┘│
│         │                │       │
│         └────────┬───────┘       │
│                  │               │
│         ┌────────▼────────┐      │
│         │   PostgreSQL    │      │
│         │   Container     │      │
│         └─────────────────┘      │
└──────────────────────────────────┘
```

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3001

# SARVAM API
SARVAM_API_KEY=your-sarvam-key
SARVAM_API_URL=https://api.sarvam.ai

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct

# eNAM (future)
ENAM_API_KEY=your-enam-key
ENAM_API_URL=https://api.enam.gov.in
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

## Performance Considerations

### Frontend Optimizations
- Lazy loading of images
- Code splitting with React Router
- Memoization of expensive computations
- Debounced search inputs
- Cached translations

### Backend Optimizations
- Database indexing on frequently queried fields
- API response caching (eNAM prices)
- Rate limiting to prevent abuse
- Connection pooling for database
- Gzip compression for responses

### Network Optimizations
- CDN for static assets (production)
- Image compression and optimization
- Minified JavaScript bundles
- HTTP/2 support
- CORS preflight caching

## Security Measures

### Authentication
- JWT tokens with expiration
- Secure OTP generation
- Phone number validation
- Session management

### Data Protection
- Input validation with Joi
- SQL injection prevention (Sequelize ORM)
- XSS protection (React escaping)
- CSRF protection
- Rate limiting

### API Security
- CORS configuration
- API key management
- Request size limits
- Error message sanitization
- Logging and monitoring

## Testing Strategy

### Unit Tests
- Service layer logic
- Utility functions
- Model validations
- Middleware functions

### Integration Tests
- API endpoint testing
- Database operations
- External API mocking
- Authentication flows

### Property-Based Tests
- Pricing formula correctness
- Trust score calculations
- Search criteria matching
- Data round-trip consistency

### Manual Testing
- Voice interface functionality
- UI/UX flows
- Mobile responsiveness
- Cross-browser compatibility

## Future Enhancements

### Planned Upgrades
1. **Database**: Migrate to PostgreSQL for production
2. **Real-time**: WebSocket for live messaging
3. **Mobile**: React Native mobile app
4. **Payment**: Payment gateway integration
5. **ML**: Enhanced AI for quality analysis
6. **Scale**: Kubernetes orchestration
7. **Monitoring**: Application performance monitoring
8. **Analytics**: Advanced business intelligence

### API Integrations
- Real eNAM API connection
- SMS gateway for OTP
- Payment processors
- Cloud storage for images
- Push notification services

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Maintainer**: Multilingual Mandi Team
