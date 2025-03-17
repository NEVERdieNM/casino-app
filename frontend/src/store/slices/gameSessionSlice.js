import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from '../../services/gameService';
import { setLoading, showNotification } from './uiSlice';

export const startGameSession = createAsyncThunk(
  'gameSession/startGameSession',
  async ({ gameId, bet }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await gameService.startGameSession(gameId, bet);
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to start game session.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Session start failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateGameSession = createAsyncThunk(
  'gameSession/updateGameSession',
  async ({ gameId, sessionId, action, params }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await gameService.updateGameSession(gameId, sessionId, action, params);
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Game action failed.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Game action failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getGameSession = createAsyncThunk(
  'gameSession/getGameSession',
  async ({ gameId, sessionId }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await gameService.getGameSession(gameId, sessionId);
      return response;
    } catch (error) {
      console.error('Get game session error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  currentSession: null,
  sessionHistory: [],
  gameState: null,
  isLoading: false,
  error: null
};

const gameSessionSlice = createSlice({
  name: 'gameSession',
  initialState,
  reducers: {
    clearGameSessionError: (state) => {
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.gameState = null;
    },
    updateGameState: (state, action) => {
      state.gameState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGameSession.fulfilled, (state, action) => {
        state.currentSession = action.payload.session;
        state.gameState = action.payload.gameState;
      })
      .addCase(startGameSession.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to start game session';
      })
      .addCase(updateGameSession.fulfilled, (state, action) => {
        state.gameState = action.payload.gameState;
        if (action.payload.session) {
          state.currentSession = action.payload.session;
        }
      })
      .addCase(updateGameSession.rejected, (state, action) => {
        state.error = action.payload?.message || 'Game action failed';
      })
      .addCase(getGameSession.fulfilled, (state, action) => {
        state.currentSession = action.payload.session;
        state.gameState = action.payload.gameState;
      })
      .addCase(getGameSession.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { 
  clearGameSessionError, 
  clearCurrentSession,
  updateGameState
} = gameSessionSlice.actions;

export default gameSessionSlice.reducer;