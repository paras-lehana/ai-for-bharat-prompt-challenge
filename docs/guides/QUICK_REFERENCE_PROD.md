# LokMandi - Quick Reference

## 🌐 Production URLs
- **Frontend**: https://lokmandi.lehana.in OR https://lokmandi.aidhunik.com
- **Backend API**: https://lokmandi.lehana.in/api

## 🔐 Development Access
- **OTP for Testing**: `1104`
- **Phone Format**: +91XXXXXXXXXX

## 🐳 Docker Commands
```bash
# Start/Restart
docker-compose up -d --build

# Restart single service
docker-compose restart backend
docker-compose restart frontend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check status
docker-compose ps
```

## 🧪 Testing
```bash
# Test AIService directly
node test-aiservice-direct.js

# Test OpenRouter standalone
node backend/test-openrouter-standalone.js "your query here"

# Test API endpoint
curl -X POST https://lokmandi.lehana.in/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919876543210"}'
```

## 📂 Key Files
- `docker-compose.yml` - Container orchestration
- `backend/.env` - Backend environment (FRONTEND_URL, OPENROUTER_API_KEY)
- `frontend/.env` - Frontend environment (VITE_API_URL)
- `/root/traefik_dynamic.yml` - Reverse proxy routing
- `backend/src/services/AIService.js` - OpenRouter integration

## 🔧 Container IPs
- Frontend: `172.18.0.18:3001`
- Backend: `172.18.0.17:5000`

## ✅ Health Check
```bash
# Quick verification
curl -s -o /dev/null -w "%{http_code}\n" https://lokmandi.lehana.in
# Should return: 200

# API check
curl -X POST https://lokmandi.lehana.in/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919999999999"}'
# Should return: OTP sent message
```

## 🚨 Troubleshooting
| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check container IPs in `/root/traefik_dynamic.yml` |
| CORS errors | Verify CORS_ORIGIN in `backend/.env` |
| OpenRouter errors | Check FRONTEND_URL in `backend/.env` |
| Container not starting | Run `docker-compose logs -f [service]` |

## 📊 Current Status
- ✅ Frontend: Running on port 3001
- ✅ Backend: Running on port 5000
- ✅ SSL: Active (Let's Encrypt wildcards)
- ✅ CORS: Configured for both domains
- ✅ AI: OpenRouter google/gemma-3-27b-it:free

## 🎯 AI Features
- **Model**: google/gemma-3-27b-it:free
- **Languages**: Hindi, English, other Indian languages
- **Capabilities**: Intent extraction, price queries, listing creation
- **JSON Parsing**: Auto-strips markdown code blocks

## 📝 Important Notes
1. Both domains point to same deployment
2. Development OTP `1104` always works
3. Backend restarts auto-reload on .env changes
4. Frontend uses relative `/api` paths (proxied by Traefik)
5. OpenRouter responses may include markdown - parsing handles it

---
*Last Updated: January 2025*
*Status: Production Ready ✅*
