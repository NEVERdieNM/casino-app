const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');
const { UnauthorizedError } = require('../utils/errors');

exports.auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }
    
    next();
  };
};