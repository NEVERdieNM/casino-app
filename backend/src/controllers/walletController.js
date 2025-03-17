const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');

// Get user balance
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        balance: user.wallet.balance,
        currency: user.wallet.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

// Deposit funds
exports.deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      throw new ValidationError('Valid amount is required');
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // In a real app, integrate with payment processor here
    
    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'deposit',
      amount,
      currency: user.wallet.currency,
      status: 'completed',
      completedAt: new Date()
    });
    
    // Update user balance
    user.wallet.balance += amount;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        transaction,
        balance: user.wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw funds
exports.withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      throw new ValidationError('Valid amount is required');
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.wallet.balance < amount) {
      throw new ValidationError('Insufficient funds');
    }
    
    // In a real app, integrate with payment processor here
    
    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'withdrawal',
      amount,
      currency: user.wallet.currency,
      status: 'completed',
      completedAt: new Date()
    });
    
    // Update user balance
    user.wallet.balance -= amount;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        transaction,
        balance: user.wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, limit = 10, page = 1 } = req.query;
    
    const query = { userId: req.user.id };
    
    if (type) {
      query.type = type;
    }
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const transactions = await Transaction.find(query, null, options);
    const total = await Transaction.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};