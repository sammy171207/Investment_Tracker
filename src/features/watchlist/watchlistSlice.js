import { createSlice } from '@reduxjs/toolkit';

// Load watchlist from localStorage if available
const loadWatchlist = () => {
  try {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  } catch (error) {
    console.error('Error loading watchlist from localStorage:', error);
    return [];
  }
};

const initialState = {
  stocks: loadWatchlist(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.stocks.some(stock => stock.ticker === action.payload.ticker)) {
        state.stocks.push(action.payload);
        // Save to localStorage
        localStorage.setItem('watchlist', JSON.stringify(state.stocks));
      }
    },
    removeFromWatchlist: (state, action) => {
      state.stocks = state.stocks.filter(stock => stock.ticker !== action.payload);
      // Save to localStorage
      localStorage.setItem('watchlist', JSON.stringify(state.stocks));
    },
    clearWatchlist: (state) => {
      state.stocks = [];
      // Clear localStorage
      localStorage.removeItem('watchlist');
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer; 