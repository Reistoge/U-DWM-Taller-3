// filepath: frontend/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './features/orders/ordersSlice';
import themeReducer from './features/themeSlice'


// Example: import your reducers here

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    theme: themeReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;