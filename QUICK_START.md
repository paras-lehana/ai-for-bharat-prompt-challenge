# Lokal Mandi - Quick Start Guide

> **Production Deployment**: This project is Docker-based and deployed on lehana.in infrastructure.

## 🚀 Fast Start (Docker - Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Access to lehana.in infrastructure (or standalone deployment)

### 1. Start Application

```bash
cd /root/repo/ai-for-bharat-prompt-challenge

# Start both frontend and backend
docker compose -f docker-compose.production.yml up -d

# View logs
docker compose -f docker-compose.production.yml logs -f

# Check status
docker compose -f docker-compose.production.yml ps
```

### 2. Access Application

**Production URLs (Lehana.in Integration):**
- **Frontend**: https://lokalmandi.lehana.in | https://lokalmandi.aidhunik.com
- **Backend API**: https://api.lehana.in/lokalmandi/health
- **Health Check**: `curl https://lokalmandi.lehana.in` (should return 200)

**Local Testing:**
- Frontend: http://localhost:3001 (if port exposed)
- Backend: http://localhost:5000 (if port exposed)

### 3. Common Commands

```bash
# Stop services
docker compose -f docker-compose.production.yml down

# Restart services
docker compose -f docker-compose.production.yml restart

# Rebuild images (after code changes)
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d

# View specific service logs
docker compose -f docker-compose.production.yml logs -f lokalmandi-backend
docker compose -f docker-compose.production.yml logs -f lokalmandi-frontend
```

## 📚 Documentation

- **Full Documentation**: `docs/deployment/DOCKER.md`
- **API Reference**: `docs/API_DOCUMENTATION.md`
- **Feature Guides**: `docs/features/`

**Version**: 1.0.0  
**Last Updated**: 2026-02-02  
**Status**: Production Ready ✅
