#!/bin/bash

# Dockerfile Verification Script
# This script verifies that the Dockerfiles are syntactically correct and can build successfully

set -e

echo "=========================================="
echo "Dockerfile Verification Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed: $(docker --version)"
echo ""

# Check if Dockerfiles exist
echo "Checking Dockerfile existence..."
if [ ! -f "backend/Dockerfile" ]; then
    print_error "backend/Dockerfile not found"
    exit 1
fi
print_success "backend/Dockerfile exists"

if [ ! -f "frontend/Dockerfile" ]; then
    print_error "frontend/Dockerfile not found"
    exit 1
fi
print_success "frontend/Dockerfile exists"

if [ ! -f "Dockerfile.backend" ]; then
    print_error "Dockerfile.backend not found"
    exit 1
fi
print_success "Dockerfile.backend exists"

if [ ! -f "Dockerfile.frontend" ]; then
    print_error "Dockerfile.frontend not found"
    exit 1
fi
print_success "Dockerfile.frontend exists"
echo ""

# Check if .dockerignore files exist
echo "Checking .dockerignore files..."
if [ ! -f "backend/.dockerignore" ]; then
    print_info "backend/.dockerignore not found (optional but recommended)"
else
    print_success "backend/.dockerignore exists"
fi

if [ ! -f "frontend/.dockerignore" ]; then
    print_info "frontend/.dockerignore not found (optional but recommended)"
else
    print_success "frontend/.dockerignore exists"
fi
echo ""

# Verify Dockerfile syntax (dry-run build)
echo "Verifying backend Dockerfile syntax..."
if docker build -f Dockerfile.backend -t mandi-backend:test --no-cache . > /dev/null 2>&1; then
    print_success "Backend Dockerfile syntax is valid and builds successfully"
    docker rmi mandi-backend:test > /dev/null 2>&1 || true
else
    print_error "Backend Dockerfile has syntax errors or build failed"
    echo "Run: docker build -f Dockerfile.backend -t mandi-backend:test ."
    exit 1
fi
echo ""

echo "Verifying frontend Dockerfile syntax..."
if docker build -f Dockerfile.frontend -t mandi-frontend:test --no-cache . > /dev/null 2>&1; then
    print_success "Frontend Dockerfile syntax is valid and builds successfully"
    docker rmi mandi-frontend:test > /dev/null 2>&1 || true
else
    print_error "Frontend Dockerfile has syntax errors or build failed"
    echo "Run: docker build -f Dockerfile.frontend -t mandi-frontend:test ."
    exit 1
fi
echo ""

# Check image sizes
echo "Checking image sizes..."
print_info "Building images to check final sizes (this may take a few minutes)..."

# Build backend
docker build -f Dockerfile.backend -t mandi-backend:size-check . > /dev/null 2>&1
BACKEND_SIZE=$(docker images mandi-backend:size-check --format "{{.Size}}")
print_success "Backend image size: $BACKEND_SIZE"

# Build frontend
docker build -f Dockerfile.frontend -t mandi-frontend:size-check . > /dev/null 2>&1
FRONTEND_SIZE=$(docker images mandi-frontend:size-check --format "{{.Size}}")
print_success "Frontend image size: $FRONTEND_SIZE"

# Cleanup
docker rmi mandi-backend:size-check > /dev/null 2>&1 || true
docker rmi mandi-frontend:size-check > /dev/null 2>&1 || true
echo ""

# Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
print_success "All Dockerfiles are valid and build successfully!"
echo ""
echo "Backend Image Size: $BACKEND_SIZE"
echo "Frontend Image Size: $FRONTEND_SIZE"
echo ""
echo "Next steps:"
echo "1. Build images: docker-compose build"
echo "2. Start services: docker-compose up -d"
echo "3. View logs: docker-compose logs -f"
echo ""
print_success "Verification complete!"
