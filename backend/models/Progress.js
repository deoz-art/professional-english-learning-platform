const mongoose = require('mongoose');

const levelProgressSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked', 'completed'],
    default: 'locked',
  },
  highScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    levelProgress: [levelProgressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Progress', progressSchema);