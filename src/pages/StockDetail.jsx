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
        <CircularProgress sx={{ color: '#60A5FA' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 0, p: 0 }}>
        <Box sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: 4, mt: 4 }}>
          <Alert severity="error" sx={{ background: '#1E293B', color: '#F87171', borderRadius: 2 }}>{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 0, p: 0 }}>
      <Box sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: { xs: 2, md: 4 }, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
          Stock Details
        </Typography>
        <StockChart />
      </Box>
    </Container>
  );
};

export default StockDetail; 