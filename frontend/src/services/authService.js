import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  }
};

export default authService;