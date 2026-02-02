# Tests Directory

## Structure

```
tests/
├── README.md           # This file
├── scripts/            # Test scripts for various features
│   ├── test-*.js       # Feature-specific tests
│   ├── test_*.js       # Backend tests
│   └── test-api.sh     # API integration test
├── results/            # Test execution results (timestamped JSON)
│   ├── test-all-apis-*.json
│   └── test-results-local-*.json
└── TESTING_COMPLETE.md # Test completion report
```

## Running Tests

### Feature Tests
```bash
# Run from project root
node tests/scripts/test-dark-mode.js
node tests/scripts/test-favorites.js
node tests/scripts/test-price-alerts.js
node tests/scripts/test-qr-code.js
node tests/scripts/test-saved-searches.js
node tests/scripts/test-share-listings.js
```

### API Tests
```bash
# Comprehensive API test
bash tests/scripts/test-api.sh

# Local comprehensive test
node tests/scripts/test-local-comprehensive.js
```

### Model Tests
```bash
# Test AI models
node tests/scripts/test_models.js
node tests/scripts/test_summary_hi.js
```

## Test Results

Test results are automatically saved with timestamps in `results/` directory.

Results include:
- API response times
- Success/failure status
- Error messages (if any)
- Timestamp and test metadata
