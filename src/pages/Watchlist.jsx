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
    <Container maxWidth="lg" sx={{ mt: 0, p: 0 }}>
      <Box sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: { xs: 2, md: 4 }, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
          Watchlist
        </Typography>

        {watchlist.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', background: '#1E293B', color: '#9CA3AF', borderRadius: 2, boxShadow: 'none', mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#9CA3AF' }}>
              Your watchlist is empty. Add stocks to your watchlist to track them.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {watchlist.map((stock) => (
              <Grid key={stock.ticker} item xs={12} md={4}>
                <StockCard stock={stock} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Watchlist; 