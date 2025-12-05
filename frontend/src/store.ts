// filepath: frontend/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './features/orders/ordersSlice';

// Example: import your reducers here

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;