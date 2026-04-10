# ♻️ Recyclo — Recycling Reward System

A full-stack gamified recycling tracker where users earn points, unlock badges, maintain streaks, and redeem rewards for recycling waste.

🌐 **Live Demo**: [recyclo-rust.vercel.app](https://recyclo-rust.vercel.app)

---

## Features

- 🔐 JWT Authentication (register/login)
- ♻️ Log 6 waste types: plastic, paper, glass, e-waste, organic, metal
- 🏆 Points system with 10% streak bonus at 7+ day streaks
- 🥇 Badge system: Bronze → Silver → Gold → Platinum
- 📊 Dashboard with charts and activity history
- 🌍 Global leaderboard (top 10)
- 🎁 Rewards redemption system

---

## Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 + Vite | Node.js + Express | MongoDB Atlas |
| Tailwind CSS | JWT Auth | Mongoose |
| Recharts | REST API | |

---

## Local Setup

### Backend
```bash
cd recyclo/backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET
node server.js
```

### Frontend
```bash
cd recyclo/frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/activity/log | Log recycling activity |
| GET | /api/activity/history | Activity history |
| GET | /api/activity/stats | Stats by waste type |
| GET | /api/leaderboard | Top 10 users |
| GET | /api/rewards | List rewards |
| POST | /api/rewards/redeem | Redeem a reward |

---

## Deployed On

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

Made with 💚 by Palak
