const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');
const User = require('../models/User');
const logger = require('../utils/logger');

module.exports = (socket) => {
  logger.info(`New socket connection: ${socket.id}`);
  
  // Auth handling
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findById(decoded.id);
      
      if (!user || user.status !== 'active') {
        return socket.emit('auth_error', { message: 'Authentication failed' });
      }
      
      socket.user = {
        id: user._id,
        username: user.username
      };
      
      socket.join(`user:${user._id}`);
      socket.emit('authenticated', { message: 'Authentication successful' });
      
      logger.info(`Socket authenticated: ${socket.id}, User: ${user.username}`);
    } catch (error) {
      logger.error(`Socket authentication error: ${error.message}`);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });
  
  // Game-related events
  socket.on('join_game', (gameId) => {
    if (!socket.user) {
      return socket.emit('error', { message: 'Authentication required' });
    }
    
    socket.join(`game:${gameId}`);
    logger.info(`User ${socket.user.username} joined game ${gameId}`);
  });
  
  socket.on('leave_game', (gameId) => {
    socket.leave(`game:${gameId}`);
    logger.info(`User ${socket.user?.username || 'Anonymous'} left game ${gameId}`);
  });
  
  // Cleanup on disconnect
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
};