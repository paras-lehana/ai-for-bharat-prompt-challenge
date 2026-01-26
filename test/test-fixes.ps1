# Test Script for Critical Fixes
# Run this to verify all fixes are working

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MULTILINGUAL MANDI - FIX VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if images exist
Write-Host "[1/5] Checking crop images..." -ForegroundColor Yellow
$imageDir = "frontend/public/images/crops"
$expectedImages = @("wheat.jpg", "rice.jpg", "tomato.jpg", "onion.jpg", "potato.jpg", "cotton.png", "sugarcane.webp", "maize.jpeg", "soybean.jpg", "groundnut.jpg")
$allImagesPresent = $true

foreach ($img in $expectedImages) {
    $path = Join-Path $imageDir $img
    if (Test-Path $path) {
        Write-Host "  ✓ $img found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $img MISSING" -ForegroundColor Red
        $allImagesPresent = $false
    }
}

if ($allImagesPresent) {
    Write-Host "  ✅ All images present!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Some images missing!" -ForegroundColor Red
}
Write-Host ""

# Test 2: Check KisaanBot component
Write-Host "[2/5] Checking KisaanBot component..." -ForegroundColor Yellow
$kisaanBotFile = "frontend/src/components/KisaanBot.jsx"
if (Test-Path $kisaanBotFile) {
    $content = Get-Content $kisaanBotFile -Raw
    if ($content -match "parse-intent" -and $content -match "executeAction" -and $content -match "parsedIntent") {
        Write-Host "  ✅ KisaanBot has complete workflow!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ KisaanBot missing workflow components!" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ KisaanBot file not found!" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check Guide page
Write-Host "[3/5] Checking Guide page..." -ForegroundColor Yellow
$guideFile = "frontend/src/pages/Guide.jsx"
if (Test-Path $guideFile) {
    $content = Get-Content $guideFile -Raw
    if ($content -match "Quick Start Guide" -and $content -notmatch "Use Google Translate") {
        Write-Host "  ✅ Guide page has embedded content!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Guide page issues detected!" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Guide file not found!" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check seed script
Write-Host "[4/5] Checking seed script..." -ForegroundColor Yellow
$seedFile = "backend/src/utils/seed.js"
if (Test-Path $seedFile) {
    $content = Get-Content $seedFile -Raw
    if ($content -match "/images/crops/") {
        Write-Host "  ✅ Seed script has correct image paths!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Seed script image paths incorrect!" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Seed file not found!" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check voice route
Write-Host "[5/5] Checking voice API route..." -ForegroundColor Yellow
$voiceFile = "backend/src/routes/voice.js"
if (Test-Path $voiceFile) {
    $content = Get-Content $voiceFile -Raw
    if ($content -match "parse-intent") {
        Write-Host "  ✅ Voice route has parse-intent endpoint!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Voice route missing parse-intent!" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Voice route file not found!" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Reseed database: cd backend; npm run seed" -ForegroundColor White
Write-Host "2. Restart backend: cd backend; npm start" -ForegroundColor White
Write-Host "3. Restart frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "4. Test Kisaan Bot with microphone" -ForegroundColor White
Write-Host "5. Test Guide page navigation" -ForegroundColor White
Write-Host "6. Test image loading on listings" -ForegroundColor White
Write-Host ""
