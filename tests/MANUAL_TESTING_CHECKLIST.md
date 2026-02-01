# Manual Testing Checklist

**Target**: lokalmandi.lehana.in  
**Date**: January 29, 2026

Use this checklist to manually verify all features that require browser/visual testing.

---

## Pre-Testing Setup

- [ ] Open browser (Chrome/Firefox recommended)
- [ ] Open Developer Console (F12)
- [ ] Clear browser cache
- [ ] Ensure stable internet connection
- [ ] Have mobile device ready for responsive testing

---

## 1. Guide Page Translation Testing

### Test 1.1: Query Parameter Support
- [ ] Navigate to: `https://lokalmandi.lehana.in/guide`
- [ ] Verify page loads without errors
- [ ] Navigate to: `https://lokalmandi.lehana.in/guide?lang=hi`
- [ ] Check console for: `[Guide] URL parameter detected: { langParam: 'hi' }`
- [ ] Verify language selector shows "हिंदी (Hindi)"

**Expected**: Language automatically switches to Hindi

---

### Test 1.2: Debug Logging
- [ ] Open browser console
- [ ] Navigate to Guide page
- [ ] Select a guide (e.g., "Quick Start Guide")
- [ ] Change language to Hindi
- [ ] Verify console shows these logs:
  - [ ] `[Guide] Language/Guide changed:`
  - [ ] `[Guide] Starting translation for:`
  - [ ] `[Guide] Translation request:`
  - [ ] `[Guide] Translation response:`
  - [ ] `[Guide] Translation cached successfully`
  - [ ] `[Guide] Showing translated content`

**Expected**: All log messages appear in correct order

---

### Test 1.3: Translation Functionality
- [ ] Select "Quick Start Guide"
- [ ] Change language to Hindi
- [ ] Wait for translation (should be fast)
- [ ] Verify content is in Hindi
- [ ] Change language back to English
- [ ] Verify content is in English
- [ ] Change to Tamil
- [ ] Verify content translates to Tamil

**Expected**: Content translates correctly, no blank pages

---

### Test 1.4: Translation Fallback
- [ ] Disconnect internet (or use DevTools offline mode)
- [ ] Try changing language
- [ ] Verify original English content still shows
- [ ] Check console for error log
- [ ] Reconnect internet
- [ ] Verify translation works again

**Expected**: Graceful fallback to English on error

---

### Test 1.5: Translation Caching
- [ ] Select a guide and translate to Hindi
- [ ] Change to different guide
- [ ] Change back to first guide
- [ ] Check console for: `[Guide] Using cached translation`
- [ ] Verify translation loads instantly (no API call)

**Expected**: Cached translations load instantly

---

## 2. Market Prices Page Testing

### Test 2.1: Page Load
- [ ] Navigate to: `https://lokalmandi.lehana.in/price-info`
- [ ] Verify loading spinner appears
- [ ] Wait for page to load
- [ ] Verify 10 crop cards are displayed
- [ ] Verify all images load correctly

**Expected**: All 10 crops display with images

---

### Test 2.2: Crop Cards Display
For each crop card, verify:
- [ ] Crop image displays
- [ ] Crop name in English displays
- [ ] Crop name in Hindi displays
- [ ] Emoji icon displays
- [ ] Modal price displays
- [ ] Min/Max prices display
- [ ] Card has shadow/border

**Crops to check**:
- [ ] Tomato (🍅)
- [ ] Onion (🧅)
- [ ] Potato (🥔)
- [ ] Wheat (🌾)
- [ ] Rice (🌾)
- [ ] Maize (🌽)
- [ ] Cotton (☁️)
- [ ] Groundnut (🥜)
- [ ] Soybean (🫘)
- [ ] Sugarcane (🎋)

**Expected**: All elements display correctly

---

### Test 2.3: Hover Effects
- [ ] Hover over a crop card
- [ ] Verify card lifts up (translate-y)
- [ ] Verify card scales slightly
- [ ] Verify transition is smooth
- [ ] Move mouse away
- [ ] Verify card returns to normal

**Expected**: Smooth hover animations

---

### Test 2.4: Click Interaction
- [ ] Click on Tomato card
- [ ] Verify detailed view appears
- [ ] Verify shows: Modal, Min, Max prices
- [ ] Verify shows: Source (eNAM/Local)
- [ ] Verify shows: Location (Delhi)
- [ ] Click "Back to all crops"
- [ ] Verify returns to grid view

**Expected**: Click interactions work smoothly

---

### Test 2.5: Detailed Price View
- [ ] Click on any crop
- [ ] Verify detailed view shows:
  - [ ] Large emoji icon
  - [ ] Crop name (English + Hindi)
  - [ ] Modal price in green box
  - [ ] Min price in blue box
  - [ ] Max price in orange box
  - [ ] Source badge
  - [ ] Location badge
  - [ ] Back button

