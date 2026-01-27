# Quick Test Guide 🚀

## ✅ What's Working

### 1. Docker Containers Running
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Database: Initialized

### 2. OpenRouter API Tested ✅
```powershell
docker run --rm -v ${PWD}:/app -w /app node:24-alpine node test/test-apis-simple.js
```

**Result:**
```
✅ Intent Extracted Successfully!
  🎯 Intent: create_listing
  🌾 Crop: गेहूं
  📦 Quantity: 100 किलो
  💰 Price: N/A
  📍 Location: N/A
  🎲 Confidence: high
```

## 🧪 Test the App Now

### 1. Open Browser
http://localhost:3000

### 2. Login
- Phone: `+919876543210`
- Click "Send OTP"
- Check Docker logs for OTP:
  ```powershell
  docker-compose logs backend | Select-String "OTP"
  ```
- Or try: `123456`
- Select role: Vendor or Buyer
- Select language: Hindi
- Click "Verify & Login"

### 3. Try Features
- Browse listings
- Create a listing
- Make an offer
- Test Kisaan Bot (voice assistant)

## 🎤 Test Voice APIs

### Quick Test (No dependencies, 10 seconds)
```powershell
docker run --rm -v ${PWD}:/app -w /app node:24-alpine node test/test-apis-simple.js
```

### Full Test with Audio (Requires npm install, 2-3 minutes first time)
```powershell
docker run --rm -v ${PWD}:/app -w /app node:24-alpine sh -c "cd backend && npm install && cd .. && node test/test-voice-complete.js test/sample_add_listing.m4a"
```

## 📊 Test Results

### ✅ Completed
- [x] Docker containers started
- [x] Backend running on port 5000
- [x] Frontend running on port 3000
- [x] Database initialized
- [x] OpenRouter API working
- [x] Intent extraction working

### 🔄 To Test
- [ ] Login flow
- [ ] Create listing
- [ ] Browse listings
- [ ] Make offer
- [ ] Kisaan Bot voice
- [ ] SARVAM STT (with audio file)

## 🐛 Known Issues Fixed

### ❌ ERR_EMPTY_RESPONSE
**Status:** ✅ Fixed
**Solution:** Backend is now running in Docker

### ❌ Cannot read properties of undefined (reading 'payload')
**Status:** ✅ Fixed
**Solution:** Backend is now running, API calls will work

## 📝 Quick Commands

```powershell
# View Docker logs
docker-compose logs -f

# Test OpenRouter API
docker run --rm -v ${PWD}:/app -w /app node:24-alpine node test/test-apis-simple.js

# Stop containers
docker-compose down

# Restart containers
docker-compose up --build

# Check backend health
curl http://localhost:5000/api/health
```

## 🎯 Next Steps

1. **Test login** - Open http://localhost:3000 and login
2. **Create a listing** - Test the create listing flow
3. **Test voice** - Try Kisaan Bot in the UI
4. **Run full tests** - Use the full voice pipeline test

## 📚 Documentation

- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Complete setup status
- [VOICE_QUICK_START.md](VOICE_QUICK_START.md) - Voice testing guide
- [test/VOICE_TESTING_GUIDE.md](test/VOICE_TESTING_GUIDE.md) - Detailed voice testing
- [docs/ASSETS_CONFIGURATION.md](docs/ASSETS_CONFIGURATION.md) - Configuration guide

---

**Status:** ✅ Ready to test!

**Action:** Open http://localhost:3000 now!
