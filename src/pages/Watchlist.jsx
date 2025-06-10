import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import StockCard from '../components/StockCard';

const Watchlist = () => {
  const watchlist = useSelector((state) => state.watchlist?.stocks || []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Watchlist
      </Typography>

      {watchlist.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Your watchlist is empty. Add stocks to your watchlist to track them.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {watchlist.map((stock) => (
            <Grid key={stock.ticker} xs={12} md={4}>
              <StockCard stock={stock} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Watchlist; 