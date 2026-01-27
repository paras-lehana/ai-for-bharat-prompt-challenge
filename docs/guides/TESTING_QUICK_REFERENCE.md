# Lokal Mandi - Voice Assistant Testing Quick Reference

## 🎤 Test Voice Inputs

### 1. Price Query (price_query)

**Hindi:**
- "मुझे गेहूं की कीमत बताओ" (Tell me wheat price)
- "चावल का भाव क्या है?" (What is rice price?)
- "टमाटर कितने का है?" (How much is tomato?)

**English:**
- "Tell me the price of wheat"
- "What is the price of rice?"
- "How much does tomato cost?"

**Expected:**
- Intent: `price_query`
- Parameters: `{cropType: "wheat/rice/tomato"}`
- API: `GET /api/listings/search?cropType=<crop>`

---

### 2. Create Listing (create_listing)

**Hindi:**
- "मैं 100 किलो टमाटर बेचना चाहता हूं" (I want to sell 100 kg tomatoes)
- "मेरे पास 50 क्विंटल गेहूं है" (I have 50 quintal wheat)
- "प्याज बेचना है 200 किलो" (Want to sell 200 kg onions)

**English:**
- "I want to sell 100 kg tomatoes"
- "I have 50 quintal wheat to sell"
- "Selling 200 kg onions"

**Expected:**
- Intent: `create_listing`
- Parameters: `{cropType: "tomato/wheat/onion", quantity: "100 kg/50 quintal/200 kg"}`
- API: `POST /api/listings`

---

### 3. Make Offer (make_offer)

**Hindi:**
- "मैं 5000 रुपये का ऑफर देना चाहता हूं" (I want to offer 5000 rupees)
- "इस लिस्टिंग पर 3000 रुपये दूंगा" (I'll give 3000 rupees for this listing)

**English:**
- "I want to offer 5000 rupees"
- "I'll pay 3000 for this listing"

**Expected:**
- Intent: `make_offer`
- Parameters: `{price: 5000/3000, listingId: "..."}`
- API: `POST /api/negotiations`

---

### 4. Search Listings (search_listings)

**Hindi:**
- "मुझे प्याज खरीदना है" (I want to buy onions)
- "आलू कहाँ मिलेगा?" (Where can I find potatoes?)
- "गेहूं खोज रहा हूं" (Looking for wheat)

**English:**
- "I want to buy onions"
- "Looking for potatoes"
- "Find wheat for me"

**Expected:**
- Intent: `search_listings`
- Parameters: `{cropType: "onion/potato/wheat"}`
- API: `GET /api/listings/search?cropType=<crop>`

---

### 5. General Help (general_help)

**Hindi:**
- "यह कैसे काम करता है?" (How does this work?)
- "मुझे मदद चाहिए" (I need help)
- "क्या करना है?" (What to do?)

**English:**
- "How does this work?"
- "I need help"
- "What should I do?"

**Expected:**
- Intent: `general_help`
- Parameters: `{}`
- API: None (show help content)

---

## 🔍 Testing Checklist

### Basic Functionality
- [ ] Microphone permission granted
- [ ] Audio recording works
- [ ] SARVAM STT transcribes correctly
- [ ] OpenRouter extracts intent
- [ ] Parameters parsed correctly
- [ ] Confirmation shown to user
- [ ] API called after confirmation
- [ ] Results displayed

### Intent Recognition
- [ ] price_query recognized
- [ ] create_listing recognized
- [ ] make_offer recognized
- [ ] search_listings recognized
- [ ] general_help recognized

### Parameter Extraction
- [ ] Crop names extracted (English)
- [ ] Crop names extracted (Hindi)
- [ ] Quantities extracted
- [ ] Prices extracted
- [ ] Locations extracted (if mentioned)
- [ ] Quality tiers extracted (if mentioned)

### API Integration
- [ ] GET /api/listings/search called
- [ ] POST /api/listings called
- [ ] POST /api/negotiations called
- [ ] Results displayed correctly
- [ ] Errors handled gracefully

### Multilingual Support
- [ ] Hindi queries work
- [ ] English queries work
- [ ] Marathi queries work (optional)
- [ ] Tamil queries work (optional)
- [ ] Telugu queries work (optional)

---

## 📝 Logging Test Results

For each test, document in `PROMPT_IMPROVEMENT_LOG.md`:

```markdown
### Test X: [Intent Name]
**Input**: "[exact voice input]"
**Expected Intent**: `intent_type`
**Expected Parameters**: `{param: value}`
**Actual Intent**: `actual_intent`
**Actual Parameters**: `{actual: values}`
**Result**: ✅ PASS / ❌ FAIL
**Notes**: [any observations]
**API Called**: [endpoint]
**Response**: [brief description]
```

---

## 🐛 Common Issues to Watch For

### Issue 1: Hindi Crop Names Not Recognized
**Example:** "गेहूं" not mapped to "wheat"
**Solution:** Add crop name mapping in system prompt or mock function

### Issue 2: Quantity Format Issues
**Example:** "100 किलो" not parsed as "100 kg"
**Solution:** Improve quantity extraction regex/logic

### Issue 3: Wrong Intent Identified
**Example:** "buy" interpreted as "create_listing" instead of "search_listings"
**Solution:** Add more specific keywords in system prompt

### Issue 4: Missing Parameters
**Example:** Intent correct but cropType is null
**Solution:** Improve parameter extraction instructions

### Issue 5: JSON Parsing Errors
**Example:** OpenRouter returns markdown code blocks
**Solution:** Already handled - strips ```json tags

---

## 🔧 Quick Fixes

### Fix 1: Update System Prompt
```bash
# Edit the prompt
nano backend/src/services/AIService.js

# Find processVoiceQuery() method
# Modify the system prompt
# Save and exit

# Redeploy
./deploy-lokalmandi.sh
```

### Fix 2: Test OpenRouter Directly
```bash
cd backend
node test-openrouter-standalone.js
```

### Fix 3: Test SARVAM STT Directly
```bash
cd backend
node test-sarvam-standalone.js
```

### Fix 4: Check Logs
```bash
docker logs -f lokalmandi-backend | grep -i "voice\|intent\|openrouter"
```

---

## 📊 Progress Tracking

### Session 1: Initial Testing
- Date: ___________
- Tests Run: ___/5
- Tests Passed: ___/5
- Issues Found: ___________
- Prompt Version: 1.0

### Session 2: After Improvements
- Date: ___________
- Tests Run: ___/5
- Tests Passed: ___/5
- Issues Fixed: ___________
- Prompt Version: 1.1

### Session 3: Final Verification
- Date: ___________
- Tests Run: ___/5
- Tests Passed: ___/5
- All APIs Covered: ☐ Yes ☐ No
- Prompt Version: 1.x

---

## 🎯 Success Metrics

**Target:** 90%+ accuracy on all intents

**Current Status:**
- price_query: ___% (___/10 tests)
- create_listing: ___% (___/10 tests)
- make_offer: ___% (___/10 tests)
- search_listings: ___% (___/10 tests)
- general_help: ___% (___/10 tests)

**Overall:** ___% (___/50 tests)

---

**Last Updated:** 2026-01-27
**Status:** Ready for Testing
