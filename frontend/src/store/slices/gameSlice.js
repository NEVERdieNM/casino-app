import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from '../../services/gameService';
import { setLoading } from './uiSlice';

export const getAllGames = createAsyncThunk(
  'games/getAllGames',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await gameService.getAllGames();
      return response;
    } catch (error) {
      console.error('Get all games error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getGameById = createAsyncThunk(
  'games/getGameById',
  async (id, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await gameService.getGameById(id);
      return response;
    } catch (error) {
      console.error('Get game by id error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  games: [],
  currentGame: null,
  isLoading: false,
  error: null
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearGamesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGames.fulfilled, (state, action) => {
        state.games = action.payload.games;
      })
      .addCase(getAllGames.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getGameById.fulfilled, (state, action) => {
        state.currentGame = action.payload.game;
      })
      .addCase(getGameById.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { clearGamesError } = gamesSlice.actions;

export default gamesSlice.reducer;