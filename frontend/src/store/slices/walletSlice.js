import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../../services/walletService';
import { setLoading, showNotification } from './uiSlice';

export const getBalance = createAsyncThunk(
  'wallet/getBalance',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await walletService.getBalance();
      return response;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await walletService.getTransactions(params);
      return response;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deposit = createAsyncThunk(
  'wallet/deposit',
  async (amount, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await walletService.deposit(amount);
      dispatch(showNotification({ 
        type: 'success', 
        message: `Successfully deposited $${amount}!` 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Deposit failed. Please try again.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Deposit failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async (amount, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await walletService.withdraw(amount);
      dispatch(showNotification({ 
        type: 'success', 
        message: `Successfully withdrew $${amount}!` 
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.response?.data?.message || 'Withdrawal failed. Please try again.'
      }));
      return rejectWithValue(error.response?.data || { message: 'Withdrawal failed' });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  balance: 0,
  currency: 'USD',
  transactions: [],
  pagination: {
    total: 0,
    page: 1,
    pages: 1
  },
  isLoading: false,
  error: null
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.currency = action.payload.currency;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      })
      .addCase(deposit.rejected, (state, action) => {
        state.error = action.payload?.message || 'Deposit failed';
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.error = action.payload?.message || 'Withdrawal failed';
      });
  }
});

export const { clearWalletError } = walletSlice.actions;

export default walletSlice.reducer;