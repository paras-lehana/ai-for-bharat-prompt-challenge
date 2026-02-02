# 📄 Project Details & Reference

**Purpose**: Single source of truth for project environment, URLs, and testing credentials. Reference this before any testing or deployment tasks.

## 🌐 URLs & Ports
| Component | Local URL | Production URL |
|-----------|-----------|----------------|
| **Frontend** | `http://localhost:3001` | `https://lokalmandi.lehana.in` |
| **Backend API** | `http://localhost:5000/api` | `https://api.lokalmandi.lehana.in` |
| **PWA Service** | `http://localhost:3001` | (Same as Frontend) |

## 🔑 Test Accounts
| Purpose | Phone Number | Mock OTP | Role |
|---------|--------------|----------|------|
| **Primary Farmer** | `+919876543210` | `1104` | Farmer (🌾) |
| **Demo Vendor** | `+919999000001` | `123456` | Vendor |
| **Demo Buyer** | `+919999000003` | `123456` | Buyer |

## 🏗️ Architecture Note (Proxy)
- The frontend uses Vite proxy for `/api` requests.
- **IMPORTANT**: Always target `http://localhost:3001/api` from the browser for backend calls to avoid CORS issues.
- Backend is configured to run on port `5000`.

## 🛠️ Common Commands
- **Start All**: `npm run dev` (from root)
- **Start Frontend**: `cd frontend && npm run dev`
- **Start Backend**: `cd backend && npm run dev`
- **Seed Data**: `cd backend && node src/utils/seed.js`

## 🧪 Testing Checklist
- [ ] Login flow works on port 3001
- [ ] Weather widget displays on home/listing details
- [ ] Transactions page loads (Checks for `.map()` safety)
- [ ] Price Info page loads (Checks for `/api/predictions` route)
- [ ] Community forum posts and likes
