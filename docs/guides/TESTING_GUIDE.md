# Testing Guide - Multilingual Mandi

## 🚀 Application is Running!

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000

---

## ✅ Quick Test Checklist

### 1. Authentication Flow
- [ ] Open http://localhost:3000
- [ ] Enter phone number: `+919876543210`
- [ ] Click "Send OTP"
- [ ] Check backend logs for OTP (or use: `312802`)
- [ ] Enter OTP and verify
- [ ] Select role (Vendor or Buyer)
- [ ] Complete profile setup

### 2. Create Listing (as Vendor)
- [ ] Navigate to "Create Listing"
- [ ] Fill in crop details:
  - Crop Type: Wheat
  - Quantity: 100
  - Unit: Quintal
  - Base Price: 2000
  - Quality Tier: Premium
- [ ] Upload image (optional)
- [ ] View calculated final price
- [ ] Submit listing

### 3. Browse and Search
- [ ] Navigate to "Browse Listings"
- [ ] Use search filters:
  - Crop type
  - Quality tier
  - Price range
- [ ] Sort by price, distance, trust score
- [ ] Click on a listing to view details

### 4. Make an Offer (as Buyer)
- [ ] View listing detail
- [ ] Click "Make Offer"
- [ ] Enter offer price
- [ ] Submit negotiation
- [ ] View negotiation status

### 5. View Negotiations
- [ ] Navigate to "My Negotiations"
- [ ] View active negotiations
- [ ] Accept/reject/counter offers
- [ ] Check 24-hour expiration timer

### 6. Check Market Prices
- [ ] Navigate to "Price Info"
- [ ] View eNAM prices by crop
- [ ] Check price breakdown
- [ ] View market trends

### 7. Vendor Profile
- [ ] Click on vendor name
- [ ] View trust score and badges
- [ ] View active listings
- [ ] Check ratings and reviews

### 8. Voice Query (Mocked)
- [ ] Click "🎤 Ask Price" button on home page
- [ ] View mock voice response
- [ ] Check language selection

---

## 🧪 API Testing with cURL

### Health Check
```bash
curl http://localhost:5000/health
```

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "otp": "312802"}'
```

### Get Current Prices
```bash
curl http://localhost:5000/api/prices/current?cropType=wheat
```

### Search Listings
```bash
curl "http://localhost:5000/api/listings/search?cropType=wheat&qualityTier=premium"
```

---

## 🔍 Backend Logs

View backend logs:
```bash
docker-compose logs backend -f
```

View frontend logs:
```bash
docker-compose logs frontend -f
```

View all logs:
```bash
docker-compose logs -f
```

---

## 🐛 Common Issues

### Issue: OTP not received
**Solution**: Check backend logs for the OTP code:
```bash
docker-compose logs backend | grep "OTP for"
```

### Issue: Frontend not loading
**Solution**: Check if containers are running:
```bash
docker ps
```

### Issue: API errors
**Solution**: Check backend logs:
```bash
docker-compose logs backend -f
```

### Issue: Database errors
**Solution**: Restart containers:
```bash
docker-compose restart
```

---

## 📊 Test Data

### Test Phone Numbers
- `+919876543210` - Primary test account
- `+919876543211` - Secondary test account
- `+919876543212` - Third test account

### Test Crops
- Wheat
- Rice
- Tomato
- Onion
- Potato

### Quality Tiers
- Premium (1.2x multiplier)
- Standard (1.0x multiplier)
- Basic (0.85x multiplier)

---

## 🎯 Feature Testing Matrix

| Feature | Status | Test URL | Notes |
|---------|--------|----------|-------|
| Authentication | ✅ | /login | OTP in logs |
| Listings CRUD | ✅ | /create-listing | Full CRUD |
| Search & Filter | ✅ | /browse | Multiple filters |
| Negotiations | ✅ | /negotiations | 24hr expiry |
| Vendor Profiles | ✅ | /vendor/:id | Trust scores |
| Market Prices | ✅ | /prices | eNAM data |
| Voice Query | ✅ | / | Mocked |
| Messaging | ✅ | API only | Backend ready |
| Transactions | ✅ | API only | Backend ready |
| Analytics | ✅ | API only | Backend ready |

---

## 🚀 Performance Testing

### Load Test (Optional)
```bash
# Install Apache Bench
# Test API endpoint
ab -n 100 -c 10 http://localhost:5000/health
```

---

## 📱 Mobile Testing

1. Open http://localhost:3000 on mobile browser
2. Test responsive design (320px - 1920px)
3. Test touch targets (minimum 48px)
4. Test mobile navigation
5. Test forms on mobile

---

## ✨ Demo Flow (5 minutes)

1. **Login** (30 sec)
   - Show OTP authentication
   - Select vendor role

2. **Create Listing** (1 min)
   - Show price calculator
   - Demonstrate quality tiers
   - Show final price breakdown

3. **Browse & Search** (1 min)
   - Show search filters
   - Demonstrate sorting
   - View listing details

4. **Negotiate** (1 min)
   - Make an offer
   - Show AI suggestions (mocked)
   - Accept/reject flow

5. **Show Features** (1.5 min)
   - Vendor profile with trust score
   - Market prices (eNAM)
   - Voice query button
   - Mobile responsive design

---

## 🎓 Next Steps

After testing:
1. ✅ All core features working
2. ✅ API endpoints functional
3. ✅ Frontend responsive
4. ✅ Database operations working
5. ✅ Docker deployment successful

Ready for hackathon demo! 🎉

---

**Last Updated**: January 26, 2026
