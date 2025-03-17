const User = require('../models/User');
const Transaction = require('../models/Transaction');
const GameSession = require('../models/GameSession');
const { NotFoundError, ValidationError } = require('../utils/errors');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    // Validate email if provided
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError('Email already in use');
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity
exports.getActivity = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const userId = req.user.id;
    
    // Get recent game sessions
    const sessions = await GameSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('gameId', 'name type');
    
    // Get wins and losses
    const winAmount = await Transaction.aggregate([
      { $match: { userId: userId, type: 'win' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const betAmount = await Transaction.aggregate([
      { $match: { userId: userId, type: 'bet' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Calculate stats
    const stats = {
      totalWins: winAmount.length > 0 ? winAmount[0].total : 0,
      totalBets: betAmount.length > 0 ? betAmount[0].total : 0,
      netProfit: (winAmount.length > 0 ? winAmount[0].total : 0) - (betAmount.length > 0 ? betAmount[0].total : 0),
      gamesPlayed: await GameSession.countDocuments({ userId })
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        sessions,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};