import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { addToPortfolio } from '../features/portfolio/portfolioSlice';

const AddToPortfolio = ({ open, onClose, stock }) => {
  const dispatch = useDispatch();
  const [shares, setShares] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(stock?.currentPrice || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding to portfolio:', {
      ...stock,
      shares: Number(shares),
      purchasePrice: Number(purchasePrice),
    });
    
    dispatch(addToPortfolio({
      ...stock,
      shares: Number(shares),
      purchasePrice: Number(purchasePrice),
    }));
    
    // Reset form
    setShares(1);
    setPurchasePrice(stock?.currentPrice || 0);
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add to Portfolio</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {stock && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {stock.ticker} - {stock.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Price: {formatCurrency(stock.currentPrice)}
              </Typography>
            </Box>
          )}
          <TextField
            label="Number of Shares"
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 1, step: 1 }}
            required
          />
          <TextField
            label="Purchase Price"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Total Investment: {formatCurrency(shares * purchasePrice)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add to Portfolio
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddToPortfolio; 