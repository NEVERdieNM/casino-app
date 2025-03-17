import api from './api';

const adminService = {
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  
  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },
  
  getAllTransactions: async (params) => {
    const response = await api.get('/admin/transactions', { params });
    return response.data;
  },
  
  getAllGames: async () => {
    const response = await api.get('/admin/games');
    return response.data;
  },
  
  createGame: async (gameData) => {
    const response = await api.post('/admin/games', gameData);
    return response.data;
  },
  
  updateGame: async (gameId, gameData) => {
    const response = await api.put(`/admin/games/${gameId}`, gameData);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default adminService;