# 🚀 Quick Deployment Guide - Multilingual Mandi

## ⚡ 30-Second Deployment

### Prerequisites
- Docker Desktop installed and running
- Ports 3000 and 5000 available

### Deploy Now!

```bash
# 1. Clone the repository
git clone https://github.com/paras-lehana/ai-for-bharat-prompt-challenge.git
cd ai-for-bharat-prompt-challenge

# 2. Start the application
docker-compose up --build
```

**That's it!** Your application will be running at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🎯 First Login

1. Open http://localhost:3000
2. Enter phone: `+919876543210`
3. Click "Send OTP"
4. Check backend logs for OTP:
   ```bash
   docker-compose logs backend | grep "OTP for"
   ```
   Or use default OTP: `312802`
5. Select role: **Vendor** or **Buyer**

---

## 📋 Docker Commands

### View Logs
```bash
# All logs
docker-compose logs -f

# Backend only (to see OTP)
docker-compose logs backend -f

# Frontend only
docker-compose logs frontend -f
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services
```bash
docker-compose down
```

### Check Status
```bash
docker ps
```

---

## 🔧 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Install dependencies
npm run install-all

# 2. Set up environment
cp .env.example .env

# 3. Start development servers
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🌐 Environment Variables

Create `.env` file in root directory:

```env
# Backend
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./mandi.db
JWT_SECRET=your-super-secret-jwt-key

# SARVAM AI (for voice and translation)
SARVAM_API_KEY=your-sarvam-api-key
SARVAM_API_URL=https://api.sarvam.ai

# OpenRouter (for AI features)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=qwen/qwen3-vl-32b-instruct

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Verify Deployment

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T...",
  "service": "Multilingual Mandi API"
}
```

### 2. Check Frontend
Open http://localhost:3000 in browser - should see login page

### 3. Test API
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

---

## 🐛 Troubleshooting

### Issue: Docker containers not starting
**Solution**: Make sure Docker Desktop is running
```bash
# Start Docker Desktop
# Then try again
docker-compose up --build
```

### Issue: Port already in use
**Solution**: Stop services using ports 3000 or 5000
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
# Kill the process using the PID

# Or change ports in docker-compose.yml
```

### Issue: OTP not visible
**Solution**: Check backend logs
```bash
docker-compose logs backend | grep "OTP for"
```

### Issue: Frontend not loading
**Solution**: Check container status
```bash
docker ps
# Should show 2 containers running
```

### Issue: Database errors
**Solution**: Remove old database and restart
```bash
docker-compose down
rm backend/mandi.db
docker-compose up --build
```

---

## 📊 What Gets Deployed

### Backend Container
- Node.js 18 Alpine
- Express API server
- SQLite database
- 13 API route modules
- 4 core services
- Port: 5000

### Frontend Container
- Node.js 18 Alpine
- React + Vite dev server
- Tailwind CSS
- 8 responsive pages
- Port: 3000

### Network
- Custom bridge network for container communication
- CORS configured for localhost

---

## 🎯 Next Steps

After successful deployment:

1. **Test the application** - See [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md)
2. **Add dummy data** - Create test listings and users
3. **Configure API keys** - Add SARVAM and OpenRouter keys for full functionality
4. **Explore features** - Try all 7 core initiatives

---

## 📚 Additional Resources

- **Full Features Guide**: [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md)
- **Testing Guide**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Hackathon Demo**: [HACKATHON_READY.md](./HACKATHON_READY.md)
- **Complete Documentation**: [README.md](./README.md)

---

## 🚀 Production Deployment

### Deploy to Cloud

**Vercel (Frontend)**:
```bash
cd frontend
vercel deploy
```

**Render/Railway (Backend)**:
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

**Database**:
- Development: SQLite (included)
- Production: PostgreSQL (recommended)

---

## ✅ Deployment Checklist

- [ ] Docker Desktop running
- [ ] Ports 3000 and 5000 available
- [ ] Run `docker-compose up --build`
- [ ] Wait for "Database initialized successfully"
- [ ] Open http://localhost:3000
- [ ] Test login with +919876543210
- [ ] Check OTP in logs
- [ ] Verify all pages load
- [ ] Ready for demo!

---

**Deployment Time**: ~2 minutes  
**Status**: ✅ Production-Ready  
**Support**: Check logs with `docker-compose logs -f`
