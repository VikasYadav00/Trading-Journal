import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tradeReducer from './features/trades/tradeSlice';
import goalReducer from './features/goals/goalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trades: tradeReducer,
    goals: goalReducer,
  },
});
