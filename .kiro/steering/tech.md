# Technology Stack & Build System

## Architecture
Full-stack web application with separate frontend and backend services.

## Frontend Stack
- **Framework**: React 18+ with Hooks
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Additional**: React Icons, React Markdown, Recharts, Leaflet

## Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (MVP) / PostgreSQL (Production)
- **ORM**: Sequelize
- **Authentication**: JWT with phone OTP
- **Additional**: Winston (logging), Node-cron, Multer, Rate limiting

## External APIs
- **BHASHINI**: Multilingual voice/text processing
- **eNAM**: Market prices (mocked in MVP)
- **Sarvam AI**: Speech-to-text, text-to-speech, translation
- **OpenRouter**: AI model access for negotiation assistance

## Development Commands

### Initial Setup
```bash
# Install all dependencies
npm run install-all

# Set up environment
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only  
npm run dev:frontend

# Seed database with test data
cd backend && npm run seed
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Property-based tests
cd backend && npm run test:pbt

# Manual API testing
node test/test-all-apis.js
```

### Production Build
```bash
# Build both services
npm run build

# Start production server
npm start
```

### Docker Development
```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

## Environment Variables
Required in `.env`:
- `NODE_ENV` - development/production
- `PORT` - Backend port (default: 5000)
- `DATABASE_URL` - Database connection
- `JWT_SECRET` - JWT signing secret
- `BHASHINI_API_KEY` - Voice/translation API key
- `FRONTEND_URL` - Frontend URL for CORS

## Database
- **Development**: SQLite with file storage
- **Models**: 14 tables (User, Listing, Negotiation, Transaction, etc.)
- **Migrations**: Handled by Sequelize auto-sync
- **Seeding**: `npm run seed` for test data

## API Structure
RESTful API with 13 route modules:
- `/api/auth` - Authentication
- `/api/listings` - Product listings
- `/api/negotiations` - Offer negotiations
- `/api/prices` - Price information
- `/api/voice` - Voice interface
- `/api/vendors` - Vendor profiles
- And 7 more modules

## Code Organization
- **Services**: Business logic layer
- **Models**: Database entities
- **Routes**: API endpoints
- **Middleware**: Auth, logging, error handling
- **Utils**: Helpers, validators, database setup

## Deployment
- **Development**: Local with hot reload
- **Docker**: Multi-container setup
- **Production**: Node.js server with reverse proxy
- **Static Assets**: Served from `/frontend/public`