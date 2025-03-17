const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  startBalance: {
    type: Number,
    required: true
  },
  endBalance: {
    type: Number
  },
  bets: [{
    amount: Number,
    outcome: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession;