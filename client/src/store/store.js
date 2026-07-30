import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add feature reducers here
    // Dummy reducer to prevent "valid reducer" error until you add your own
    _dummy: (state = {}) => state,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
