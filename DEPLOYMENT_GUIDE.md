# Deployment Guide - Multilingual Mandi

**Last Updated**: January 30, 2026  
**Platform Status**: Ready for Deployment  
**Completion**: 87.5% Frontend, 100% Backend

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git
- Docker (optional, for containerized deployment)

### Local Development Setup

#### 1. Clone and Install
```bash
# Clone repository
cd /root/repo/ai-for-bharat-prompt-challenge

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Environment Configuration

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=./database.sqlite

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# APIs
SARVAM_API_KEY=your-sarvam-key
OPENROUTER_API_KEY=your-openrouter-key
GOOGLE_TRANSLATE_API_KEY=your-google-key

# CORS
ALLOWED_ORIGINS=http://localhost:3001,https://lokalmandi.lehana.in
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

#### 3. Database Setup
```bash
cd backend
node src/utils/seed.js
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access**: http://localhost:3001

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose -f docker-compose.lokalmandi.yml up -d

# View logs
docker-compose -f docker-compose.lokalmandi.yml logs -f

# Stop services
docker-compose -f docker-compose.lokalmandi.yml down
```

### Manual Docker Build

**Backend:**
```bash
cd backend
docker build -t lokalmandi-backend .
docker run -p 5000:5000 --env-file .env lokalmandi-backend
```

**Frontend:**
```bash
cd frontend
docker build -t lokalmandi-frontend .
docker run -p 3001:80 lokalmandi-frontend
```

---

## ☁️ Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel
```bash
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL`

#### Backend on Render
1. Connect GitHub repository
2. Select `backend` directory
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables

### Option 2: Railway (Full Stack)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Configure backend service:
   - Source: `backend/`
   - Build: `npm install`
   - Run: `npm start`
3. Configure frontend service:
   - Source: `frontend/`
   - Build: `npm run build`
   - Output: `dist/`

---

## 🔧 Configuration

### Backend Configuration

**Database Options:**
- SQLite (default, for development)
- PostgreSQL (recommended for production)

**To switch to PostgreSQL:**
```javascript
// backend/src/utils/database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});
```

### Frontend Configuration

**API URL:**
Update based on deployment:
```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.lokalmandi.lehana.in/api
```

---

## 🧪 Testing Before Deployment

### 1. Backend API Tests
```bash
cd backend

# Test health endpoint
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'

# Test listings
curl http://localhost:5000/api/listings/search
```

### 2. Frontend Tests
```bash
cd frontend

# Build test
npm run build

# Preview production build
npm run preview
```

### 3. Integration Tests
- [ ] Complete user registration flow
- [ ] Create and browse listings
- [ ] Initiate negotiations
- [ ] Send messages
- [ ] Create transactions
- [ ] Submit ratings
- [ ] View analytics

---

## 📊 Monitoring & Logging

### Backend Logging
```javascript
// Already implemented in backend/src/middleware/logger.js
// Logs all requests with timestamps
```

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- New Relic for performance monitoring

### Health Checks
```bash
# Backend health
curl https://api.lokalmandi.lehana.in/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-30T...",
  "service": "Lokal Mandi API"
}
```

---

## 🔒 Security Checklist

### Before Production
- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domains only
- [ ] Set secure cookie flags
- [ ] Enable rate limiting (already configured)
- [ ] Sanitize user inputs (already implemented)
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Configure environment variables securely
- [ ] Remove debug/console logs

### API Security
- [x] JWT authentication implemented
- [x] Rate limiting configured
- [x] Input validation in place
- [x] Error handling without sensitive data
- [x] CORS properly configured

---

## 🗄️ Database Management

### Backup Strategy
```bash
# SQLite backup
cp backend/database.sqlite backend/database.backup.sqlite

# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql
```

### Migration Strategy
```bash
# Run migrations (if using Sequelize migrations)
cd backend
npx sequelize-cli db:migrate

# Seed production data
node src/utils/seed.js
```

---

## 🚦 Performance Optimization

### Frontend Optimization
- [x] Code splitting (Vite handles automatically)
- [x] Lazy loading images
- [x] Minification and compression
- [ ] CDN for static assets (optional)
- [ ] Service worker for caching (optional)

### Backend Optimization
- [x] Database indexing
- [x] API response caching
- [x] Efficient queries
- [ ] Redis for session storage (optional)
- [ ] Load balancing (for high traffic)

---

## 📱 Mobile Deployment

### Progressive Web App (PWA)
```javascript
// Add to frontend/vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Multilingual Mandi',
        short_name: 'Mandi',
        description: 'Agricultural trading platform',
        theme_color: '#10b981',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          npm test
          # Deploy to production
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to production
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: CORS errors**
```javascript
// Solution: Update CORS origins in backend/src/app.js
const allowedOrigins = [
  'https://your-frontend-domain.com'
];
```

**Issue: Database connection fails**
```bash
# Solution: Check DATABASE_URL and permissions
echo $DATABASE_URL
```

**Issue: API calls fail**
```javascript
// Solution: Verify VITE_API_URL in frontend
console.log(import.meta.env.VITE_API_URL)
```

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```

---

## 📋 Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database seeded with initial data
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Health checks passing
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Monitoring dashboards set up
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

## 🎯 Production URLs

**Frontend**: https://lokalmandi.lehana.in  
**Backend API**: https://lokalmandi.lehana.in/api  
**Health Check**: https://lokalmandi.lehana.in/api/health

---

## 📚 Additional Resources

- [Backend API Documentation](./docs/API_MODIFICATION_GUIDE.md)
- [Code Architecture](./docs/CODE_ARCHITECTURE.md)
- [Testing Strategy](./docs/TESTING_STRATEGY.md)
- [Tech Stack Details](./docs/TECH_STACK.md)

---

**Deployment Status**: ✅ Ready for Production  
**Last Tested**: January 30, 2026  
**Platform Version**: 1.0.0

