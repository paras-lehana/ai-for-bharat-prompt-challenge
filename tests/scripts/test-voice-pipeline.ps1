# Test Voice Pipeline: SARVAM STT -> OpenRouter Intent Extraction
# Usage: .\test-voice-pipeline.ps1 [audio-file-path]
# Example: .\test-voice-pipeline.ps1 test\sample_add_listing.m4a

param(
    [string]$AudioFile = "test\sample_add_listing.m4a"
)

Write-Host "🎙️ Voice Pipeline Test" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Check if audio file exists
if (-not (Test-Path $AudioFile)) {
    Write-Host "❌ Audio file not found: $AudioFile" -ForegroundColor Red
    Write-Host "Please provide a valid audio file path" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Audio file: $AudioFile" -ForegroundColor Green
Write-Host ""

# Step 1: Test SARVAM STT
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "STEP 1: SARVAM Speech-to-Text" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$sarvamOutput = node backend\test-sarvam-standalone.js $AudioFile 2>&1 | Out-String
Write-Host $sarvamOutput

# Extract transcription from output
$transcriptionMatch = $sarvamOutput | Select-String -Pattern "📝 Transcribed Text: (.+)"
if ($transcriptionMatch) {
    $transcription = $transcriptionMatch.Matches[0].Groups[1].Value.Trim()
    Write-Host ""
    Write-Host "✅ Transcription extracted: $transcription" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Test OpenRouter with transcription
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "STEP 2: OpenRouter Intent Extraction" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    
    $openrouterOutput = node backend\test-openrouter-standalone.js "$transcription" 2>&1
    Write-Host $openrouterOutput
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ Pipeline Test Complete!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    
} else {
    Write-Host ""
    Write-Host "❌ Failed to extract transcription from SARVAM response" -ForegroundColor Red
    Write-Host "Check the SARVAM API response above for errors" -ForegroundColor Yellow
    exit 1
}
