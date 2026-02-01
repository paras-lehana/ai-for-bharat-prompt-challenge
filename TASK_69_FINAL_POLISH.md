# Task 69: Final Polish & Voice Summarization

## Status
- [ ] Requirements Definition
- [ ] Critical Bug Fixes
- [ ] Feature Implementation
- [ ] Verification

## 1. Requirements

### A. Core Constraints
- **Browser Verification**: All features must be tested in the browser.
- **Reliability**: Mock data must be consistent and abundant (50+ items).
- **Localization**: Full support for Hindi and 22+ languages.

### B. Bug Fixes
1.  **Rice Image**: Fix `public/images/crops/rice.jpg`.
2.  **Console Loop**: Fix `onError` infinite loop in `ListingDetail.jsx` causing recurring default image requests.
3.  **Data Persistence**:
    - Fix "Vanishing" negotiations and messages.
    - Ensure mock data is populated for the specific logged-in user or globally for all users.
    - Round off all prices in UI (Negotiations, etc.).
4.  **Message UI**:
    - Truncate last message in sidebar.
    - Ensure Hindi messages are present.
5.  **Kisaan Bot**:
    - Fix Intent Detection (LLM pipeline).
    - **Strategy**: Implement robust Regex-based fallback if OpenRouter is exhausted/fails.
6.  **Weather Widget**:
    - Default location: **Noida** (instead of Unknown).

### C. New Feature: Voice Summarization
- **Goal**: Read out page summaries in the user's selected language using Sarvam TTS.
- **Scope**: All pages *except* Home.
- **Implementation**:
    - Floating/Fixed button: "🔊 Listen to Summary" (translated).
    - **Context-Aware Prompts**:
        - *Listing Detail*: Summarize product, price, quality, and vendor rating.
        - *Negotiations*: Summarize active offers, status, and recommended actions.
        - *Analytics*: Summarize key trends and stats.
    - **Tech Stack**: Sarvam AI TTS (existing API key).

## 2. Implementation Plan

### Phase 1: Fixes & Stability
1.  **Assets**: Update `rice.jpg`.
2.  **Code**: Patch `ListingDetail.jsx` (image loop) and `Messages.jsx` (truncation).
3.  **AI Service**: Rewrite `AIService.js` to prioritize Regex/Rule-based parsing for demo reliability, falling back to LLM only if needed or as a parallel enhancement.
4.  **Data**: Run `robust_db_booster.js` to flood DB with consistent data.

### Phase 2: Weather & Location
1.  Update `WeatherWidget.jsx` to default to `Noida, Uttar Pradesh`.

### Phase 3: Voice Summarization
1.  Create `components/PageSummarizer.jsx`.
2.  Integrate `TranslationService.synthesizeSpeech`.
3.  Inject into `ListingDetail`, `MyNegotiations`, `BrowseListings`.

## 3. Verification Steps
1.  Check Home (Hindi, Banner).
2.  Check Browse (Rice image, Translations).
3.  Check Listing Detail (No console loop, Summary button works).
4.  Check Bot (Voice query -> Intent -> Action).
5.  Check Negotiations (Data exists, Rounded prices).
6.  Check Messages (Layout, Truncation).
