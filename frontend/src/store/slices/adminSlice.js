import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';
import { setLoading, showNotification } from './uiSlice';

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.getAllUsers(params);
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.updateUserStatus(userId, status);
      dispatch(showNotification({ 
        type: 'success', 
        message: `User status updated to ${status}` 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update user status'
      }));
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getAllTransactions = createAsyncThunk(
  'admin/getAllTransactions',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.getAllTransactions(params);
      return response;
    } catch (error) {
      console.error('Get all transactions error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getAllAdminGames = createAsyncThunk(
  'admin/getAllGames',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.getAllGames();
      return response;
    } catch (error) {
      console.error('Get all games error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createGame = createAsyncThunk(
  'admin/createGame',
  async (gameData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.createGame(gameData);
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Game created successfully' 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create game'
      }));
      return rejectWithValue(error.response?.data || { message: 'Creation failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateGame = createAsyncThunk(
  'admin/updateGame',
  async ({ gameId, gameData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.updateGame(gameId, gameData);
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Game updated successfully' 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update game'
      }));
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getStats = createAsyncThunk(
  'admin/getStats',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await adminService.getStats();
      return response;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  users: [],
  usersPagination: {
    total: 0,
    page: 1,
    pages: 1
  },
  transactions: [],
  transactionsPagination: {
    total: 0,
    page: 1,
    pages: 1
  },
  games: [],
  stats: null,
  isLoading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
        state.transactionsPagination = action.payload.pagination;
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllAdminGames.fulfilled, (state, action) => {
        state.games = action.payload.games;
      })
      .addCase(getAllAdminGames.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.games.push(action.payload.game);
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        const index = state.games.findIndex(game => game._id === action.payload.game._id);
        if (index !== -1) {
          state.games[index] = action.payload.game;
        }
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;