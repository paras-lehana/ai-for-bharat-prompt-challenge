# API Documentation Summary

## Overview

Comprehensive API documentation has been created for the Multilingual Mandi platform, covering all 17 route modules with 50+ endpoints.

## Documentation Files Created

### 1. **API_DOCUMENTATION.md** (Main Documentation)
- **Location**: `docs/API_DOCUMENTATION.md`
- **Size**: ~15,000 lines
- **Content**:
  - Complete endpoint documentation with request/response examples
  - Authentication flow and JWT token usage
  - All 17 API modules documented
  - Error handling and status codes
  - Rate limiting information
  - Best practices and usage guidelines
  - Example workflows for common use cases

### 2. **openapi.yaml** (OpenAPI 3.0 Specification)
- **Location**: `docs/openapi.yaml`
- **Format**: OpenAPI 3.0.3
- **Content**:
  - Machine-readable API specification
  - Schema definitions for all data models
  - Security schemes (JWT Bearer authentication)
  - Can be imported into Swagger Editor, Postman, or other API tools
  - Supports automatic client SDK generation

### 3. **POSTMAN_COLLECTION.json** (Postman Collection)
- **Location**: `docs/POSTMAN_COLLECTION.json`
- **Format**: Postman Collection v2.1
- **Content**:
  - Ready-to-import Postman collection
  - Pre-configured requests for all major endpoints
  - Environment variables for easy testing
  - Automatic token extraction from login response
  - Test scripts for common workflows

### 4. **API_QUICK_REFERENCE.md** (Quick Reference Guide)
- **Location**: `docs/API_QUICK_REFERENCE.md`
- **Content**:
  - Quick lookup table for all endpoints
  - Common query parameters
  - Response codes
  - Example workflows
  - cURL examples
  - Rate limits and language codes
  - Pricing formulas and trust score calculations

## API Modules Documented

### Core Modules (8)
1. **Authentication** (4 endpoints)
   - OTP-based phone authentication
   - JWT token management
   - Profile management

2. **Listings** (5 endpoints)
   - CRUD operations for product listings
   - Search with filters
   - Quality-based pricing

3. **Negotiations** (7 endpoints)
   - Create and manage negotiations
   - AI-powered counter-offer suggestions
   - 24-hour expiration handling

4. **Transactions** (6 endpoints)
   - Transaction lifecycle management
   - Status updates (pending → confirmed → shipped → delivered)
   - Transaction history

5. **Voice Interface** (5 endpoints)
   - Speech-to-text transcription
   - Text-to-speech synthesis
   - Intent extraction
   - Translation services
   - Complete voice query processing

6. **Messaging** (3 endpoints)
   - Direct messaging between users
   - Message threads
   - Read receipts

7. **Trust & Ratings** (3 endpoints)
   - Rating submission
   - Trust score calculation
   - Vendor reputation

8. **Disputes** (3 endpoints)
   - Dispute creation
   - Evidence submission
   - AI-powered resolution

### Discovery & Analytics (6)
9. **Discovery** (2 endpoints)
   - Find nearby vendors
   - Micro-aggregation suggestions

10. **Vendors** (3 endpoints)
    - Vendor profiles
    - Vendor listings
    - Nearby vendor search

11. **Analytics** (3 endpoints)
    - Dashboard metrics
    - Pricing analytics
    - Negotiation success rates

12. **Advisory** (3 endpoints)
    - Market insights
    - Weekly reports
    - Seasonal guidance

13. **Pricing** (3 endpoints)
    - eNAM price data
    - Price calculations
    - Offer validation

### Integration & Features (4)
14. **Integration** (6 endpoints)
    - ODOP status checking
    - GeM documentation guide
    - eNAM sync preferences

15. **Favorites** (5 endpoints)
    - Bookmark listings
    - Price alerts
    - Favorite management

16. **Saved Searches** (4 endpoints)
    - Save search criteria
    - Execute saved searches
    - Search management

17. **Sharing** (2 endpoints)
    - QR code generation
    - Share tracking

## Key Features Documented

### Authentication
- **Method**: Phone number + OTP
- **Token Type**: JWT (JSON Web Tokens)
- **Expiration**: 24 hours
- **Roles**: Vendor, Buyer

### Multilingual Support
- **Languages**: 7 (English, Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi)
- **Voice Interface**: Full STT/TTS support
- **Translation**: Automatic message translation

### Pricing Transparency
- **Formula**: Final Price = Base Price × Quality Multiplier × Demand Adjuster
- **Quality Tiers**: Premium (1.2x), Standard (1.0x), Basic (0.85x)
- **Demand Range**: 0.8 - 1.3

### Trust System
- **Calculation**: 40% delivery + 30% quality + 20% response + 10% fair pricing
- **Badges**: Trusted Vendor (4.5+, 20+ txns), Verified Seller (4.0+, 50+ txns)

