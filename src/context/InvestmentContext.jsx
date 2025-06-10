import React, { createContext, useContext, useReducer, useEffect } from 'react';

const InvestmentContext = createContext();

const initialState = {
  watchlist: [],
  portfolio: [],
  loading: false,
  error: null
};

const investmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_WATCHLIST':
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
        error: null
      };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(item => item.ticker !== action.payload),
        error: null
      };
    case 'ADD_TO_PORTFOLIO':
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload],
        error: null
      };
    case 'REMOVE_FROM_PORTFOLIO':
      return {
        ...state,
        portfolio: state.portfolio.filter(item => item.ticker !== action.payload),
        error: null
      };
    case 'UPDATE_PORTFOLIO_ITEM':
      return {
        ...state,
        portfolio: state.portfolio.map(item =>
          item.ticker === action.payload.ticker ? { ...item, ...action.payload } : item
        ),
        error: null
      };
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload, error: null };
    case 'SET_PORTFOLIO':
      return { ...state, portfolio: action.payload, error: null };
    default:
      return state;
  }
};

export const InvestmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(investmentReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      const savedPortfolio = localStorage.getItem('portfolio');
      
      if (savedWatchlist) {
        dispatch({ type: 'SET_WATCHLIST', payload: JSON.parse(savedWatchlist) });
      }
      if (savedPortfolio) {
        dispatch({ type: 'SET_PORTFOLIO', payload: JSON.parse(savedPortfolio) });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error loading saved data' });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error saving data' });
    }
  }, [state.watchlist, state.portfolio]);

  const addToWatchlist = (stock) => {
    if (!state.watchlist.some(item => item.ticker === stock.ticker)) {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: stock });
    }
  };

  const removeFromWatchlist = (ticker) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: ticker });
  };

  const addToPortfolio = (stock) => {
    if (!state.portfolio.some(item => item.ticker === stock.ticker)) {
      dispatch({ type: 'ADD_TO_PORTFOLIO', payload: stock });
    }
  };

  const removeFromPortfolio = (ticker) => {
    dispatch({ type: 'REMOVE_FROM_PORTFOLIO', payload: ticker });
  };

  const updatePortfolioItem = (stock) => {
    dispatch({ type: 'UPDATE_PORTFOLIO_ITEM', payload: stock });
  };

  const value = {
    ...state,
    addToWatchlist,
    removeFromWatchlist,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioItem
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
}; 