**Expected**: All details display correctly

---

### Test 2.6: Mobile Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone SE (375px)
  - [ ] Verify 2 columns
  - [ ] Verify cards stack properly
  - [ ] Verify text is readable
- [ ] Test on iPad (768px)
  - [ ] Verify 3 columns
  - [ ] Verify spacing is good
- [ ] Test on Desktop (1920px)
  - [ ] Verify 5 columns
  - [ ] Verify layout looks good

**Expected**: Responsive on all screen sizes

---

### Test 2.7: Loading State
- [ ] Refresh page
- [ ] Verify loading spinner appears
- [ ] Verify "Loading market prices..." text shows
- [ ] Wait for data to load
- [ ] Verify spinner disappears
- [ ] Verify cards appear

**Expected**: Loading state displays correctly

---

### Test 2.8: Error Handling
- [ ] Open DevTools Network tab
- [ ] Set throttling to "Offline"
- [ ] Refresh page
- [ ] Verify fallback prices display
- [ ] Check console for error logs
- [ ] Set throttling back to "Online"
- [ ] Refresh page
- [ ] Verify real prices load

**Expected**: Graceful error handling with fallback data

---

## 3. Negotiations Page Testing

### Test 3.1: Empty State
- [ ] Navigate to: `https://lokalmandi.lehana.in/negotiations`
- [ ] If no negotiations exist, verify:
  - [ ] Shows 💬 emoji
  - [ ] Shows "No negotiations yet" heading
  - [ ] Shows helpful message
  - [ ] Shows "Browse Listings" button (if implemented)

**Expected**: User-friendly empty state

---

### Test 3.2: Negotiations List (if data exists)
- [ ] Verify negotiations display in cards
- [ ] For each negotiation, verify shows:
  - [ ] Crop type
  - [ ] Asking price
  - [ ] Your offer
  - [ ] Status (Pending/Accepted/Rejected)
  - [ ] Status icon
- [ ] Verify active negotiations show buttons

**Expected**: All negotiation details display

---

### Test 3.3: View Details Button
- [ ] Click "View Details" on a negotiation
- [ ] Verify navigates to listing detail page
- [ ] Verify correct listing loads
- [ ] Use browser back button
- [ ] Verify returns to negotiations page

**Expected**: Navigation works correctly

---

### Test 3.4: Withdraw Button
- [ ] Click "Withdraw" on an active negotiation
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel"
- [ ] Verify nothing happens
- [ ] Click "Withdraw" again
- [ ] Click "OK" in confirmation
- [ ] Verify success message appears
- [ ] Verify negotiation is removed or status changes

**Expected**: Withdraw functionality works

---

### Test 3.5: Loading State
- [ ] Refresh negotiations page
- [ ] Verify loading spinner appears
- [ ] Wait for data to load
- [ ] Verify spinner disappears

**Expected**: Loading state displays

---

## 4. Image Loading Testing

### Test 4.1: Crop Images
- [ ] Navigate to Home page
- [ ] Verify all crop images load
- [ ] Navigate to Browse Listings
- [ ] Verify all listing images load
- [ ] Navigate to a Listing Detail
- [ ] Verify listing image loads

**Expected**: All images load correctly

---

### Test 4.2: Image Fallback
- [ ] Open DevTools Network tab
- [ ] Block image requests (or use offline mode)
- [ ] Refresh page
- [ ] Verify fallback image (wheat.jpg) displays
- [ ] Unblock image requests
- [ ] Refresh page
- [ ] Verify correct images load

**Expected**: Fallback mechanism works

---

## 5. Animation Testing

### Test 5.1: Page Load Animations
- [ ] Navigate to Guide page
- [ ] Verify header fades in
- [ ] Verify guide cards slide up
- [ ] Navigate to Market Prices
- [ ] Verify header fades in
- [ ] Verify crop cards slide up

**Expected**: Smooth entrance animations

---

### Test 5.2: Hover Animations
- [ ] Hover over guide cards
- [ ] Verify smooth scale/lift animation
- [ ] Hover over crop cards
- [ ] Verify smooth scale/lift animation
- [ ] Hover over buttons
- [ ] Verify color transitions

**Expected**: All hover effects smooth

---

### Test 5.3: Transition Animations
- [ ] Click between pages
- [ ] Verify smooth page transitions
- [ ] Change language on Guide page
- [ ] Verify smooth content transition
- [ ] Click crop card on Market Prices
- [ ] Verify smooth view transition

**Expected**: All transitions smooth

---

## 6. Responsive Design Testing

### Test 6.1: Mobile (375px - iPhone SE)
- [ ] Set viewport to 375px width
- [ ] Test Guide page
  - [ ] Verify readable text
  - [ ] Verify buttons are tappable
  - [ ] Verify language selector works
