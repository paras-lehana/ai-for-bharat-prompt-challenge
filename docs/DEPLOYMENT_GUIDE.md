# Deployment Guide

Complete guide to deploying The Multilingual Mandi platform.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Docker (optional, for containerized deployment)
- Git

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd multilingual-mandi
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Environment Configuration

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Backend
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db
JWT_SECRET=your-secret-key-change-in-production

# BHASHINI API (for voice/translation)
BHASHINI_API_KEY=your-bhashini-api-key
LINGUISTIC_PROVIDER=bhashini

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 3000
```

### 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Docker Deployment

### Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start containers
docker-compose up

# Run in background
docker-compose up -d

# Stop containers
docker-compose down
```

### Individual Docker Commands

```bash
# Build backend
docker build -f Dockerfile.backend -t mandi-backend .

# Build frontend
docker build -f Dockerfile.frontend -t mandi-frontend .

# Run backend
docker run -p 5000:5000 --env-file .env mandi-backend

# Run frontend
docker run -p 3000:3000 mandi-frontend
```

## Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Deploy Frontend to Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `VITE_API_URL`: Your backend URL

#### Deploy Backend to Render

1. Create account at render.com
2. Connect GitHub repository
3. Create new Web Service
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Copy from `.env`

### Option 2: AWS Deployment

#### Backend on EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repository-url>
cd multilingual-mandi/backend
npm install
npm start
```

#### Frontend on S3 + CloudFront

```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront distribution
```

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create mandi-backend
heroku create mandi-frontend

# Deploy backend
cd backend
git push heroku main

# Deploy frontend
cd frontend
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set BHASHINI_API_KEY=your-key
```

## Database Setup

### SQLite (Development)

Automatically created on first run. No setup needed.

### PostgreSQL (Production)

```bash
# Install PostgreSQL
sudo apt-get install postgresql

# Create database
sudo -u postgres createdb mandi_db

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/mandi_db
```

## Environment Variables

### Required Variables

```env
# Backend
NODE_ENV=production
PORT=5000
DATABASE_URL=<your-database-url>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d

# BHASHINI
BHASHINI_API_KEY=<your-api-key>
BHASHINI_API_URL=https://api.bhashini.gov.in
LINGUISTIC_PROVIDER=bhashini

# CORS
FRONTEND_URL=<your-frontend-url>
CORS_ORIGIN=<your-frontend-url>
```

### Optional Variables

```env
# SMS/OTP (if using real SMS)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_PHONE_NUMBER=<your-number>

# eNAM Integration
ENAM_API_KEY=<your-key>
ENAM_API_URL=https://api.enam.gov.in
```

## Testing Before Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] Frontend builds without errors
- [ ] Authentication flow works
- [ ] Listings can be created
- [ ] Search functionality works
- [ ] Negotiations can be initiated
- [ ] Mobile responsive (test at 375px)
- [ ] No console errors
- [ ] HTTPS enabled (production)

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Manual Testing

1. Create account with OTP
2. Create a listing (vendor)
3. Search for listings
4. Make an offer (buyer)
5. View negotiations
6. Check price information
7. Test on mobile device

## Monitoring & Logging

### Application Logs

```bash
# View backend logs
tail -f backend/logs/requests.log
tail -f backend/logs/error.log

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Monitoring

Set up monitoring for:
- `/health` endpoint (should return 200)
- Database connectivity
- API response times
- Error rates

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Performance**: New Relic, DataDog
- **Logs**: Papertrail, Loggly

## Backup & Recovery

### Database Backup

```bash
# SQLite backup
cp mandi.db mandi.db.backup

# PostgreSQL backup
pg_dump mandi_db > backup.sql

# Restore
psql mandi_db < backup.sql
```

### Automated Backups

Set up cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, AWS ELB)
- Deploy multiple backend instances
- Use Redis for session storage
- CDN for static assets

### Database Scaling

- Migrate from SQLite to PostgreSQL
- Set up read replicas
- Implement connection pooling
- Add database indexes

### Caching

- Redis for API responses
- CDN for frontend assets
- Browser caching headers

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process
lsof -i :5000
# Kill process
kill -9 <PID>
```

**Database connection failed:**
- Check DATABASE_URL format
- Verify database is running
- Check firewall rules

**CORS errors:**
- Verify CORS_ORIGIN matches frontend URL
- Check protocol (http vs https)

**Build fails:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] JWT_SECRET is strong and random
- [ ] Database credentials secured
- [ ] API rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Logs don't contain sensitive data

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check GitHub issues
4. Contact team

## Updates & Maintenance

### Updating Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm run install-all

# Restart services
docker-compose restart
# or
pm2 restart all
```

### Database Migrations

```bash
# Run migrations
cd backend
npm run migrate

# Rollback if needed
npm run migrate:rollback
```

---

**Deployment Status**: ✅ Ready for Production

Last Updated: January 2024
