# API Testing Script for Multilingual Mandi

Write-Host "=== Testing Multilingual Mandi APIs ===" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
$health = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -UseBasicParsing
Write-Host "Status: $($health.StatusCode)" -ForegroundColor Green
Write-Host "Response: $($health.Content)" -ForegroundColor Cyan
Write-Host ""

# Test 2: Listings Search
Write-Host "2. Testing Listings Search..." -ForegroundColor Yellow
$listings = Invoke-WebRequest -Uri "http://localhost:5000/api/listings/search" -Method GET -UseBasicParsing
$listingsData = $listings.Content | ConvertFrom-Json
Write-Host "Status: $($listings.StatusCode)" -ForegroundColor Green
Write-Host "Total Listings: $($listingsData.count)" -ForegroundColor Cyan
Write-Host ""

# Test 3: Voice Query (Mock)
Write-Host "3. Testing Voice Query..." -ForegroundColor Yellow
$voiceBody = @{
    audioBase64 = "mock-audio-data"
    languageCode = "hi"
} | ConvertTo-Json

$voice = Invoke-WebRequest -Uri "http://localhost:5000/api/voice/query" -Method POST -Body $voiceBody -ContentType "application/json" -UseBasicParsing
$voiceData = $voice.Content | ConvertFrom-Json
Write-Host "Status: $($voice.StatusCode)" -ForegroundColor Green
Write-Host "Transcribed: $($voiceData.transcribedText)" -ForegroundColor Cyan
Write-Host "Response: $($voiceData.text)" -ForegroundColor Cyan
Write-Host ""

# Test 4: Price Calculator
Write-Host "4. Testing Price Calculator..." -ForegroundColor Yellow
$priceBody = @{
    productName = "Tomato"
    quantity = 100
    qualityTier = "premium"
    location = "Delhi"
    basePrice = 2500
} | ConvertTo-Json

$price = Invoke-WebRequest -Uri "http://localhost:5000/api/prices/calculate" -Method POST -Body $priceBody -ContentType "application/json" -UseBasicParsing
$priceData = $price.Content | ConvertFrom-Json
Write-Host "Status: $($price.StatusCode)" -ForegroundColor Green
Write-Host "Final Price: ₹$($priceData.finalPrice)" -ForegroundColor Cyan
Write-Host "Quality Multiplier: $($priceData.qualityMultiplier)" -ForegroundColor Cyan
Write-Host ""

# Test 5: eNAM Current Prices
Write-Host "5. Testing eNAM Price Lookup..." -ForegroundColor Yellow
$enam = Invoke-WebRequest -Uri "http://localhost:5000/api/prices/current?cropType=Wheat&location=Delhi" -Method GET -UseBasicParsing
$enamData = $enam.Content | ConvertFrom-Json
Write-Host "Status: $($enam.StatusCode)" -ForegroundColor Green
Write-Host "Crop: $($enamData.cropType)" -ForegroundColor Cyan
Write-Host "Modal Price: ₹$($enamData.modalPrice)" -ForegroundColor Cyan
Write-Host ""

# Test 6: Send OTP
Write-Host "6. Testing OTP Send..." -ForegroundColor Yellow
$otpBody = @{
    phoneNumber = "+919999999999"
} | ConvertTo-Json

$otp = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/send-otp" -Method POST -Body $otpBody -ContentType "application/json" -UseBasicParsing
$otpData = $otp.Content | ConvertFrom-Json
Write-Host "Status: $($otp.StatusCode)" -ForegroundColor Green
Write-Host "Message: $($otpData.message)" -ForegroundColor Cyan
Write-Host "OTP (Dev): $($otpData.otp)" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== All API Tests Completed ===" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor Magenta
Write-Host "Backend URL: http://localhost:5000" -ForegroundColor Magenta
