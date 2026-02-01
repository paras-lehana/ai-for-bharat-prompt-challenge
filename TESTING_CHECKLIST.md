# Testing Checklist - Multilingual Mandi

**Platform**: Multilingual Mandi  
**Version**: 1.0.0  
**Last Updated**: January 30, 2026

---

## 🎯 Testing Overview

This checklist covers all features implemented in the platform. Use this for manual testing before deployment.

**Test Credentials:**
- Vendor: +919876543210 (OTP: 1104 or any 6 digits)
- Buyer: +919876543212 (OTP: 1104 or any 6 digits)

---

## ✅ 1. Authentication & User Management

### 1.1 Registration & Login
- [ ] Enter valid phone number (+91XXXXXXXXXX format)
- [ ] Receive OTP (check console/logs in development)
- [ ] Enter correct OTP → successful login
- [ ] Enter incorrect OTP → error message displayed
- [ ] OTP expires after 5 minutes
- [ ] Maximum 3 retry attempts enforced
- [ ] JWT token stored in localStorage
- [ ] User redirected to home page after login

### 1.2 Profile Management
- [ ] Select role (Vendor/Buyer) on first login
- [ ] Select language preference
- [ ] Update profile information
- [ ] Profile changes persist after logout/login
- [ ] Language preference affects UI (via TranslatedText)

### 1.3 Session Management
- [ ] User stays logged in after page refresh
- [ ] Logout clears token and redirects to login
- [ ] Protected routes redirect to login when not authenticated
- [ ] Token expiration handled gracefully

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 2. Product Listings

### 2.1 Create Listing (Vendor Only)
- [ ] Access create listing page
- [ ] Fill required fields (crop type, quantity, unit, base price, quality tier)
- [ ] Upload product image
- [ ] Final price calculated automatically
- [ ] Price breakdown displayed
- [ ] Listing created successfully
- [ ] Redirected to listing detail page

### 2.2 Browse Listings
- [ ] View all active listings
- [ ] Listings display correctly (image, price, vendor, quality)
- [ ] Grid/list view responsive on mobile
- [ ] Pagination works (if implemented)
- [ ] No unavailable listings shown

### 2.3 Search & Filter
- [ ] Search by crop type
- [ ] Filter by location
- [ ] Filter by quality tier (Premium, Standard, Basic)
- [ ] Filter by price range
- [ ] Sort by price (low to high, high to low)
- [ ] Sort by distance
- [ ] Sort by trust score
- [ ] Real-time filter updates without page reload
- [ ] "No results" message when no matches

### 2.4 Listing Detail
- [ ] View complete listing information
- [ ] See vendor profile link
- [ ] View price breakdown
- [ ] See quality tier badge
- [ ] Image displays correctly
- [ ] "Make Offer" button visible (for buyers)
- [ ] "Edit" button visible (for listing owner)

### 2.5 Edit/Delete Listing (Vendor Only)
- [ ] Edit listing details
- [ ] Update price → recalculated automatically
- [ ] Change availability status
- [ ] Delete listing
- [ ] Changes reflect immediately

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 3. Negotiations

### 3.1 Initiate Negotiation (Buyer)
- [ ] Click "Make Offer" on listing
- [ ] Enter offer price
- [ ] Negotiation created successfully
- [ ] Negotiation appears in "My Negotiations"
- [ ] 24-hour countdown displayed

### 3.2 Negotiation Dashboard
- [ ] View all active negotiations
- [ ] See negotiation history (all offers)
- [ ] AI counter-offer suggestions displayed (if applicable)
- [ ] Time remaining shown
- [ ] Status indicators clear (pending, accepted, rejected, expired)

### 3.3 Negotiation Actions
- [ ] Vendor receives counter-offer suggestion
- [ ] Submit counter-offer
- [ ] Accept offer → transaction created
- [ ] Reject offer → negotiation closed
- [ ] Withdraw from negotiation
- [ ] Multiple rounds of negotiation work
- [ ] Negotiation expires after 24 hours