- [ ] Test Market Prices page
  - [ ] Verify 2 columns
  - [ ] Verify cards are tappable
  - [ ] Verify detailed view works
- [ ] Test Negotiations page
  - [ ] Verify cards stack properly
  - [ ] Verify buttons are tappable

**Expected**: Fully functional on mobile

---

### Test 6.2: Tablet (768px - iPad)
- [ ] Set viewport to 768px width
- [ ] Test all pages
- [ ] Verify 3-column layout on Market Prices
- [ ] Verify proper spacing
- [ ] Verify touch targets are adequate

**Expected**: Optimized for tablet

---

### Test 6.3: Desktop (1920px)
- [ ] Set viewport to 1920px width
- [ ] Test all pages
- [ ] Verify 5-column layout on Market Prices
- [ ] Verify content is centered
- [ ] Verify no excessive whitespace

**Expected**: Looks good on large screens

---

## 7. Performance Testing

### Test 7.1: Page Load Speed
- [ ] Open DevTools Network tab
- [ ] Clear cache
- [ ] Navigate to Market Prices page
- [ ] Check "Load" time in Network tab
- [ ] Verify loads in under 3 seconds

**Expected**: Fast page loads

---

### Test 7.2: API Response Times
- [ ] Open DevTools Network tab
- [ ] Navigate to Market Prices page
- [ ] Check API call times
- [ ] Verify all under 500ms

**Expected**: Fast API responses

---

### Test 7.3: Translation Speed
- [ ] Navigate to Guide page
- [ ] Select a guide
- [ ] Change language to Hindi
- [ ] Time how long translation takes
- [ ] Verify under 2 seconds

**Expected**: Fast translations

---

## 8. Browser Compatibility Testing

### Test 8.1: Chrome
- [ ] Test all features in Chrome
- [ ] Verify no console errors
- [ ] Verify all animations work
- [ ] Verify all interactions work

**Expected**: Fully functional

---

### Test 8.2: Firefox
- [ ] Test all features in Firefox
- [ ] Verify no console errors
- [ ] Verify all animations work
- [ ] Verify all interactions work

**Expected**: Fully functional

---

### Test 8.3: Safari (if available)
- [ ] Test all features in Safari
- [ ] Verify no console errors
- [ ] Verify all animations work
- [ ] Verify all interactions work

**Expected**: Fully functional

---

## 9. Accessibility Testing

### Test 9.1: Keyboard Navigation
- [ ] Use Tab key to navigate
- [ ] Verify focus indicators visible
- [ ] Verify can access all interactive elements
- [ ] Use Enter to activate buttons
- [ ] Verify keyboard shortcuts work

**Expected**: Fully keyboard accessible

---

### Test 9.2: Screen Reader (if available)
- [ ] Enable screen reader
- [ ] Navigate through pages
- [ ] Verify all content is announced
- [ ] Verify images have alt text
- [ ] Verify buttons have labels

**Expected**: Screen reader friendly

---

### Test 9.3: Color Contrast
- [ ] Check text on backgrounds
- [ ] Verify sufficient contrast
- [ ] Check button colors
- [ ] Check link colors

**Expected**: Good contrast ratios

---

## 10. Edge Cases Testing

### Test 10.1: Slow Network
- [ ] Set DevTools throttling to "Slow 3G"
- [ ] Navigate to Market Prices
- [ ] Verify loading state shows
- [ ] Wait for data to load
- [ ] Verify page works correctly

**Expected**: Handles slow network gracefully

---

### Test 10.2: Offline Mode
- [ ] Set DevTools to "Offline"
- [ ] Try navigating pages
- [ ] Verify error messages are helpful
- [ ] Go back online
- [ ] Verify functionality restores

**Expected**: Graceful offline handling

---

### Test 10.3: Long Content
- [ ] Select longest guide
- [ ] Translate to Hindi
- [ ] Verify scrolling works
- [ ] Verify no layout breaks

**Expected**: Handles long content well

---

## Testing Summary

After completing all tests, fill out:

**Total Tests**: _____ / 150  
**Passed**: _____  
**Failed**: _____  
**Pass Rate**: _____%

**Critical Issues Found**:
1. _____________________
2. _____________________
3. _____________________

**Minor Issues Found**:
1. _____________________
2. _____________________
3. _____________________

**Recommendations**:
1. _____________________
2. _____________________
3. _____________________

---

**Tester Name**: _____________________  
**Date**: _____________________  
**Time Spent**: _____________________  
**Browser Used**: _____________________  
**Device Used**: _____________________

---

**Status**: [ ] PASS [ ] FAIL [ ] NEEDS WORK

**Sign-off**: _____________________
