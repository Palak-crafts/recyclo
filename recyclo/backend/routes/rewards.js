const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const REWARDS = [
  { id: 'r1', name: '10% off at EcoMart', cost: 200, category: 'discount' },
  { id: 'r2', name: 'Plant a tree in your name', cost: 500, category: 'impact' },
  { id: 'r3', name: 'Free reusable bag', cost: 300, category: 'product' },
  { id: 'r4', name: 'Rs 100 grocery voucher', cost: 800, category: 'voucher' },
  { id: 'r5', name: 'Solar lamp donation', cost: 1000, category: 'impact' },
  { id: 'r6', name: 'Rs 500 fuel voucher', cost: 1500, category: 'voucher' },
];

// GET /api/rewards
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points redeemedPoints');
    res.json({ rewards: REWARDS, userPoints: user.points, redeemedPoints: user.redeemedPoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rewards/redeem
router.post('/redeem', auth, async (req, res) => {
  try {
    const { rewardId } = req.body;
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    const user = await User.findById(req.user.id);
    const available = user.points - user.redeemedPoints;

    if (available < reward.cost)
      return res.status(400).json({ error: 'Not enough points' });

    user.redeemedPoints += reward.cost;
    await user.save();

    res.json({
      message: `Successfully redeemed: ${reward.name}`,
      pointsSpent: reward.cost,
      remainingPoints: user.points - user.redeemedPoints,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
