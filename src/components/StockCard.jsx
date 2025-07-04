import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStock } from '../features/stock/stockSlice';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlist/watchlistSlice';
import AddToPortfolio from './AddToPortfolio';

const StockCard = ({ stock }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist?.stocks || []);
  const isWatched = watchlist.some((item) => item.ticker === stock.ticker);
  const [addToPortfolioOpen, setAddToPortfolioOpen] = useState(false);

  const handleCardClick = () => {
    console.log('Card clicked:', stock);
    dispatch(setSelectedStock(stock));
  };

  const handleWatchlistToggle = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the star
    console.log('Watchlist toggle:', stock);
    if (isWatched) {
      dispatch(removeFromWatchlist(stock.ticker));
    } else {
      dispatch(addToWatchlist(stock));
    }
  };

  const handleAddToPortfolio = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Opening Add to Portfolio dialog for:', stock);
    setAddToPortfolioOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'always'
    }).format(value / 100);
  };

  return (
    <>
      <Card
        sx={{
          cursor: 'pointer',
          background: '#23272F',
          color: '#F3F4F6',
          borderRadius: 4,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#60A5FA' }}>
                {stock.ticker}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                {stock.name}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={handleWatchlistToggle}
                sx={{ color: isWatched ? '#FBBF24' : '#9CA3AF', background: 'rgba(255,255,255,0.04)', borderRadius: 2, '&:hover': { background: '#1E293B' } }}
                size="small"
              >
                {isWatched ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddToPortfolio}
                sx={{ ml: 1, background: '#2563EB', color: '#F3F4F6', borderRadius: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { background: '#1D4ED8' } }}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
              {formatCurrency(stock.currentPrice)}
            </Typography>
            <Chip
              icon={stock.change >= 0 ? <TrendingUpIcon sx={{ color: '#22D3EE' }} /> : <TrendingDownIcon sx={{ color: '#F87171' }} />}
              label={`${formatCurrency(stock.change)} (${formatPercentage(stock.changePercent)})`}
              sx={{
                ml: 1,
                background: stock.change >= 0 ? '#1E293B' : '#1E293B',
                color: stock.change >= 0 ? '#22D3EE' : '#F87171',
                fontWeight: 600,
                borderRadius: 2,
                px: 1.5,
                '& .MuiChip-icon': { ml: 0, mr: 0.5 },
              }}
              size="small"
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Open: {formatCurrency(stock.open)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              High: {formatCurrency(stock.high)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Low: {formatCurrency(stock.low)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AddToPortfolio
        open={addToPortfolioOpen}
        onClose={() => setAddToPortfolioOpen(false)}
        stock={stock}
      />
    </>
  );
};

export default StockCard;