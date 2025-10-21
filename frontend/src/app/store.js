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
        // Ignore these action types for serializable check
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const RootState = store.getState;
export const AppDispatch = store.dispatch;
