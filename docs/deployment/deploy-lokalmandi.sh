#!/bin/bash

# ==================================================================================
# LOKAL MANDI DEPLOYMENT SCRIPT
# ==================================================================================
# This script deploys the Lokal Mandi application to lokalmandi.lehana.in
# It uses a separate docker-compose configuration to avoid conflicts with production
# ==================================================================================

set -e  # Exit on error

echo "🚀 Starting Lokal Mandi Deployment..."
echo "=================================================="

# Navigate to project directory
cd /root/repo/ai-for-bharat-prompt-challenge

# Check if docker-compose file exists
if [ ! -f "docker-compose.lokalmandi.yml" ]; then
    echo "❌ Error: docker-compose.lokalmandi.yml not found!"
    exit 1
fi

# Stop existing containers if running
echo "🛑 Stopping existing Lokal Mandi containers..."
docker-compose -f docker-compose.lokalmandi.yml down 2>/dev/null || true

# Remove old containers
echo "🗑️  Removing old containers..."
docker rm -f lokalmandi-backend lokalmandi-frontend 2>/dev/null || true

# Build and start new containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.lokalmandi.yml up -d --build

# Wait for containers to be healthy
echo "⏳ Waiting for containers to start..."
sleep 10

# Check container status
echo "📊 Container Status:"
docker ps | grep lokalmandi || echo "⚠️  No Lokal Mandi containers running!"

# Check logs
echo ""
echo "📝 Recent Backend Logs:"
docker logs lokalmandi-backend --tail 20

echo ""
echo "📝 Recent Frontend Logs:"
docker logs lokalmandi-frontend --tail 20

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: https://lokalmandi.lehana.in"
echo "   Backend API: https://lokalmandi.lehana.in/api"
echo ""
echo "🔍 Useful Commands:"
echo "   View logs: docker logs -f lokalmandi-backend"
echo "   Restart: docker-compose -f docker-compose.lokalmandi.yml restart"
echo "   Stop: docker-compose -f docker-compose.lokalmandi.yml down"
echo "=================================================="
