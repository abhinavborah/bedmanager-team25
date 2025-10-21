import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bedsReducer from '../features/beds/bedsSlice';

// Configure Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    beds: bedsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production', // Enable Redux DevTools in development
});

// Export types for TypeScript (optional, but good practice)
export const getState = store.getState;
export const dispatch = store.dispatch;
