import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDetails } from '../features/stock/stockSlice';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import StockChart from '../components/StockChart';

const StockDetail = () => {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { selectedStock, loading, error } = useSelector((state) => state.stock);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchStockDetails(symbol));
    }
  }, [dispatch, symbol]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Details
      </Typography>
      <StockChart />
    </Container>
  );
};

export default StockDetail; 