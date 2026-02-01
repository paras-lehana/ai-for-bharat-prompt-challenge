# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.5] - 2026-02-01

### Added
- **Immediate Translation**: Implemented a hardcoded Hindi translation map on the Home page and Login page for instant linguistic support without waiting for API calls.
- **Market Advisory Source Links**: Added clickable "View Source" links to market news items, redirecting to official government sources (IMD, eNAM, etc.).
- **Professional Crop Imagery**: Generated and integrated high-quality, professional images for all major crops (Onion, Potato, Tomato, Wheat, Soybean, Groundnut) to replace incorrect placeholders.

### Fixed
- **Voice Bot Intent Parsing**: Enhanced Kisaan Bot's intent identification logic to better handle Indian regional languages and keywords (including new `news_query` intent).
- **Translation Truncation**: Fixed a critical bug where long guides and messages were being truncated during translation by implementing a paragraph-wise translation engine in the backend.
- **Price Prediction Error**: Resolved "Insufficient Data" crashes in price prediction by implementing a smart mock data generator for demonstration purposes.
- **Currency Format**: Rounded off negotiation prices to nearest integer across the application to prevent ugly floating point displays (e.g., ₹34.19999).
- **Message List UI**: Fixed an overflow issue where long message previews were breaking the sidebar layout.
- **DevTools Shortcut**: Fixed the "Login as Farmer/Buyer" shortcut bug (`authAPI.login is not a function`).
- **Domain Routing**: Resolved critical issue where `lokalmandi.lehana.in` was not routing to the active dev environment.
- **Mirrored Domain Support**: Added missing `lokalmandi.aidhunik.com` support to Traefik, CORS, and Vite configurations.
- **Outdated Traefik Targets**: Fixed stale container IPs in Traefik dynamic configuration that were pointing to unrelated services.

### Technical
- Optimized `TranslatedText` component with localStorage persistence and hardcoded fallbacks.
- Updated `AIService` with improved prompt engineering for extraction accuracy.
- Updated Traefik file provider (`traefik_dynamic.yml`) to point `lokalmandi` services to host (172.18.0.1).
- Synchronized `vite.config.js` `allowedHosts` with mirrored domains.
- Updated backend CORS allowed origins for dual-domain infrastructure compliance.

## [4.4] - 2026-02-01

### Added
- **Community Forum**: Fully functional community section for farmers.
  - Post creation with categories (Tips & Tricks, Questions, Success Stories, etc.).
  - Commenting system with nested replies.
  - Like/Unlike functionality for posts.
- **Weather Integration in Listings**: Added `WeatherWidget` to the `ListingDetail` page to provide real-time local weather for crop locations.

### Fixed
- **Transactions Page Crash**: Fixed a `TypeError` where mapping over an undefined transactions list caused a white screen.
- **Weather Widget Visibility**: Ensured the weather widget displays correctly on the listing detail page, not just the home page.

### Technical
- Implemented `CommunityPost` and `CommunityComment` models in backend.
- Added `/api/community` routes to Express server.
- Integrated `communityAPI` in frontend utilities.

## [4.3] - 2026-01-31
### Added
- AI Price Prediction ML Model Integration.
- AI Crop Quality Assessment Tool.
- Logistics Support and Shipping Integration.
