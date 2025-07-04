import { createSlice } from '@reduxjs/toolkit';
import { subscribeToStock, unsubscribeFromStock } from '../../api/finnhub';

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
  realTimeUpdates: {},
};

// Helper function to calculate portfolio metrics
const calculatePortfolioMetrics = (stocks) => {
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.currentPrice * stock.shares), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + (stock.purchasePrice * stock.shares), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercentage
  };
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
        const newShares = existingStock.shares + (action.payload.shares || 1);
        const newTotalCost = (existingStock.purchasePrice * existingStock.shares) + 
                           (action.payload.purchasePrice * (action.payload.shares || 1));
        existingStock.shares = newShares;
        existingStock.purchasePrice = newTotalCost / newShares;
        console.log('Updated existing stock:', existingStock);
      } else {
        // Add new stock
        const newStock = {
          ...action.payload,
          shares: action.payload.shares || 1,
          purchasePrice: action.payload.purchasePrice || action.payload.currentPrice,
          lastUpdated: new Date().toISOString()
        };
        state.stocks.push(newStock);
        console.log('Added new stock:', newStock);
        
        // Subscribe to real-time updates
        subscribeToStock(newStock.ticker, (price) => {
          state.dispatch(updateStockPrice({ 
            ticker: newStock.ticker, 
            currentPrice: price 
          }));
        });
      }
      
      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(state.stocks));
      console.log('Updated portfolio in localStorage:', state.stocks);
    },
    
    removeFromPortfolio: (state, action) => {
      console.log('Removing from portfolio:', action.payload);
      const stock = state.stocks.find(s => s.ticker === action.payload);
      if (stock) {
        // Unsubscribe from real-time updates
        unsubscribeFromStock(stock.ticker);
      }
      state.stocks = state.stocks.filter(stock => stock.ticker !== action.payload);
      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(state.stocks));
      console.log('Updated portfolio after removal:', state.stocks);
    },
    
    updateStockPrice: (state, action) => {
      const { ticker, currentPrice } = action.payload;
      const stock = state.stocks.find(s => s.ticker === ticker);
      if (stock) {
        const previousPrice = stock.currentPrice;
        stock.currentPrice = currentPrice;
        stock.change = currentPrice - previousPrice;
        stock.changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
        stock.lastUpdated = new Date().toISOString();
        console.log('Updated stock price:', stock);
      }
    },
    
    updateStockShares: (state, action) => {
      const { ticker, shares } = action.payload;
      const stock = state.stocks.find(s => s.ticker === ticker);
      if (stock) {
        stock.shares = shares;
        stock.lastUpdated = new Date().toISOString();
        console.log('Updated stock shares:', stock);
        // Save to localStorage
        localStorage.setItem('portfolio', JSON.stringify(state.stocks));
      }
    },
    
    clearPortfolio: (state) => {
      // Unsubscribe from all real-time updates
      state.stocks.forEach(stock => {
        unsubscribeFromStock(stock.ticker);
      });
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

// Selectors
export const selectPortfolio = (state) => state.portfolio.stocks;
export const selectPortfolioMetrics = (state) => calculatePortfolioMetrics(state.portfolio.stocks);
export const selectPortfolioLoading = (state) => state.portfolio.loading;
export const selectPortfolioError = (state) => state.portfolio.error;

export default portfolioSlice.reducer; 