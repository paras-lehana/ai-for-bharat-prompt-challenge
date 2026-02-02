# 🚀 Quick Start Guide - Lokal Mandi

This guide provides the essential commands to boot up the application, manage the development environment, and deploy using Docker.

## 🛠️ Bootup Commands

### Option 1: Standard Development Mode (Local)
Use this for active development with hot-reloading enabled for both frontend and backend.

```bash
# 1. Install all dependencies (if not already done)
npm run install-all

# 2. Start both Frontend and Backend concurrently
npm run dev
```
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Backend**: [http://localhost:5000](http://localhost:5000)

### Option 2: Docker Development (Recommended)
Use this to run the app in a containerized environment similar to production but with dev overrides.

```bash
# Start with development overrides (Hot reload enabled)
npm run docker:up:dev
```

### Option 3: Production Deployment
Use this for the final deployment on a server.

```bash
# Build and start production containers in detached mode
npm run docker:up:prod
```

---

## 🔧 Useful Management Commands

| Command | Description |
|---------|-------------|
| `npm run docker:down` | Stop and remove all containers |
| `npm run docker:restart` | Restart all running containers |
| `npm run docker:logs` | View real-time logs from all services |
| `npm run docker:clean` | Deep clean: removes volumes and unused images |
| `npm run docker:ps` | List running containers and their status |

---

## 🧪 Testing & Utilities

| Command | Description |
|---------|-------------|
| `npm run test:integration` | Run full integration tests |
| `node test/test-all-apis.js` | Test all backend API endpoints |
| `npm run build` | Generate production builds for both services |

---

## 📝 Configuration Checklist
- Ensure `.env` is present in the root directory.
- Verify `VITE_API_URL` in `frontend/.env` points to your backend (default is `/api`).
- Check `backend.log` for any startup errors.

---

**Current Version**: 4.7  
**Last Updated**: 2026-02-02
