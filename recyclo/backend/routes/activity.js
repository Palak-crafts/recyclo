const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

const POINTS_MAP = {
  plastic: 10,
  paper: 6,
  glass: 15,
  ewaste: 20,
  organic: 5,
  metal: 12,
};

const BADGES = [
  { name: 'Bronze', threshold: 100 },
  { name: 'Silver', threshold: 500 },
  { name: 'Gold', threshold: 1000 },
  { name: 'Platinum', threshold: 2000 },
];

// POST /api/activity/log
router.post('/log', auth, async (req, res) => {
  try {
    const { type, quantity } = req.body;
    if (!type || !quantity) return res.status(400).json({ error: 'type and quantity required' });
    if (!POINTS_MAP[type]) return res.status(400).json({ error: 'Invalid waste type' });

    const user = await User.findById(req.user.id);

    // Streak logic
    const now = new Date();
    const last = user.lastActivity;
    let streakBonus = false;

    if (last) {
      const diffMs = now - new Date(last);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
      // same day = streak stays the same
    } else {
      user.streak = 1;
    }

    user.lastActivity = now;

    // Points calculation
    const base = POINTS_MAP[type] * quantity;
    if (user.streak >= 7) streakBonus = true;
    const pointsEarned = Math.round(base * (streakBonus ? 1.1 : 1));
    user.points += pointsEarned;

    // Badge unlocks
    const newBadges = [];
    for (const badge of BADGES) {
      if (user.points >= badge.threshold && !user.badges.includes(badge.name)) {
        user.badges.push(badge.name);
        newBadges.push(badge.name);
      }
    }

    await user.save();

    const activity = await Activity.create({
      user: user._id,
      type,
      quantity,
      pointsEarned,
      streakBonus,
    });

    res.json({
      activity,
      totalPoints: user.points,
      badges: user.badges,
      newBadges,
      streak: user.streak,
      streakBonus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activity/history
router.get('/history', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activity/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id });
    const totalItems = activities.reduce((sum, a) => sum + a.quantity, 0);
    const byType = {};
    for (const a of activities) {
      byType[a.type] = (byType[a.type] || 0) + a.quantity;
    }
    res.json({ totalItems, byType, totalActivities: activities.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
