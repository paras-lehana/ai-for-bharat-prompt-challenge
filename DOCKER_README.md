# Docker Deployment - Quick Reference

## Quick Start

### Option 1: Using the Start Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x docker-start.sh

# Run the script
./docker-start.sh
```

The script will guide you through:
1. Checking prerequisites
2. Setting up environment variables
3. Choosing deployment mode
4. Building and starting services

### Option 2: Manual Commands

#### Development Mode
```bash
# Copy environment file
cp .env.docker .env

# Edit .env with your configuration
nano .env

# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

#### Production Mode
```bash
# Copy environment file
cp .env.docker .env

# Edit .env with production values
nano .env

# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Service URLs

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **PostgreSQL** (if enabled): localhost:5432

## Common Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Operations
```bash
# Seed database with test data
docker-compose exec backend npm run seed

# Backup SQLite database
docker-compose exec backend cp /app/data/mandi.db /app/data/backup.db

# Access PostgreSQL shell
docker-compose exec db psql -U mandi_user -d mandi

# Backup PostgreSQL
docker-compose exec db pg_dump -U mandi_user mandi > backup.sql
```

### Development Operations
```bash
# Access backend shell
docker-compose exec backend sh

# Run tests
docker-compose exec backend npm test

# Install new package
docker-compose exec backend npm install package-name

# Rebuild after code changes
docker-compose up -d --build
```

### Cleanup
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Clean up Docker system
docker system prune -f

# Remove all unused images
docker image prune -a
```

## Configuration Files

- **docker-compose.yml**: Base configuration for all environments
- **docker-compose.dev.yml**: Development-specific overrides
- **docker-compose.prod.yml**: Production-specific overrides
- **.env**: Environment variables (create from .env.docker)
- **.env.docker**: Environment template with all options

## Architecture

```
┌─────────────────────────────────────────────┐
│           Docker Network (Bridge)           │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Frontend   │  │   Backend    │        │
│  │   (Nginx)    │  │  (Node.js)   │        │
│  │   Port: 80   │  │  Port: 5000  │        │
│  └──────────────┘  └──────────────┘        │
│         │                  │                │
│         │                  │                │
│         │          ┌───────┴────────┐       │
│         │          │   PostgreSQL   │       │
│         │          │   Port: 5432   │       │
│         │          └────────────────┘       │
│         │                                   │
└─────────┼───────────────────────────────────┘
          │
    Host Machine
```

## Volumes

Persistent data is stored in named volumes:

- **backend-data**: Database files, application data
- **backend-logs**: Application logs
- **backend-uploads**: User uploaded files
- **postgres-data**: PostgreSQL database files

## Environment Variables

### Required Variables
```env
JWT_SECRET=your-secret-key-here
SARVAM_API_KEY=your-sarvam-key
OPENROUTER_API_KEY=your-openrouter-key
```

### Database Configuration
```env
# For SQLite (Development)
DATABASE_URL=sqlite:/app/data/mandi.db

# For PostgreSQL (Production)
DATABASE_URL=postgresql://mandi_user:password@db:5432/mandi
POSTGRES_PASSWORD=secure-password
```

### Optional Variables
```env
NODE_ENV=production
BACKEND_PORT=5000
FRONTEND_PORT=80
LOG_LEVEL=info
```

See `.env.docker` for complete list.

## Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
BACKEND_PORT=5001
FRONTEND_PORT=8080
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache

# Check configuration
docker-compose config
```

### Database Connection Issues
```bash
# Check database is running
docker-compose ps db

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Permission Issues
```bash
# Fix volume permissions (Linux)
sudo chown -R $USER:$USER ./backend/data

# Or run as root (not recommended)
docker-compose exec --user root backend sh
```

## Production Checklist

Before deploying to production:

- [ ] Update JWT_SECRET with strong random string
- [ ] Configure all API keys in .env
- [ ] Set strong database password
- [ ] Configure CORS_ORIGIN with your domain
- [ ] Enable PostgreSQL (comment out SQLite)
- [ ] Set NODE_ENV=production
- [ ] Configure SSL/TLS with reverse proxy
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Test disaster recovery procedures

## Performance Tips

1. **Use PostgreSQL**: Better for production workloads
2. **Resource Limits**: Set in docker-compose.prod.yml
3. **Log Rotation**: Configured in production mode
4. **Health Checks**: Monitor service health
5. **Caching**: Use Redis for session/cache (future enhancement)

## Security Best Practices

1. **Secrets Management**: Never commit .env to git
2. **Non-root User**: Containers run as non-root user
3. **Network Isolation**: Services communicate via internal network
4. **Regular Updates**: Keep base images updated
5. **SSL/TLS**: Use reverse proxy for HTTPS

## Support

For detailed documentation, see:
- **DOCKER_DEPLOYMENT.md**: Comprehensive deployment guide
- **README.md**: Project overview and features
- **docs/**: Additional documentation

For issues:
- Check logs: `docker-compose logs`
- Review troubleshooting section above
- Check GitHub issues

---

**Quick Commands Reference**

```bash
# Start
./docker-start.sh                    # Interactive start
npm run docker:up:dev                # Development
npm run docker:up:prod               # Production

# Monitor
docker-compose logs -f               # View logs
docker-compose ps                    # Service status
docker stats                         # Resource usage

# Stop
docker-compose down                  # Stop services
docker-compose down -v               # Stop and remove data
```

---

**Version**: 1.0.0  
**Last Updated**: January 2026
