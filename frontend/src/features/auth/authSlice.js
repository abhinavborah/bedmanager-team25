import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Initial state
const initialState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ username, password });
      
      // Save token to localStorage for persistence
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response; // { token, user }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      
      // Clear token from localStorage
      localStorage.removeItem('authToken');
    },
    
    // Restore auth from localStorage (useful for app initialization)
    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
    },
    
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout, restoreAuth, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;

// Export reducer
export default authSlice.reducer;
