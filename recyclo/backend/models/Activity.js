const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['plastic', 'paper', 'glass', 'ewaste', 'organic', 'metal'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    pointsEarned: { type: Number, required: true },
    streakBonus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
