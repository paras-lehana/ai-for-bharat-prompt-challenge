# Docker Deployment Guide

This guide explains how to build and deploy the Multilingual Mandi platform using Docker.

## Overview

The platform consists of two main services:
- **Backend**: Node.js/Express API server (Port 5000)
- **Frontend**: React application served by Nginx (Port 80)

Both services use multi-stage builds for optimized production images.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher (optional, for orchestration)
- At least 2GB of available RAM
- 5GB of available disk space

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Individual Images

#### Backend

```bash
# Build from root directory
docker build -f Dockerfile.backend -t multilingual-mandi-backend:latest .

# Or build from backend directory
cd backend
docker build -t multilingual-mandi-backend:latest .
```

#### Frontend

```bash
# Build from root directory
docker build -f Dockerfile.frontend -t multilingual-mandi-frontend:latest .

# Or build from frontend directory
cd frontend
docker build -t multilingual-mandi-frontend:latest .
```

## Running Containers

### Backend Container

```bash
docker run -d \
  --name mandi-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e JWT_SECRET=your-secret-key \
  -e DATABASE_URL=sqlite:/app/data/mandi.db \
  -v mandi-data:/app/data \
  -v mandi-logs:/app/logs \
  multilingual-mandi-backend:latest
```

### Frontend Container

```bash
docker run -d \
  --name mandi-frontend \
  -p 80:80 \
  --link mandi-backend:backend \
  multilingual-mandi-frontend:latest
```

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | No |
| `PORT` | Backend port | `5000` | No |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `DATABASE_URL` | Database connection string | `sqlite:/app/data/mandi.db` | No |
| `SARVAM_API_KEY` | Sarvam AI API key | - | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost` | No |

### Frontend Environment Variables

The frontend is built at compile time, so environment variables must be set during the build process:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -f Dockerfile.frontend \
  -t multilingual-mandi-frontend:latest .
```

## Volume Mounts

### Backend Volumes

- `/app/data` - Database and persistent data
- `/app/logs` - Application logs
- `/app/uploads` - User uploaded files (images, etc.)

Example with volumes:

```bash
docker run -d \
  --name mandi-backend \
  -p 5000:5000 \
  -v $(pwd)/backend/data:/app/data \
  -v $(pwd)/backend/logs:/app/logs \
  -v $(pwd)/backend/uploads:/app/uploads \
  multilingual-mandi-backend:latest
```

## Image Optimization Features

### Multi-Stage Builds

Both Dockerfiles use multi-stage builds to minimize final image size:

- **Backend**: ~150MB (vs ~500MB without optimization)
- **Frontend**: ~25MB (vs ~400MB without optimization)

### Security Features

1. **Non-root user**: Backend runs as `nodejs` user (UID 1001)
2. **Minimal base images**: Using Alpine Linux for smaller attack surface
3. **Security headers**: Frontend nginx configured with security headers
4. **Health checks**: Both services include health check endpoints

### Performance Optimizations

1. **Production dependencies only**: Backend installs only production npm packages
2. **Static asset caching**: Frontend configured with 1-year cache for static assets
3. **Gzip compression**: Frontend nginx enables gzip for text-based assets
4. **Layer caching**: Optimized layer ordering for faster rebuilds

## Health Checks

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response: `200 OK`

### Frontend Health Check

```bash
curl http://localhost/
```

Expected response: `200 OK` with HTML content

## Troubleshooting

### Backend won't start

1. Check logs: `docker logs mandi-backend`
2. Verify environment variables are set
3. Ensure database volume has write permissions
4. Check if port 5000 is already in use

### Frontend shows blank page

1. Check nginx logs: `docker logs mandi-frontend`
2. Verify build completed successfully
3. Check browser console for API connection errors
4. Ensure backend is accessible from frontend container

### Database connection issues

1. Verify volume mount is correct
2. Check database file permissions
3. Ensure DATABASE_URL is properly formatted
4. For PostgreSQL, verify connection string and network access

### Build failures

1. Clear Docker cache: `docker builder prune`
2. Ensure sufficient disk space
3. Check npm registry connectivity
4. Verify package.json files are valid

## Production Deployment

### Using Docker Compose

See `docker-compose.yml` for production configuration with:
- PostgreSQL database
- Nginx reverse proxy
- Volume persistence
- Network isolation
- Environment variable management

### Cloud Deployment

#### AWS ECS/Fargate

```bash
# Tag images for ECR
docker tag multilingual-mandi-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/mandi-backend:latest
docker tag multilingual-mandi-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/mandi-frontend:latest

# Push to ECR
docker push <account>.dkr.ecr.<region>.amazonaws.com/mandi-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/mandi-frontend:latest
```

#### Google Cloud Run

```bash
# Tag for GCR
docker tag multilingual-mandi-backend:latest gcr.io/<project-id>/mandi-backend:latest
docker tag multilingual-mandi-frontend:latest gcr.io/<project-id>/mandi-frontend:latest

# Push to GCR
docker push gcr.io/<project-id>/mandi-backend:latest
docker push gcr.io/<project-id>/mandi-frontend:latest
```

#### Azure Container Instances

```bash
# Tag for ACR
docker tag multilingual-mandi-backend:latest <registry>.azurecr.io/mandi-backend:latest
docker tag multilingual-mandi-frontend:latest <registry>.azurecr.io/mandi-frontend:latest

# Push to ACR
docker push <registry>.azurecr.io/mandi-backend:latest
docker push <registry>.azurecr.io/mandi-frontend:latest
```

## Monitoring

### Container Stats

```bash
# View resource usage
docker stats mandi-backend mandi-frontend

# View detailed container info
docker inspect mandi-backend
```

### Logs

```bash
# Follow logs
docker logs -f mandi-backend
docker logs -f mandi-frontend

# View last 100 lines
docker logs --tail 100 mandi-backend
```

## Maintenance

### Updating Images

```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### Backup Database

```bash
# Backup SQLite database
docker cp mandi-backend:/app/data/mandi.db ./backup/mandi-$(date +%Y%m%d).db

# Or use volume backup
docker run --rm \
  -v mandi-data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/mandi-data-$(date +%Y%m%d).tar.gz /data
```

### Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup (WARNING: removes all unused resources)
docker system prune -a --volumes
```

## Performance Tuning

### Backend

- Adjust Node.js memory: `docker run -e NODE_OPTIONS="--max-old-space-size=2048"`
- Enable clustering: Set `CLUSTER_MODE=true` environment variable
- Use PM2 for process management in production

### Frontend

- Enable HTTP/2 in nginx configuration
- Adjust worker processes based on CPU cores
- Configure CDN for static assets
- Enable brotli compression for better compression ratios

## Security Best Practices

1. **Never commit secrets**: Use environment variables or secrets management
2. **Scan images**: Use `docker scan` or Trivy for vulnerability scanning
3. **Update base images**: Regularly rebuild with latest Alpine/Node versions
4. **Limit resources**: Use `--memory` and `--cpus` flags to prevent resource exhaustion
5. **Use secrets**: For sensitive data, use Docker secrets or external secret managers

## Support

For issues or questions:
- Check logs first: `docker logs <container-name>`
- Review this documentation
- Check GitHub issues
- Contact the development team

## License

MIT License - See LICENSE file for details