### 3.4 Negotiation Detail
- [ ] View complete negotiation history
- [ ] See all offers and counter-offers
- [ ] View reasoning for AI suggestions
- [ ] Action buttons work correctly

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 4. Messaging

### 4.1 Conversations
- [ ] View all conversations
- [ ] Unread message count displayed
- [ ] Last message preview shown
- [ ] Timestamp displayed correctly
- [ ] Click conversation → opens thread

### 4.2 Message Thread
- [ ] View complete message history
- [ ] Messages sorted by timestamp
- [ ] Own messages vs received messages distinguished
- [ ] Read receipts displayed (✓✓)
- [ ] Scroll to latest message

### 4.3 Send Messages
- [ ] Type and send text message
- [ ] Message appears immediately
- [ ] Recipient receives message (test with 2 accounts)
- [ ] Translation displayed (if languages differ)
- [ ] Image sharing works (if implemented)

### 4.4 Real-time Features
- [ ] Messages delivered in real-time (if online)
- [ ] Offline messages queued
- [ ] Read receipts update
- [ ] Typing indicators (if implemented)

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 5. Transactions

### 5.1 Transaction Creation
- [ ] Transaction created when negotiation accepted
- [ ] Transaction details correct (price, quantity, parties)
- [ ] Initial status is "pending"
- [ ] Both parties can view transaction

### 5.2 Transaction Lifecycle
- [ ] Vendor confirms order → status "confirmed"
- [ ] Vendor marks as shipped → status "in_transit"
- [ ] Buyer confirms delivery → status "delivered"
- [ ] Status timeline displays correctly
- [ ] Notifications sent on status changes (check logs)

### 5.3 Transaction History
- [ ] View all transactions
- [ ] Filter by status (pending, confirmed, in_transit, delivered)
- [ ] Transaction cards display key info
- [ ] Click transaction → opens detail page

### 5.4 Transaction Detail
- [ ] View complete transaction information
- [ ] See both parties' details
- [ ] Action buttons visible based on role and status
- [ ] Confirm button (vendor, pending status)
- [ ] Ship button (vendor, confirmed status)
- [ ] Deliver button (buyer, in_transit status)

### 5.5 Rating Submission
- [ ] Rating modal appears after delivery confirmation
- [ ] Rate delivery (1-5 stars)
- [ ] Rate quality (1-5 stars)
- [ ] Submit rating successfully
- [ ] Rating affects vendor's trust score

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 6. Trust & Ratings

### 6.1 Trust Score Display
- [ ] Trust score visible on vendor profile
- [ ] Score breakdown shown (delivery, quality, response, pricing)
- [ ] Progress bars display correctly
- [ ] Transaction count displayed
- [ ] Badges shown (Trusted Vendor, Verified Seller)

### 6.2 Trust Score Component
- [ ] Compact view works (on listing cards)
- [ ] Full view works (on vendor profile)
- [ ] Color coding based on score (green >4.5, blue >4.0, etc.)
- [ ] Badge icons display correctly

### 6.3 Rating System
- [ ] Ratings submitted successfully
- [ ] Trust score updates after new rating
- [ ] Badges awarded when thresholds met
- [ ] Low scores flagged (if <3.0)

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 7. Analytics (Vendor Only)

### 7.1 Dashboard Metrics
- [ ] Total sales displayed
- [ ] Active listings count
- [ ] Pending negotiations count
- [ ] Trust score shown
- [ ] Metrics update correctly

### 7.2 Charts & Visualizations
- [ ] Sales trends chart (LineChart)
- [ ] Best-selling crops chart (BarChart)
- [ ] Quality tier performance (PieChart)
- [ ] Charts render correctly
- [ ] Data accurate

### 7.3 Market Insights
- [ ] Market insights displayed
- [ ] Insights categorized (price increase, high demand, price drop)
- [ ] Color-coded by type
- [ ] Relevant to vendor's crops

### 7.4 Pricing Analytics
- [ ] Vendor's average price shown
- [ ] Regional average displayed
- [ ] Price difference calculated
- [ ] Comparison accurate

