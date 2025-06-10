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
    dispatch(setSelectedStock(stock.ticker));
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
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                {stock.ticker}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stock.name}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={handleWatchlistToggle}
                color={isWatched ? 'warning' : 'default'}
                size="small"
              >
                {isWatched ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddToPortfolio}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h5" component="div">
              {formatCurrency(stock.currentPrice)}
            </Typography>
            <Chip
              icon={stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${formatCurrency(stock.change)} (${formatPercentage(stock.changePercent)})`}
              color={stock.change >= 0 ? 'success' : 'error'}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Open: {formatCurrency(stock.open)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High: {formatCurrency(stock.high)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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