### AI Features
- **Negotiation**: Counter-offer suggestions with reasoning
- **Voice Processing**: Intent extraction from natural language
- **Dispute Resolution**: Evidence analysis and recommendations

### Government Integration
- **eNAM**: Live price data (mocked in MVP)
- **ODOP**: Product registration checking
- **GeM**: Multilingual registration guide

## Error Handling

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limit Exceeded
- 500: Server Error

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 5 req/min per IP |
| General API | 100 req/min per user |
| Voice Processing | 20 req/min per user |
| Messaging | 10 msg/hour (new users) |

## Testing Resources

### Postman
1. Import `docs/POSTMAN_COLLECTION.json`
2. Set `base_url` variable
3. Run "Send OTP" → "Verify OTP" to get token
4. Token auto-saves to collection variables

### Swagger/OpenAPI
1. Open https://editor.swagger.io
2. Import `docs/openapi.yaml`
3. View interactive documentation
4. Test endpoints directly

### cURL
Examples provided in `API_QUICK_REFERENCE.md` for:
- Authentication flow
- Listing creation
- Search queries
- Negotiation workflow

## Usage Examples

### Complete User Journey
1. **Registration**: Send OTP → Verify OTP → Get JWT token
2. **Create Listing**: POST /listings with crop details
3. **Search**: GET /listings/search with filters
4. **Negotiate**: POST /negotiations → Counter-offers → Accept
5. **Transaction**: Confirm → Ship → Deliver
6. **Rate**: POST /ratings with delivery and quality scores

### Voice Query Flow
1. **Capture Audio**: Record user's voice in local language
2. **Transcribe**: POST /voice/transcribe
3. **Extract Intent**: POST /voice/parse-intent
4. **Process**: Execute appropriate API call
5. **Respond**: POST /voice/synthesize for audio response

## Documentation Standards

### Request Examples
- All endpoints include complete request body examples
- Query parameters documented with types and defaults
- Headers specified (Content-Type, Authorization)

### Response Examples
- Success responses (200, 201) with full JSON
- Error responses with status codes
- Nested objects expanded for clarity

### Authentication
- Clearly marked which endpoints require auth
- Role requirements specified (Vendor, Buyer)
- Token format and usage explained

## Integration Guide

### For Frontend Developers
1. Use `API_QUICK_REFERENCE.md` for endpoint lookup
2. Reference `API_DOCUMENTATION.md` for detailed examples
3. Import Postman collection for testing
4. Check error codes for proper error handling

### For Backend Developers
1. Use OpenAPI spec for API contract
2. Validate request/response formats
3. Implement rate limiting as documented
4. Follow error response format

### For Mobile Developers
1. OpenAPI spec can generate client SDKs
2. Voice interface endpoints for speech features
3. Offline-first considerations documented
4. Image compression recommendations included

## Maintenance

### Updating Documentation
When adding new endpoints:
1. Update `API_DOCUMENTATION.md` with full details
2. Add to `openapi.yaml` schema
3. Create Postman request in collection
4. Update quick reference table
5. Add example workflow if applicable

### Version Control
- Current Version: 1.0.0
- Last Updated: January 2024
- Breaking changes require major version bump
- New endpoints require minor version bump

## Additional Resources

### Related Documentation
- `docs/FEATURES.md` - Complete feature list
- `docs/FEATURES_GUIDE.md` - User guide
- `docs/DEPLOYMENT_GUIDE.md` - Deployment instructions
- `test/VOICE_TESTING_GUIDE.md` - Voice testing guide

### External APIs
- **SARVAM AI**: Speech-to-text, text-to-speech
- **OpenRouter**: AI intent extraction
- **eNAM**: Market price data (mocked in MVP)

## Summary Statistics

- **Total Endpoints**: 50+
- **Route Modules**: 17
- **Authentication Methods**: 1 (JWT)
- **Supported Languages**: 7
- **Documentation Pages**: 4
- **Example Requests**: 50+
- **Example Responses**: 50+
- **Error Codes**: 10+
- **Workflow Examples**: 5+

## Compliance

### Security
- JWT tokens for authentication
- HTTPS required in production
- Rate limiting to prevent abuse
- Input validation on all endpoints

### Privacy
- Phone numbers hashed in logs
- Personal data protected
- GDPR-compliant data handling
- User consent for eNAM sync

### Accessibility
- Multilingual support (7 languages)
- Voice-first interface
- Screen reader compatible responses
- Simple, farmer-friendly language

---

**Documentation Status**: ✅ Complete

**Task**: 46.2 Create API documentation  
**Requirements**: All  
**Completion Date**: January 2024

---

## Next Steps

1. ✅ API documentation created
2. ⏭️ Share with frontend team for integration
3. ⏭️ Import Postman collection for testing
4. ⏭️ Generate client SDKs from OpenAPI spec
5. ⏭️ Create API changelog for version tracking
