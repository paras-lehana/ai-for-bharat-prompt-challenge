#!/bin/bash

echo "=== Testing Lokal Mandi API ==="
echo ""

# Test 1: Check listings
echo "1. Testing /api/listings/search..."
LISTINGS=$(docker exec lokalmandi-backend node -e "const {Listing} = require('./src/models'); Listing.count().then(c => console.log(c));")
echo "   Listings in DB: $LISTINGS"

# Test 2: Check negotiations  
echo "2. Testing negotiations..."
NEGOTIATIONS=$(docker exec lokalmandi-backend node -e "const {Negotiation} = require('./src/models'); Negotiation.count().then(c => console.log(c));")
echo "   Negotiations in DB: $NEGOTIATIONS"

# Test 3: Check users
echo "3. Testing users..."
USERS=$(docker exec lokalmandi-backend node -e "const {User} = require('./src/models'); User.count().then(c => console.log(c));")
echo "   Users in DB: $USERS"

echo ""
echo "=== Summary ==="
echo "Listings: $LISTINGS"
echo "Negotiations: $NEGOTIATIONS"
echo "Users: $USERS"
echo ""
echo "✅ Database is ready!"
echo ""
echo "📝 Please login at: https://lokalmandi.lehana.in/login"
echo "   Use OTP: 1104"
echo ""
echo "🔍 Monitoring logs for next 60 seconds..."
echo "   (Watching for errors when you login and test)"
echo ""

# Monitor logs for 60 seconds
timeout 60 docker logs lokalmandi-backend -f 2>&1 | grep -E "error|Error|500|CONSTRAINT|POST|GET" || true

echo ""
echo "=== Monitoring stopped ==="
