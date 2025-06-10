import { createSlice } from '@reduxjs/toolkit';

// Load portfolio from localStorage if available
const loadPortfolio = () => {
  try {
    const savedPortfolio = localStorage.getItem('portfolio');
    console.log('Loading portfolio from localStorage:', savedPortfolio);
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  } catch (error) {
    console.error('Error loading portfolio from localStorage:', error);
    return [];
  }
};

const initialState = {
  stocks: loadPortfolio(),
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToPortfolio: (state, action) => {
      console.log('Adding to portfolio:', action.payload);
      const existingStock = state.stocks.find(stock => stock.ticker === action.payload.ticker);
      if (existingStock) {
        // Update existing stock
        existingStock.shares += action.payload.shares || 1;
        existingStock.purchasePrice = action.payload.purchasePrice;
        console.log('Updated existing stock:', existingStock);
      } else {
        // Add new stock
        const newStock = {
          ...action.payload,
          shares: action.payload.shares || 1,
          purchasePrice: action.payload.purchasePrice || action.payload.currentPrice,
        };
        state.stocks.push(newStock);
        console.log('Added new stock:', newStock);
      }
      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(state.stocks));
      console.log('Updated portfolio in localStorage:', state.stocks);
    },
    removeFromPortfolio: (state, action) => {
      console.log('Removing from portfolio:', action.payload);
      state.stocks = state.stocks.filter(stock => stock.ticker !== action.payload);
      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(state.stocks));
      console.log('Updated portfolio after removal:', state.stocks);
    },
    updateStockPrice: (state, action) => {
      const { ticker, currentPrice, change, changePercent } = action.payload;
      const stock = state.stocks.find(s => s.ticker === ticker);
      if (stock) {
        stock.currentPrice = currentPrice;
        stock.change = change;
        stock.changePercent = changePercent;
        console.log('Updated stock price:', stock);
      }
    },
    updateStockShares: (state, action) => {
      const { ticker, shares } = action.payload;
      const stock = state.stocks.find(s => s.ticker === ticker);
      if (stock) {
        stock.shares = shares;
        console.log('Updated stock shares:', stock);
      }
    },
    clearPortfolio: (state) => {
      state.stocks = [];
      // Clear localStorage
      localStorage.removeItem('portfolio');
      console.log('Cleared portfolio');
    },
  },
});

export const {
  addToPortfolio,
  removeFromPortfolio,
  updateStockPrice,
  updateStockShares,
  clearPortfolio,
} = portfolioSlice.actions;

export default portfolioSlice.reducer; 