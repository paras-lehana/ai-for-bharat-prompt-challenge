# Voice Testing Quick Start 🎤

Quick guide to test the voice functionality in Multilingual Mandi.

## Prerequisites ✅

1. **Node.js installed** (v18 or higher)
   ```bash
   node --version
   ```

2. **Dependencies installed**
   ```bash
   cd backend
   npm install
   ```

3. **API keys configured** in `backend/.env`
   ```env
   SARVAM_API_KEY=sk_6z9mp3xl_hmIP6pmLSzsZyqJUtNtKkGkv
   OPENROUTER_API_KEY=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
   ```

## Quick Test (30 seconds) 🚀

Run the complete voice pipeline test:

```bash
node test/test-voice-complete.js test/sample_add_listing.m4a
```

**Expected Result**:
```
✅ Transcription successful!
📝 Transcribed Text: मुझे 100 किलो गेहूं बेचना है

✅ Intent Extracted Successfully!
  🎯 Intent: create_listing
  🌾 Crop: wheat
  📦 Quantity: 100 kg
```

## What This Tests 🧪

1. **SARVAM STT**: Converts audio to text
2. **OpenRouter AI**: Extracts intent and parameters
3. **Complete Pipeline**: End-to-end voice processing

## If It Works ✅

Great! Your voice pipeline is working. Next steps:

1. **Test with Kisaan Bot UI**:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm start

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

2. **Open browser**: http://localhost:3000
3. **Click Kisaan Bot** (bottom right corner)
4. **Click microphone** and speak your query
5. **Check results** in the UI

## If It Fails ❌

### Error: "node is not recognized"
**Solution**: Add Node.js to your PATH or use full path:
```bash
C:\Program Files\nodejs\node.exe test-voice-complete.js test/sample_add_listing.m4a
```

### Error: "SARVAM_API_KEY not configured"
**Solution**: Check `backend/.env` file has valid API key

### Error: "Audio file not found"
**Solution**: Ensure you're in the project root directory

### Error: "Request timeout"
**Solution**: Check internet connection, try again

## Test Different Scenarios 🎯

### Test Price Query
Create audio file saying: "टमाटर का भाव क्या है?"
```bash
node test-voice-complete.js path/to/your/audio.m4a
```

Expected intent: `price_query`

### Test Search Listings
Create audio file saying: "मुझे प्याज खरीदना है"
```bash
node test-voice-complete.js path/to/your/audio.m4a
```

Expected intent: `search_listings`

### Test Make Offer
Create audio file saying: "मैं 50 रुपये प्रति किलो देना चाहता हूं"
```bash
node test-voice-complete.js path/to/your/audio.m4a
```

Expected intent: `make_offer`

## Supported Audio Formats 🎵

- WAV (`.wav`)
- MP3 (`.mp3`)
- M4A (`.m4a`) ← Sample file format
- OGG (`.ogg`)
- WebM (`.webm`)

## Supported Languages 🌍

- Hindi (hi) - Primary
- English (en) - Supported
- Marathi (mr) - Supported
- Tamil (ta) - Supported
- Telugu (te) - Supported
- Kannada (kn) - Supported
- Punjabi (pa) - Supported

## Performance ⚡

Typical response times:
- SARVAM STT: 2-5 seconds
- OpenRouter: 1-3 seconds
- **Total: 3-8 seconds**

## Need More Help? 📚

- **Detailed Guide**: [docs/VOICE_TESTING_GUIDE.md](docs/VOICE_TESTING_GUIDE.md)
- **Configuration**: [docs/ASSETS_CONFIGURATION.md](docs/ASSETS_CONFIGURATION.md)
- **Troubleshooting**: See Voice Testing Guide

## Quick Commands Reference 📋

```bash
# Complete pipeline test
node test/test-voice-complete.js test/sample_add_listing.m4a

# Test SARVAM only
node backend/test-sarvam-standalone.js test/sample_add_listing.m4a

# Test OpenRouter only
node backend/test-openrouter-standalone.js "मुझे 100 किलो गेहूं बेचना है"

# Start backend server
cd backend && npm start

# Start frontend server
cd frontend && npm run dev
```

## Success Criteria ✅

Your voice pipeline is working if:
- ✅ Audio is transcribed correctly
- ✅ Intent is extracted (price_query, create_listing, etc.)
- ✅ Parameters are parsed (cropType, quantity, etc.)
- ✅ Response time is under 10 seconds
- ✅ No errors in console

---

**Ready to test?** Run: `node test/test-voice-complete.js test/sample_add_listing.m4a`

**Questions?** Check [test/VOICE_TESTING_GUIDE.md](test/VOICE_TESTING_GUIDE.md)
