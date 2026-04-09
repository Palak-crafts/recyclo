const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name points badges streak')
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
