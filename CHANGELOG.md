# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
