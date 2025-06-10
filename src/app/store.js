import { configureStore } from '@reduxjs/toolkit';
import stockReducer from '../features/stock/stockSlice';
import watchlistReducer from '../features/watchlist/watchlistSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';

export const store = configureStore({
  reducer: {
    stock: stockReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
  },
}); 