### 7.5 Negotiation Analytics
- [ ] Success rate displayed
- [ ] Average discount shown
- [ ] Total negotiations count
- [ ] Metrics accurate

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 8. Disputes

### 8.1 Create Dispute
- [ ] Access disputes page
- [ ] Click "Create Dispute"
- [ ] Fill dispute form (transaction ID, reason, description)
- [ ] Submit dispute successfully
- [ ] Dispute appears in list

### 8.2 Dispute Management
- [ ] View all disputes
- [ ] Status indicators clear
- [ ] Click dispute → opens detail page
- [ ] Evidence submission works (if implemented)
- [ ] Resolution recommendations displayed (if implemented)

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 9. Voice Interface (Kisaan Bot)

### 9.1 Voice Query
- [ ] Microphone button visible
- [ ] Click to record voice
- [ ] Recording indicator shows
- [ ] Audio captured successfully
- [ ] Transcription displayed
- [ ] Intent parsed correctly
- [ ] Parameters extracted
- [ ] Confirmation shown to user

### 9.2 Voice Actions
- [ ] Price query works
- [ ] Create listing via voice (if implemented)
- [ ] Make offer via voice (if implemented)
- [ ] Search listings via voice (if implemented)
- [ ] Redirects to appropriate page

### 9.3 Error Handling
- [ ] Microphone permission errors handled
- [ ] Unclear audio → clarification requested
- [ ] API errors displayed in user's language
- [ ] Fallback to text input available

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 10. Price Information

### 10.1 Price Discovery
- [ ] View current market prices
- [ ] eNAM prices displayed (if available)
- [ ] Price source indicated
- [ ] Mandi location shown
- [ ] Last updated timestamp

### 10.2 Price Calculator
- [ ] Enter base price
- [ ] Select quality tier
- [ ] Final price calculated
- [ ] Price breakdown shown
- [ ] Formula transparent

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 11. Navigation & UI

### 11.1 Navigation Bar
- [ ] Logo links to home
- [ ] All menu items visible
- [ ] Active page highlighted
- [ ] Logout button works
- [ ] Mobile menu works
- [ ] Bottom navigation on mobile

### 11.2 Responsive Design
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Touch targets adequate (44px+)
- [ ] No horizontal scrolling
- [ ] Images scale properly

### 11.3 User Experience
- [ ] Loading spinners during async operations
- [ ] Error messages clear and helpful
- [ ] Success confirmations displayed
- [ ] Forms validate input
- [ ] Buttons disabled during submission
- [ ] Smooth transitions between pages

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 12. Multilingual Support

### 12.1 Language Selection
- [ ] Language preference saved
- [ ] UI updates based on preference
- [ ] TranslatedText component works
- [ ] All pages support translation

### 12.2 Translation Quality
- [ ] Key terms translated correctly
- [ ] Context preserved
- [ ] No broken translations
- [ ] Fallback to English if translation missing

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 13. Performance

### 13.1 Load Times
- [ ] Initial page load < 3 seconds
- [ ] Subsequent navigation < 1 second
- [ ] API responses < 2 seconds
- [ ] Images load progressively

### 13.2 Optimization
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No layout shifts

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## ✅ 14. Security

### 14.1 Authentication
- [ ] JWT tokens secure
- [ ] Tokens expire correctly
- [ ] Unauthorized access blocked
- [ ] CORS configured properly

### 14.2 Data Validation
- [ ] Input sanitization works
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Rate limiting enforced

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Passed | ❌ Failed

---

## 📊 Testing Summary

### Test Results
- **Total Tests**: ___
- **Passed**: ___
- **Failed**: ___
- **Skipped**: ___

### Critical Issues
1. 
2. 
3. 

### Minor Issues
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## 🎯 Sign-Off

**Tested By**: _______________  
**Date**: _______________  
**Environment**: Development / Staging / Production  
**Status**: ⬜ Ready for Production | ⬜ Needs Fixes | ⬜ Blocked

---

**Next Steps:**
- [ ] Fix critical issues
- [ ] Retest failed scenarios
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

