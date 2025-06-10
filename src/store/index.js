import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './stockSlice';

export const store = configureStore({
  reducer: {
    stock: stockReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 