# Scripts Directory

## Utility Scripts

### Image Management
- **download-crop-images.js** - Download crop images from external sources
- **download-images.js** - Generic image downloader
- **fix_images.js** - Fix broken/missing image references
- **fix_missing_images.js** - Batch repair missing images

### Data Management
- **clear_listings.js** - Clear all listings from database (dev only)

### Deployment
- **docker-start.sh** - Start Docker containers with proper configuration
- **verify-dockerfiles.sh** - Validate Dockerfile syntax and structure

## Usage

Run scripts from project root:
```bash
# Start Docker deployment
bash scripts/docker-start.sh

# Verify Dockerfiles
bash scripts/verify-dockerfiles.sh

# Clear database (development only!)
node scripts/clear_listings.js
```

## ⚠️ Warning

Some scripts modify database or production state. Use with caution.
