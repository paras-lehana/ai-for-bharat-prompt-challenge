# Project Structure & Organization

## Root Directory Structure
```
multilingual-mandi/
├── backend/                 # Node.js/Express API server
├── frontend/               # React application
├── data/                   # Configuration and assets
├── docs/                   # Comprehensive documentation
├── test/                   # Test scripts and guides
├── tests/                  # Test results and reports
├── .kiro/                  # Kiro configuration and specs
├── docker-compose.yml      # Container orchestration
└── package.json           # Root package with scripts
```

## Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── app.js             # Main Express application
│   ├── routes/            # API endpoints (13 modules)
│   │   ├── auth.js        # Authentication routes
│   │   ├── listings.js    # Product listing routes
│   │   ├── negotiations.js # Negotiation routes
│   │   └── ...            # 10 more route modules
│   ├── services/          # Business logic layer
│   │   ├── AuthService.js # Authentication logic
│   │   ├── AIService.js   # AI/ML integration
│   │   ├── PricingService.js # Price calculations
│   │   └── ...            # 11 more service modules
│   ├── models/            # Database models (14 tables)
│   │   ├── User.js        # User model
│   │   ├── Listing.js     # Product listing model
│   │   ├── index.js       # Model associations
│   │   └── ...            # 12 more models
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── logger.js      # Request logging
│   └── utils/             # Utilities and helpers
│       ├── database.js    # Database initialization
│       ├── seed.js        # Test data seeding
│       └── validators.js  # Input validation
├── logs/                  # Application logs
├── mandi.db              # SQLite database file
└── package.json          # Backend dependencies
```

## Frontend Structure (`/frontend`)
```
frontend/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   ├── components/       # Reusable UI components
│   │   ├── NavBar.jsx    # Navigation component
│   │   ├── KisaanBot.jsx # Voice interface component
│   │   └── ...           # 3 more components
│   ├── pages/            # Route-based page components
│   │   ├── Home.jsx      # Dashboard/home page
│   │   ├── BrowseListings.jsx # Product browsing
│   │   ├── CreateListing.jsx  # Create new listing
│   │   └── ...           # 10 more pages
│   ├── context/          # React context providers
│   │   └── AuthContext.js # Authentication state
│   ├── hooks/            # Custom React hooks
│   │   └── useTranslation.js # Translation hook
│   ├── utils/            # Frontend utilities
│   │   ├── api.js        # API client with all endpoints
│   │   └── cropImageMapper.js # Image mapping utility
│   └── styles/           # CSS and styling
│       └── index.css     # Tailwind CSS imports
├── public/               # Static assets
│   └── images/crops/     # Crop images (10 images)
└── package.json          # Frontend dependencies
```

## Configuration & Data (`/data`)
```
data/
├── assets-config.json    # Central configuration file
│   ├── crops[]          # Crop definitions with multilingual names
│   ├── qualityTiers[]   # Quality grades and multipliers
│   ├── languages[]      # Supported languages
│   ├── units[]          # Measurement units
│   └── pricingConfig    # Pricing formula parameters
├── mock_enam_prices.json # Mock market price data
└── README.md            # Assets configuration guide
```

## Documentation (`/docs`)
```
docs/
├── FEATURES.md           # Complete feature list
├── FEATURES_GUIDE.md     # Step-by-step usage guide
├── DEPLOYMENT_GUIDE.md   # Production deployment
├── ASSETS_CONFIGURATION.md # Detailed assets guide
├── history/              # Historical reports and status
├── guides/               # Quick reference guides
└── fixes/                # Bug fix documentation
```

## Testing (`/test` & `/tests`)
```
test/                     # Test scripts and guides
├── test-*.js            # API test scripts
├── VOICE_TESTING_GUIDE.md # Voice testing instructions
└── sample_add_listing.m4a # Sample audio file

tests/                    # Test results and reports
├── test-all-apis.js     # Comprehensive API tests
├── test-results-*.json  # Test execution results
└── TEST_SUMMARY.md      # Testing summary
```

## Key File Patterns

### Service Layer Pattern
- Each service handles one domain (Auth, Pricing, AI, etc.)
- Services contain business logic, not HTTP handling
- Services are imported by route handlers
- Example: `AuthService.js` handles OTP generation/verification

### Route-Service Pattern
- Routes handle HTTP requests/responses
- Routes delegate business logic to services
- Routes handle validation and error responses
- Example: `/api/auth` routes call `AuthService` methods

### Model Associations
- All model relationships defined in `models/index.js`
- Foreign key relationships properly established
- Sequelize associations for joins and includes

### API Client Pattern
- Frontend API calls centralized in `utils/api.js`
- Automatic token attachment via interceptors
- Error handling and redirects on 401
- Organized by feature domain (authAPI, listingsAPI, etc.)

### Configuration Centralization
- All app configuration in `data/assets-config.json`
- Multilingual content, pricing rules, feature flags
- Single source of truth for crops, languages, units
- Environment-specific overrides in `.env`

## Naming Conventions
- **Files**: PascalCase for components/services, camelCase for utilities
- **API Endpoints**: RESTful with plural nouns (`/api/listings`)
- **Database**: camelCase fields, PascalCase model names
- **Components**: PascalCase React components
- **Variables**: camelCase throughout