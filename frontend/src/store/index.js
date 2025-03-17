import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gamesReducer from './slices/gamesSlice';
import walletReducer from './slices/walletSlice';
import gameSessionReducer from './slices/gameSessionSlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    wallet: walletReducer,
    gameSession: gameSessionReducer,
    admin: adminReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;