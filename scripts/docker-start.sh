#!/bin/bash

# Multilingual Mandi - Docker Quick Start Script
# This script helps you quickly start the application with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_info "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists docker-compose; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.docker template..."
    if [ -f .env.docker ]; then
        cp .env.docker .env
        print_success "Created .env file from template"
        print_warning "Please edit .env file with your configuration before proceeding"
        echo ""
        echo "Required configurations:"
        echo "  - JWT_SECRET (generate a strong random string)"
        echo "  - API keys (SARVAM_API_KEY, OPENROUTER_API_KEY, etc.)"
        echo "  - Database password (if using PostgreSQL)"
        echo ""
        read -p "Press Enter after editing .env file to continue..."
    else
        print_error ".env.docker template not found"
        exit 1
    fi
fi

# Ask user for deployment mode
echo ""
print_info "Select deployment mode:"
echo "  1) Development (with hot reload and debugging)"
echo "  2) Production (optimized build)"
echo "  3) Production with PostgreSQL"
echo ""
read -p "Enter choice [1-3]: " mode

case $mode in
    1)
        print_info "Starting in DEVELOPMENT mode..."
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
        ;;
    2)
        print_info "Starting in PRODUCTION mode (with SQLite)..."
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
        ;;
    3)
        print_info "Starting in PRODUCTION mode (with PostgreSQL)..."
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
        print_warning "Make sure PostgreSQL configuration is set in .env"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Build images
echo ""
print_info "Building Docker images..."
docker-compose $COMPOSE_FILES build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Build completed successfully"

# Start services
echo ""
print_info "Starting services..."
docker-compose $COMPOSE_FILES up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start services"
    exit 1
fi

print_success "Services started successfully"

# Wait for services to be healthy
echo ""
print_info "Waiting for services to be healthy..."
sleep 5

# Check service status
docker-compose ps

# Display access information
echo ""
print_success "Multilingual Mandi is now running!"
echo ""
echo "Access the application:"
echo "  Frontend:  http://localhost:80"
echo "  Backend:   http://localhost:5000"
echo "  Health:    http://localhost:5000/api/health"
echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Stop services:    docker-compose down"
echo "  Restart:          docker-compose restart"
echo "  View status:      docker-compose ps"
echo ""

# Offer to show logs
read -p "Would you like to view logs? (y/n): " show_logs

if [ "$show_logs" = "y" ] || [ "$show_logs" = "Y" ]; then
    docker-compose logs -f
fi
