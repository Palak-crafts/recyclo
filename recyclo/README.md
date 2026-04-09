# Recyclo — Recycling Reward System

A full-stack gamified recycling tracker. Users log recycling activities, earn points, unlock badges, maintain streaks, and redeem rewards.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (free tier)
- **Auth**: JWT (7-day expiry)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/recyclo.git
cd recyclo
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
node server.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Backend at `http://localhost:5000`.

---

## Environment Variables

### backend/.env
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/recyclo
JWT_SECRET=any_long_random_string
PORT=5000
```

Get a free MongoDB URI at https://mongodb.com/atlas

---

## Deployment

### Backend → Render.com (free)
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env`

### Frontend → Vercel (free)
1. Go to https://vercel.com → New Project
2. Connect your GitHub repo
3. Root directory: `frontend`
4. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. In `vite.config.js`, update the proxy target to your Render URL for production

---

## Features

- JWT authentication (register/login)
- Log 6 waste types: plastic, paper, glass, e-waste, organic, metal
- Points per item with 10% streak bonus at 7+ day streaks
- Badge system: Bronze (100) → Silver (500) → Gold (1000) → Platinum (2000)
- Global leaderboard (top 10)
- Rewards redemption system
- Dashboard with bar chart and activity history

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/activity/log | Log recycling activity |
| GET | /api/activity/history | Get activity history |
| GET | /api/activity/stats | Get stats by type |
| GET | /api/leaderboard | Top 10 users |
| GET | /api/rewards | List rewards + user points |
| POST | /api/rewards/redeem | Redeem a reward |
