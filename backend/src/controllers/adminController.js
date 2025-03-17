const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');
const GameSession = require('../models/GameSession');
const { NotFoundError, ValidationError } = require('../utils/errors');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, status, search } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['active', 'suspended', 'banned'].includes(status)) {
      throw new ValidationError('Invalid status. Must be active, suspended, or banned');
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
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

// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, type, date, search } = req.query;
    
    // Build query
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (date) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      
      if (date === 'today') {
        query.createdAt = { $gte: startOfDay };
      } else if (date === 'yesterday') {
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        query.createdAt = { 
          $gte: yesterday,
          $lt: startOfDay
        };
      } else if (date === 'week') {
        const weekAgo = new Date(startOfDay);
        weekAgo.setDate(weekAgo.getDate() - 7);
        query.createdAt = { $gte: weekAgo };
      } else if (date === 'month') {
        const monthAgo = new Date(startOfDay);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query.createdAt = { $gte: monthAgo };
      }
    }
    
    if (search) {
      // Find users matching search
      const users = await User.find({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      // Search by user or transaction ID
      query.$or = [
        { userId: { $in: userIds } },
        { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : null }
      ];
    }
    
    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .populate('gameId', 'name type');
    
    const total = await Transaction.countDocuments(query);
    
    // Modify the response for the frontend
    const modifiedTransactions = transactions.map(transaction => {
      const { userId, ...rest } = transaction.toObject();
      return {
        ...rest,
        userId: userId._id,
        username: userId.username,
        email: userId.email,
        gameName: transaction.gameId ? transaction.gameId.name : null
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        transactions: modifiedTransactions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all games (admin version)
exports.getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: {
        games
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create game
exports.createGame = async (req, res, next) => {
  try {
    const {
      name,
      type,
      description,
      rules,
      minBet,
      maxBet,
      houseEdge,
      isActive,
      image
    } = req.body;
    
    // Validate game type
    if (!['slots', 'blackjack', 'roulette', 'poker', 'baccarat'].includes(type)) {
      throw new ValidationError('Invalid game type');
    }
    
    // Check if game with same name exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      throw new ValidationError('Game with this name already exists');
    }
    
    // Create game
    const game = await Game.create({
      name,
      type,
      description,
      rules,
      minBet,
      maxBet,
      houseEdge,
      isActive,
      image
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        game
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update game
exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      description,
      rules,
      minBet,
      maxBet,
      houseEdge,
      isActive,
      image
    } = req.body;
    
    // Validate game type if provided
    if (type && !['slots', 'blackjack', 'roulette', 'poker', 'baccarat'].includes(type)) {
      throw new ValidationError('Invalid game type');
    }
    
    // Check if updating to a name that already exists
    if (name) {
      const existingGame = await Game.findOne({ name, _id: { $ne: id } });
      if (existingGame) {
        throw new ValidationError('Game with this name already exists');
      }
    }
    
    // Update game
    const game = await Game.findByIdAndUpdate(
      id,
      {
        name,
        type,
        description,
        rules,
        minBet,
        maxBet,
        houseEdge,
        isActive,
        image
      },
      { new: true, runValidators: true }
    );
    
    if (!game) {
      throw new NotFoundError('Game not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        game
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get statistics
exports.getStats = async (req, res, next) => {
  try {
    // User stats
    const userCount = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    // Revenue stats
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'bet' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const totalPayouts = await Transaction.aggregate([
      { $match: { type: 'win' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const netRevenue = totalRevenue - totalPayouts;
    
    // Calculate house edge percentage
    const houseEdgePercentage = totalRevenue > 0 
      ? ((totalRevenue - totalPayouts) / totalRevenue * 100).toFixed(2)
      : 0;
    
    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    
    const revenueToday = await Transaction.aggregate([
      { $match: { type: 'bet', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const payoutsToday = await Transaction.aggregate([
      { $match: { type: 'win', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const revenueYesterday = await Transaction.aggregate([
      { 
        $match: { 
          type: 'bet', 
          createdAt: { $gte: yesterdayDate, $lt: today } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const payoutsYesterday = await Transaction.aggregate([
      { 
        $match: { 
          type: 'win', 
          createdAt: { $gte: yesterdayDate, $lt: today } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result.length > 0 ? result[0].total : 0);
    
    const netRevenueToday = revenueToday - payoutsToday;
    const netRevenueYesterday = revenueYesterday - payoutsYesterday;
    const revenueTodayvsYesterday = netRevenueToday - netRevenueYesterday;
    
    // Game stats
    const totalGamesPlayed = await GameSession.countDocuments();
    const gamesPlayedToday = await GameSession.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Revenue by month for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await Transaction.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          bet: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'bet'] }, '$total', 0]
            }
          },
          win: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'win'] }, '$total', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: { $subtract: ['$bet', '$win'] }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);
    
    // Format month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedRevenueByMonth = revenueByMonth.map(item => ({
      month: `${monthNames[item.month - 1]} ${item.year}`,
      revenue: item.revenue
    }));
    
    // User activity by day for the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const userActivityByDay = await User.aggregate([
      { 
        $match: { 
          lastLogin: { $gte: oneWeekAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$lastLogin' },
            month: { $month: '$lastLogin' },
            day: { $dayOfMonth: '$lastLogin' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    // Format days
    const formattedUserActivityByDay = userActivityByDay.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count: item.count
      };
    });
    
    // Game popularity
    const gamePopularity = await GameSession.aggregate([
      {
        $group: {
          _id: '$gameId',
          playCount: { $sum: 1 }
        }
      },
      {
        $sort: { playCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'game'
        }
      },
      {
        $unwind: '$game'
      },
      {
        $project: {
          _id: 0,
          name: '$game.name',
          playCount: 1
        }
      }
    ]);
    
    // Recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username')
      .lean();
    
    const formattedTransactions = recentTransactions.map(t => ({
      username: t.userId.username,
      type: t.type,
      amount: t.amount,
      date: new Date(t.createdAt).toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        userCount,
        newUsersToday,
        totalRevenue,
        netRevenue,
        houseEdgePercentage,
        revenueTodayvsYesterday,
        totalGamesPlayed,
        gamesPlayedToday,
        revenueByMonth: formattedRevenueByMonth,
        userActivityByDay: formattedUserActivityByDay,
        gamePopularity,
        recentTransactions: formattedTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};