# Lokal Mandi - Server Deployment Guide

## Prerequisites on Server

1. **Docker & Docker Compose** installed
2. **Git** installed
3. **Port 3000 and 5000** available

## Initial Deployment

### Step 1: Clone Repository on Server

```bash
git clone <your-repo-url>
cd ai-for-bharat-prompt-challenge
```

### Step 2: Create Environment Files

Create `.env` file in root:
```bash
# API Keys
SARVAM_API_KEY=your_sarvam_key
OPENROUTER_API_KEY=your_openrouter_key

# Database
DATABASE_URL=sqlite:./backend/mandi.db

# Server Config
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://your-server-ip:3000
```

Create `backend/.env` file:
```bash
# Copy same content as root .env
SARVAM_API_KEY=your_sarvam_key
OPENROUTER_API_KEY=your_openrouter_key
DATABASE_URL=sqlite:./mandi.db
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://your-server-ip:3000

# AI Model Config
OPENROUTER_MODEL=google/gemini-flash-1.5
```

### Step 3: Build and Start Docker Containers

```bash
# Build and start containers
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Access Application

- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:5000
- **Health Check**: http://your-server-ip:5000/health

---

## Updating Deployment (Pull Changes)

When you make changes locally and push to Git, update the server:

### Option 1: Quick Update (No Code Changes)

If you only changed environment variables:

```bash
# On server
docker-compose restart
```

### Option 2: Pull Latest Code

If you pushed code changes:

```bash
# On server
cd ai-for-bharat-prompt-challenge

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build

# Or use this one-liner
docker-compose up -d --build --force-recreate
```

### Option 3: Update Specific Service

If you only changed frontend or backend:

```bash
# Update only frontend
docker-compose up -d --build --force-recreate frontend

# Update only backend
docker-compose up -d --build --force-recreate backend
```

---

## Useful Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 50 lines
docker-compose logs --tail=50 backend
```

### Stop/Start Services
```bash
# Stop all
docker-compose stop

# Start all
docker-compose start

# Restart all
docker-compose restart

# Stop and remove containers
docker-compose down
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

### Clean Up
```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes (WARNING: deletes database)
docker-compose down -v

# Remove unused images
docker image prune -a
```

---

## Database Management

### Backup Database
```bash
# Copy database from container
docker cp ai-for-bharat-prompt-challenge-backend-1:/app/mandi.db ./backup-$(date +%Y%m%d).db
```

### Restore Database
```bash
# Copy database to container
docker cp ./backup.db ai-for-bharat-prompt-challenge-backend-1:/app/mandi.db

# Restart backend
docker-compose restart backend
```

### View Database
```bash
# Access backend container
docker exec -it ai-for-bharat-prompt-challenge-backend-1 sh

# Inside container, use sqlite3
sqlite3 mandi.db
.tables
SELECT * FROM listings;
.exit
```

---

## Troubleshooting

### Containers Won't Start
```bash
# Check logs
docker-compose logs

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Kill process
kill -9 <PID>
```

### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

### Frontend Not Loading
```bash
# Check if container is running
docker-compose ps

# Rebuild frontend
docker-compose up -d --build --force-recreate frontend

# Check logs
docker-compose logs -f frontend
```

### Backend API Errors
```bash
# Check environment variables
docker exec ai-for-bharat-prompt-challenge-backend-1 env | grep API_KEY

# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs -f backend
```

---

## Production Optimizations

### 1. Use Nginx Reverse Proxy

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable HTTPS with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

### 3. Auto-restart on Server Reboot

```bash
# Add to docker-compose.yml under each service:
restart: unless-stopped
```

### 4. Set Up Monitoring

```bash
# Install monitoring tools
docker run -d --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower
```

---

## Workflow Summary

### Local Development → Server Deployment

1. **Make changes locally**
2. **Test locally**: `docker-compose up`
3. **Commit changes**: `git add . && git commit -m "message"`
4. **Push to Git**: `git push origin main`
5. **SSH to server**: `ssh user@your-server`
6. **Pull changes**: `cd ai-for-bharat-prompt-challenge && git pull`
7. **Rebuild**: `docker-compose up -d --build --force-recreate`
8. **Verify**: Check http://your-server-ip:3000

---

## Quick Reference

```bash
# Deploy first time
git clone <repo> && cd <repo>
# Create .env files
docker-compose up -d --build

# Update after git push
git pull && docker-compose up -d --build --force-recreate

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Backup database
docker cp ai-for-bharat-prompt-challenge-backend-1:/app/mandi.db ./backup.db
```

---

## Security Checklist

- [ ] Change default API keys
- [ ] Set strong passwords
- [ ] Enable firewall (ufw)
- [ ] Use HTTPS in production
- [ ] Restrict CORS_ORIGIN to your domain
- [ ] Regular database backups
- [ ] Keep Docker updated
- [ ] Monitor logs for suspicious activity

---

## Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure ports 3000 and 5000 are open
4. Check Docker is running: `docker ps`
5. Restart containers: `docker-compose restart`
