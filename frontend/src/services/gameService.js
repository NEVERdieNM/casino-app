import api from './api';

const gameService = {
  getAllGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },
  
  getGameById: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },
  
  startGameSession: async (gameId, bet) => {
    const response = await api.post(`/games/${gameId}/session`, { bet });
    return response.data;
  },
  
  updateGameSession: async (gameId, sessionId, action, params = {}) => {
    const response = await api.put(`/games/${gameId}/session/${sessionId}`, {
      action,
      ...params
    });
    return response.data;
  },
  
  getGameSession: async (gameId, sessionId) => {
    const response = await api.get(`/games/${gameId}/session/${sessionId}`);
    return response.data;
  }
};

export default gameService;