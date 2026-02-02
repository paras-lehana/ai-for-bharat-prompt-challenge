# 🐳 Lokal Mandi - Lehana.in Docker Deployment Guide

**Version**: 4.7  
**Last Updated**: 2026-02-02  
**Status**: Production-Ready ✅

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Architecture Overview](#-architecture-overview)
3. [Prerequisites](#-prerequisites)
4. [Deployment Steps](#-deployment-steps)
5. [Environment Configuration](#-environment-configuration)
6. [Health Checks & Monitoring](#-health-checks--monitoring)
7. [Testing](#-testing)
8. [Troubleshooting](#-troubleshooting)
9. [Maintenance](#-maintenance)

---

## 🚀 Quick Start

### Deploy on Lehana.in Infrastructure

```bash
# 1. Navigate to project directory
cd /root/repo/ai-for-bharat-prompt-challenge

# 2. Configure environment (copy from Lehana root or create new)
cp .env.lehana .env
nano .env  # Add your API keys

# 3. Build and deploy
docker compose -f docker-compose.lehana.yml up -d --build

# 4. Verify deployment
docker compose -f docker-compose.lehana.yml ps
docker compose -f docker-compose.lehana.yml logs -f

# 5. Test endpoints
curl -k https://lokalmandi.lehana.in/health
curl -k https://api.lehana.in/lokalmandi/health
```

**Access URLs**:
- Frontend: https://lokalmandi.lehana.in (also works on .aidhunik.com)
- Backend API: https://api.lehana.in/lokalmandi/* (also works on .aidhunik.com)

---

## 🏗️ Architecture Overview

### Service Architecture

```
                    ┌─────────────────────────────────┐
                    │   Traefik Reverse Proxy         │
                    │   (172.18.0.2)                  │
                    │   - SSL Termination             │
                    │   - Dual Domain Routing         │
                    └──────────┬──────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
    ┌───────────▼──────────┐     ┌───────────▼──────────┐
    │  Frontend Container  │     │  Backend Container   │
    │  (lokalmandi-frontend│     │  (lokalmandi-backend)│
    │  172.18.0.51:80)     │     │  172.18.0.50:5000)   │
    │                      │     │                      │
    │  - Nginx + React SPA │     │  - Node.js/Express   │
    │  - Static Assets     │────▶│  - SQLite Database   │
    │  - Service Worker    │     │  - REST API          │
    └──────────────────────┘     └──────────┬───────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │ Volumes:        │
                                   │ - data/         │
                                   │ - logs/         │
                                   │ - uploads/      │
                                   └─────────────────┘
```

### Network Configuration

- **Network**: `root_default` (external, shared with all Lehana services)
- **Backend Static IP**: `172.18.0.50`
- **Frontend Static IP**: `172.18.0.51`
- **Subnet**: `172.18.0.0/16`

### Routing Rules

| Service | URL Pattern | Traefik Rule | Priority |
|---------|-------------|--------------|----------|
| Frontend | `lokalmandi.lehana.in` | Host match | 110 |
| Frontend | `lokalmandi.aidhunik.com` | Host match | 110 |
| Backend | `api.lehana.in/lokalmandi/*` | Host + PathPrefix | 100 |
| Backend | `api.aidhunik.com/lokalmandi/*` | Host + PathPrefix | 100 |

**Path Stripping**: Backend middleware strips `/lokalmandi` prefix, so:
- External: `https://api.lehana.in/lokalmandi/listings`
- Internal: `http://172.18.0.50:5000/api/listings`

---

## ✅ Prerequisites

### System Requirements

- **Docker**: 20.10+ with Compose V2
- **Network**: Must join `root_default` network (created by main infrastructure)
- **Ports**: 172.18.0.50 and 172.18.0.51 must be available
- **DNS**: Records must point to server (both .lehana.in and .aidhunik.com)

### Check Prerequisites

```bash
# Verify Docker
docker --version
docker compose version

# Verify root_default network exists
docker network ls | grep root_default

# Check IP availability (should return no results)
docker ps --format '{{.Names}}\t{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' | grep -E '172.18.0.50|172.18.0.51'

# Test DNS resolution (both domains)
nslookup lokalmandi.lehana.in
nslookup lokalmandi.aidhunik.in
```

---

## 📦 Deployment Steps

### Step 1: Prepare Environment

```bash
# Create .env file from template
cp .env.lehana .env

# Add API keys (critical for multilingual features)
nano .env
```

Required environment variables:
```env
# CRITICAL: Change these in production
JWT_SECRET=your-random-jwt-secret-here  # Generate with: openssl rand -base64 32

# API Keys for multilingual features
SARVAM_API_KEY=your-sarvam-key         # Indian language STT/TTS
OPENROUTER_API_KEY=your-openrouter-key # AI features
BHASHINI_API_KEY=your-bhashini-key     # Translation (optional)
```

### Step 2: Build Images

```bash
# Build both services
docker compose -f docker-compose.lehana.yml build

# Or build individually
docker compose -f docker-compose.lehana.yml build lokalmandi-backend
docker compose -f docker-compose.lehana.yml build lokalmandi-frontend
```

**Build Process**:
- **Backend**: Multi-stage Node.js build (dependencies → production)
- **Frontend**: Multi-stage Vite build (compile → Nginx static)

### Step 3: Deploy Services

```bash
# Start services in detached mode
docker compose -f docker-compose.lehana.yml up -d

# Monitor startup logs
docker compose -f docker-compose.lehana.yml logs -f
```

**Expected Output**:
```
✅ Database initialized successfully
✅ Cron jobs initialized successfully
🚀 Lokal Mandi API running on port 5000
📍 Environment: production
```

### Step 4: Verify Deployment

```bash
# Check container status
docker compose -f docker-compose.lehana.yml ps

# Should show:
# lokalmandi-backend    healthy
# lokalmandi-frontend   healthy

# Check health endpoints
curl -k https://api.lehana.in/lokalmandi/health
curl -k https://lokalmandi.lehana.in/
```

---

## 🔧 Environment Configuration

### Required Variables (Production)

```env
# Security (CRITICAL)
JWT_SECRET=CHANGE_ME_USE_openssl_rand_base64_32

# API Keys (Required for features)
SARVAM_API_KEY=your-key      # Voice & translation
OPENROUTER_API_KEY=your-key  # AI features
```

### Optional Variables

```env
# Translation Provider
LINGUISTIC_PROVIDER=sarvam   # Options: sarvam, bhashini, mock

# SMS/OTP (use mock for testing)
SMS_PROVIDER=mock            # Options: mock, twilio

# Database (default SQLite, can upgrade to Postgres)
DATABASE_URL=sqlite:/app/data/mandi.db
```

### Loading Environment

**Option 1: Copy to container runtime** (Recommended)
```bash
# Copy .env to /root/.env (shared by all services)
cp .env /root/.env
docker compose -f docker-compose.lehana.yml up -d
```

**Option 2: Use env_file in docker-compose**
```yaml
services:
  lokalmandi-backend:
    env_file:
      - .env
```

---

## 💚 Health Checks & Monitoring

### Health Endpoints

| Service | Endpoint | Expected Response |
|---------|----------|-------------------|
| Frontend | `https://lokalmandi.lehana.in/` | HTTP 200, HTML |
| Backend | `https://api.lehana.in/lokalmandi/health` | `{"status":"ok"}` |

### Docker Health Status

```bash
# Check all container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# View health check logs
docker inspect lokalmandi-backend --format='{{json .State.Health}}' | jq .

# Monitor health over time
watch -n 5 'docker ps --filter name=lokalmandi --format "table {{.Names}}\t{{.Status}}"'
```

### Monitoring with Health Monitor

```bash
# Add to /root/utils/health-monitor/config.json
{
  "name": "Lokal Mandi Frontend",
  "url": "https://lokalmandi.lehana.in/",
  "enabled": true,
  "timeout": 10,
  "expected_status": 200
},
{
  "name": "Lokal Mandi Backend",
  "url": "http://lokalmandi-backend:5000/health",
  "enabled": true,
  "timeout": 10,
  "expected_status": 200
}

# Then restart health monitor
cd /root/utils/health-monitor && docker compose restart
```

---

## 🧪 Testing

### Quick Smoke Tests

```bash
# Frontend loads
curl -I https://lokalmandi.lehana.in/
# Expected: HTTP/2 200

# Backend health
curl https://api.lehana.in/lokalmandi/health
# Expected: {"status":"ok","timestamp":"...","service":"Lokal Mandi API"}

# Test both domains
curl -I https://lokalmandi.aidhunik.com/
curl https://api.aidhunik.com/lokalmandi/health
```

### Comprehensive API Tests

```bash
# Use existing test suite
cd /root/repo/ai-for-bharat-prompt-challenge
node test/test-all-apis.js

# Or manual API tests
# 1. Register user
curl -X POST https://api.lehana.in/lokalmandi/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","name":"Test Farmer","role":"farmer"}'

# 2. Send OTP
curl -X POST https://api.lehana.in/lokalmandi/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210"}'

# 3. Verify OTP (use OTP from logs if mock provider)
curl -X POST https://api.lehana.in/lokalmandi/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","otp":"123456"}'
```

### Load Testing

```bash
# Apache Bench - 100 requests, 10 concurrent
ab -n 100 -c 10 https://lokalmandi.lehana.in/

# Expected: 
# - Requests per second: > 50
# - Failed requests: 0
# - Time per request: < 200ms
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. 502 Bad Gateway

**Symptoms**: Traefik returns 502 when accessing URLs

**Diagnosis**:
```bash
# Check if backend is running
docker ps | grep lokalmandi-backend

# Check backend logs
docker logs lokalmandi-backend --tail 50

# Verify health check
docker inspect lokalmandi-backend --format='{{.State.Health.Status}}'
```

**Solutions**:
```bash
# Restart backend
docker compose -f docker-compose.lehana.yml restart lokalmandi-backend

# Or rebuild if code changed
docker compose -f docker-compose.lehana.yml up -d --build lokalmandi-backend
```

#### 2. Health Check Failing

**Symptoms**: Container shows "unhealthy" status

**Diagnosis**:
```bash
# Check health check command
docker inspect lokalmandi-backend --format='{{json .State.Health.Log}}' | jq .

# Test health endpoint directly
docker exec lokalmandi-backend curl -f http://localhost:5000/health
```

**Solutions**:
- Verify `/health` endpoint exists (not `/api/health`)
- Check if Node.js process is running inside container
- Increase health check timeout/start_period if slow startup

#### 3. Database Errors

**Symptoms**: "SQLITE_CANTOPEN" or database errors in logs

**Diagnosis**:
```bash
# Check volume permissions
docker exec lokalmandi-backend ls -la /app/data/

# Check if volume exists
docker volume ls | grep lokalmandi
```

**Solutions**:
```bash
# Recreate volume with proper permissions
docker compose -f docker-compose.lehana.yml down
docker volume rm lokalmandi-backend-data
docker compose -f docker-compose.lehana.yml up -d
```

#### 4. CORS Errors

**Symptoms**: Frontend shows CORS errors in browser console

**Diagnosis**:
```bash
# Check CORS_ORIGIN environment variable
docker exec lokalmandi-backend env | grep CORS
```

**Solutions**:
```bash
# Update .env with correct frontend URLs
CORS_ORIGIN=https://lokalmandi.lehana.in,https://lokalmandi.aidhunik.com

# Restart backend to load new env
docker compose -f docker-compose.lehana.yml restart lokalmandi-backend
```

### Debugging Commands

```bash
# View real-time logs
docker compose -f docker-compose.lehana.yml logs -f

# View backend logs only
docker logs -f lokalmandi-backend

# Access container shell
docker exec -it lokalmandi-backend sh

# Check environment variables
docker exec lokalmandi-backend env

# Test internal networking
docker exec lokalmandi-frontend curl http://lokalmandi-backend:5000/health

# Check Traefik routing
curl -H "Host: lokalmandi.lehana.in" http://localhost/
```

---

## 🔄 Maintenance

### Updating the Application

```bash
# 1. Pull latest code
cd /root/repo/ai-for-bharat-prompt-challenge
git pull

# 2. Rebuild images
docker compose -f docker-compose.lehana.yml build

# 3. Recreate containers with zero downtime
docker compose -f docker-compose.lehana.yml up -d --no-deps --build lokalmandi-backend
docker compose -f docker-compose.lehana.yml up -d --no-deps --build lokalmandi-frontend

# 4. Verify health
docker compose -f docker-compose.lehana.yml ps
```

### Backup & Restore

```bash
# Backup volumes
docker run --rm \
  -v lokalmandi-backend-data:/data \
  -v /root/backups:/backup \
  alpine tar czf /backup/lokalmandi-data-$(date +%Y%m%d).tar.gz -C /data .

# Restore volumes
docker run --rm \
  -v lokalmandi-backend-data:/data \
  -v /root/backups:/backup \
  alpine tar xzf /backup/lokalmandi-data-20260202.tar.gz -C /data
```

### Log Rotation

```bash
# View log sizes
docker exec lokalmandi-backend du -sh /app/logs/*

# Rotate logs (automatic via Docker)
docker compose -f docker-compose.lehana.yml restart lokalmandi-backend

# Or manually clear old logs
docker exec lokalmandi-backend find /app/logs -type f -mtime +30 -delete
```

### Scaling (Future)

To handle increased traffic, scale with load balancer:

```yaml
# In docker-compose.lehana.yml (future)
services:
  lokalmandi-backend:
    deploy:
      replicas: 3  # Run 3 backend instances
      
# Traefik automatically load balances across all replicas
```

---

## 📚 Related Documentation

- **Project README**: `/root/repo/ai-for-bharat-prompt-challenge/README.md`
- **Quick Start**: `/root/repo/ai-for-bharat-prompt-challenge/QUICK_START.md`
- **Lehana Services**: `/root/SERVICES.md`
- **Docker Standards**: `/root/.github/instructions/dockerization.instructions.md`
- **Troubleshooting**: `/root/.github/instructions/troubleshoot.instructions.md`

---

**Deployment Checklist**:
- [ ] Environment variables configured (.env file)
- [ ] API keys added (SARVAM_API_KEY, OPENROUTER_API_KEY)
- [ ] DNS records pointing to server (both domains)
- [ ] Static IPs available (172.18.0.50, 172.18.0.51)
- [ ] `root_default` network exists
- [ ] Containers build successfully
- [ ] Health checks passing
- [ ] Frontend accessible at https://lokalmandi.lehana.in
- [ ] Backend API responding at https://api.lehana.in/lokalmandi/health
- [ ] Both .aidhunik.com domains working
- [ ] SERVICES.md updated with new services

---

**Last Updated**: 2026-02-02  
**Maintained By**: Lehana.in Infrastructure Team
