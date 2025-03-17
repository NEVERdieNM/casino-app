const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config');
const { ValidationError, UnauthorizedError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, birthDate } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      throw new ValidationError('Username, email and password are required');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      throw new ValidationError('User with this email or username already exists');
    }
    
    // Create user
    const user = await User.register({
      username,
      email,
      password,
      firstName,
      lastName,
      birthDate
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }
    
    // Find user
    const user = await User.findOne({
      $or: [{ email: username }, { username }]
    });
    
    if (!user || !(await user.isValidPassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    if (user.status !== 'active') {
      throw new UnauthorizedError(`Your account is ${user.status}`);
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.wallet.balance,
          currency: user.wallet.currency
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user (for token blacklisting if implemented)
exports.logout = async (req, res, next) => {
  // Note: With JWT, typically the client just discards the token
  // For a more secure implementation, a token blacklist could be added
  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out'
  });
};

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

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required');
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Verify current password
    if (!(await user.isValidPassword(currentPassword))) {
      throw new UnauthorizedError('Current password is incorrect');
    }
    
    // Hash new password
    const bcrypt = require('bcrypt');
    const { bcrypt: bcryptConfig } = require('../config');
    const passwordHash = await bcrypt.hash(newPassword, bcryptConfig.saltRounds);
    
    // Update password
    user.passwordHash = passwordHash;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};