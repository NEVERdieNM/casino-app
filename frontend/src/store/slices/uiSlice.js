import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: false,
  sidebarOpen: false,
  theme: localStorage.getItem('theme') || 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    showNotification: (state, action) => {
      const { type, message } = action.payload;
      toast[type](message);
    }
  }
});

export const { 
  setLoading, 
  toggleSidebar, 
  setSidebarOpen, 
  setTheme,
  showNotification
} = uiSlice.actions;

export default uiSlice.reducer;