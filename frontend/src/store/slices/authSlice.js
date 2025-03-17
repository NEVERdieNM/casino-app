import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { setLoading, showNotification } from './uiSlice';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Registration successful! Welcome to our casino.' 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(credentials);
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Login successful! Welcome back.' 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Logout successful. Come back soon!' 
      }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      console.error('Check auth error:', error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.updateProfile(profileData);
      dispatch(showNotification({ 
        type: 'success', 
        message: 'Profile updated successfully!' 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token');
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload.user };
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;