import io from 'socket.io-client';
import { updateGameState } from '../store/slices/gameSessionSlice';
import { getBalance } from '../store/slices/walletSlice';

let socket;

export const setupSocketConnection = (store) => {
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
  
  socket = io(SOCKET_URL, {
    autoConnect: false
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
    
    // Authenticate socket connection
    const token = localStorage.getItem('token');
    if (token) {
      socket.emit('authenticate', token);
    }
  });
  
  socket.on('authenticated', () => {
    console.log('Socket authenticated');
  });
  
  socket.on('auth_error', (error) => {
    console.error('Socket authentication error:', error);
  });
  
  socket.on('game_state_update', (data) => {
    console.log('Game state update:', data);
    store.dispatch(updateGameState(data));
  });
  
  socket.on('balance_update', () => {
    store.dispatch(getBalance());
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  // Connect the socket
  socket.connect();
  
  return socket;
};

export const getSocketInstance = () => {
  return socket;
};

export const joinGame = (gameId) => {
  if (socket && socket.connected) {
    socket.emit('join_game', gameId);
  }
};

export const leaveGame = (gameId) => {
  if (socket && socket.connected) {
    socket.emit('leave_game', gameId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};