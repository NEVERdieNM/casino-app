const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['slots', 'blackjack', 'roulette', 'poker', 'baccarat'],
    required: true
  },
  description: {
    type: String
  },
  rules: {
    type: String
  },
  minBet: {
    type: Number,
    required: true
  },
  maxBet: {
    type: Number,
    required: true
  },
  houseEdge: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;