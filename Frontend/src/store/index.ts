import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conversionReducer from './slices/conversionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversion: conversionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;