import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInvestment } from '../context/InvestmentContext';
import { fetchStockDetails } from '../features/stock/stockSlice';
import { useNavigate } from 'react-router-dom';

export const useStockActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedStock } = useSelector((state) => state.stock);
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToPortfolio,
    removeFromPortfolio,
    watchlist,
    portfolio
  } = useInvestment();

  const handleStockSelect = useCallback(async (symbol) => {
    try {
      await dispatch(fetchStockDetails(symbol)).unwrap();
      navigate(`/stock/${symbol}`);
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  }, [dispatch, navigate]);

  const handleAddToWatchlist = useCallback(() => {
    if (selectedStock) {
      addToWatchlist(selectedStock);
    }
  }, [selectedStock, addToWatchlist]);

  const handleRemoveFromWatchlist = useCallback(() => {
    if (selectedStock) {
      removeFromWatchlist(selectedStock.ticker);
    }
  }, [selectedStock, removeFromWatchlist]);

  const handleAddToPortfolio = useCallback(() => {
    if (selectedStock) {
      addToPortfolio(selectedStock);
    }
  }, [selectedStock, addToPortfolio]);

  const handleRemoveFromPortfolio = useCallback(() => {
    if (selectedStock) {
      removeFromPortfolio(selectedStock.ticker);
    }
  }, [selectedStock, removeFromPortfolio]);

  const isInWatchlist = useCallback((ticker) => {
    return watchlist.some(item => item.ticker === ticker);
  }, [watchlist]);

  const isInPortfolio = useCallback((ticker) => {
    return portfolio.some(item => item.ticker === ticker);
  }, [portfolio]);

  return {
    handleStockSelect,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
    handleAddToPortfolio,
    handleRemoveFromPortfolio,
    isInWatchlist,
    isInPortfolio
  };
}; 