const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { bcrypt: bcryptConfig } = require('../config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Static method to register a new user
userSchema.statics.register = async function(userData) {
  const { password, ...otherData } = userData;
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, bcryptConfig.saltRounds);
  
  // Create user with hashed password
  const user = new this({
    ...otherData,
    passwordHash
  });
  
  return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;