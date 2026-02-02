# Docker Deployment Guide - Multilingual Mandi

This guide provides comprehensive instructions for deploying the Multilingual Mandi platform using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Development Mode](#development-mode)
5. [Production Mode](#production-mode)
6. [Database Options](#database-options)
7. [Networking](#networking)
8. [Volumes and Data Persistence](#volumes-and-data-persistence)
9. [Health Checks](#health-checks)
10. [Troubleshooting](#troubleshooting)
11. [Scaling and Performance](#scaling-and-performance)

---

## Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **System Requirements**:
  - Minimum 2GB RAM
  - 10GB free disk space
  - Linux, macOS, or Windows with WSL2

### Installation

```bash
# Check Docker installation
docker --version
docker-compose --version

# If not installed, visit:
# https://docs.docker.com/get-docker/
```

---

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd multilingual-mandi

# Copy environment configuration
cp .env.docker .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 2. Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## Configuration

### Environment Variables

The application uses environment variables for configuration. Key variables:

#### Application Settings
```env
NODE_ENV=production          # development or production
BACKEND_PORT=5000           # Backend API port
FRONTEND_PORT=80            # Frontend web port
```

#### Database Configuration
```env
# SQLite (MVP/Development)
DATABASE_URL=sqlite:/app/data/mandi.db

# PostgreSQL (Production)
DATABASE_URL=postgresql://user:password@db:5432/mandi
POSTGRES_DB=mandi
POSTGRES_USER=mandi_user
POSTGRES_PASSWORD=secure-password
```

#### Security
```env
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
```

#### External APIs
```env
SARVAM_API_KEY=your-sarvam-key
OPENROUTER_API_KEY=your-openrouter-key
BHASHINI_API_KEY=your-bhashini-key
ENAM_API_KEY=your-enam-key
```

See `.env.docker` for complete configuration options.

---

## Development Mode

Development mode enables hot-reload, debugging, and source code mounting.

### Start Development Environment

```bash
# Using development override
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or use the npm script
npm run docker:dev
```

### Development Features

- **Hot Reload**: Code changes automatically reload
- **Source Mounting**: Local code mounted into containers
- **Debug Ports**: Node.js debugger on port 9229
- **SQLite Database**: File-based database for simplicity
- **Verbose Logging**: Detailed logs for debugging

### Development Workflow

```bash
# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# Execute commands in backend container
docker-compose exec backend npm run seed

# Access backend shell
docker-compose exec backend sh

# Restart a service
docker-compose restart backend
```

---

## Production Mode

Production mode uses optimized builds, security hardening, and PostgreSQL.

### Production Deployment Steps

#### 1. Configure Environment

```bash
# Copy and edit production environment
cp .env.docker .env

# Update critical values:
# - JWT_SECRET (strong random string)
# - POSTGRES_PASSWORD (strong password)
# - API keys (actual production keys)
# - CORS_ORIGIN (your domain)
```

#### 2. Build Production Images

```bash
# Build with production optimizations
docker-compose build --no-cache

# Tag images for registry (optional)
docker tag multilingual-mandi-backend:latest your-registry/mandi-backend:v1.0
docker tag multilingual-mandi-frontend:latest your-registry/mandi-frontend:v1.0
```

#### 3. Start Production Services

```bash
# Start in detached mode
docker-compose up -d

# Verify all services are healthy
docker-compose ps

# Check logs for errors
docker-compose logs --tail=100
```

#### 4. Initialize Database

```bash
# Run database migrations (if applicable)
docker-compose exec backend npm run migrate

# Seed initial data (optional)
docker-compose exec backend npm run seed
```

#### 5. Verify Deployment

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:80

# Run integration tests
docker-compose exec backend npm test
```

### Production Best Practices

1. **Use PostgreSQL**: Uncomment PostgreSQL service in docker-compose.yml
2. **Strong Secrets**: Generate secure JWT_SECRET and database passwords
3. **HTTPS**: Use reverse proxy (nginx/traefik) for SSL termination
4. **Monitoring**: Implement logging and monitoring solutions
5. **Backups**: Regular database and volume backups
6. **Updates**: Keep Docker images and dependencies updated

---

## Database Options

### SQLite (MVP/Development)

**Pros**: Simple, no separate service, good for development
**Cons**: Limited concurrency, not suitable for production scale

```yaml
# In docker-compose.yml
environment:
  - DATABASE_URL=sqlite:/app/data/mandi.db
```

### PostgreSQL (Production)

**Pros**: Better concurrency, scalability, production-ready
**Cons**: Requires separate service, more complex setup

```yaml
# In docker-compose.yml
services:
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mandi
      - POSTGRES_USER=mandi_user
      - POSTGRES_PASSWORD=secure-password
    volumes:
      - postgres-data:/var/lib/postgresql/data
```

Update backend environment:
```env
DATABASE_URL=postgresql://mandi_user:secure-password@db:5432/mandi
```

### Database Management

```bash
# Backup SQLite database
docker-compose exec backend cp /app/data/mandi.db /app/data/backup.db

# Backup PostgreSQL database
docker-compose exec db pg_dump -U mandi_user mandi > backup.sql

# Restore PostgreSQL database
docker-compose exec -T db psql -U mandi_user mandi < backup.sql

# Access PostgreSQL shell
docker-compose exec db psql -U mandi_user -d mandi
```

---

## Networking

### Network Architecture

```
┌─────────────────────────────────────────┐
│         mandi-network (bridge)          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │ Frontend │  │ Backend  │  │  DB  │ │
│  │  :80     │  │  :5000   │  │ :5432│ │
│  └──────────┘  └──────────┘  └──────┘ │
│       │             │            │     │
└───────┼─────────────┼────────────┼─────┘
        │             │            │
    Host:80      Host:5000    Host:5432
```

### Service Communication

- **Frontend → Backend**: Uses service name `backend:5000`
- **Backend → Database**: Uses service name `db:5432`
- **External Access**: Through published ports

### Custom Network Configuration

```yaml
networks:
  mandi-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## Volumes and Data Persistence

### Named Volumes

The application uses named volumes for persistent data:

```yaml
volumes:
  backend-data:      # Database files, uploads
  backend-logs:      # Application logs
  backend-uploads:   # User uploaded files
  postgres-data:     # PostgreSQL data
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect mandi-backend-data

# Backup volume
docker run --rm -v mandi-backend-data:/data -v $(pwd):/backup alpine tar czf /backup/backend-data.tar.gz /data

# Restore volume
docker run --rm -v mandi-backend-data:/data -v $(pwd):/backup alpine tar xzf /backup/backend-data.tar.gz -C /

# Remove unused volumes
docker volume prune
```

### Bind Mounts (Development)

Development mode uses bind mounts for hot reload:

```yaml
volumes:
  - ./backend/src:/app/src:delegated
  - ./frontend/src:/app/src:delegated
```

---

## Health Checks

### Backend Health Check

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Frontend Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

### Database Health Check

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U mandi_user"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Check Service Health

```bash
# View health status
docker-compose ps

# View detailed health logs
docker inspect --format='{{json .State.Health}}' mandi-backend | jq
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Change port in .env
BACKEND_PORT=5001
```

#### 2. Container Won't Start

```bash
# View logs
docker-compose logs backend

# Check container status
docker-compose ps

# Restart service
docker-compose restart backend
```

#### 3. Database Connection Failed

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Verify DATABASE_URL in .env
# Ensure db service is healthy before backend starts
```

#### 4. Volume Permission Issues

```bash
# Fix permissions (Linux)
sudo chown -R $USER:$USER ./backend/data

# Or run container as root (not recommended for production)
docker-compose exec --user root backend sh
```

#### 5. Build Failures

```bash
# Clean build cache
docker-compose build --no-cache

# Remove old images
docker image prune -a

# Check Dockerfile syntax
docker-compose config
```

### Debug Commands

```bash
# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View real-time logs
docker-compose logs -f --tail=100

# Check environment variables
docker-compose exec backend env

# Test network connectivity
docker-compose exec backend ping db
docker-compose exec frontend ping backend

# Restart all services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

---

## Scaling and Performance

### Horizontal Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Use load balancer (nginx example)
# Add nginx service to docker-compose.yml
```

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Performance Optimization

1. **Multi-stage Builds**: Already implemented in Dockerfiles
2. **Layer Caching**: Order Dockerfile commands by change frequency
3. **Volume Caching**: Use named volumes instead of bind mounts in production
4. **Health Checks**: Ensure proper startup order with health checks
5. **Logging**: Use log rotation to prevent disk space issues

### Monitoring

```bash
# View resource usage
docker stats

# View specific service stats
docker stats mandi-backend mandi-frontend

# Export metrics (Prometheus example)
# Add prometheus and grafana services to docker-compose.yml
```

---

## Production Checklist

- [ ] Update all secrets and passwords in `.env`
- [ ] Configure PostgreSQL instead of SQLite
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS with reverse proxy
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Implement monitoring and alerting
- [ ] Configure firewall rules
- [ ] Test disaster recovery procedures
- [ ] Document deployment procedures
- [ ] Set up CI/CD pipeline

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## Support

For issues and questions:
- Check logs: `docker-compose logs`
- Review this documentation
- Check GitHub issues
- Contact development team

---

**Last Updated**: January 2026
**Version**: 1.0.0
