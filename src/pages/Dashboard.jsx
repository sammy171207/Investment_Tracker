import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import StockCard from '../components/StockCard';
import StockChart from '../components/StockChart';

// Dummy data for featured stocks
const featuredStocks = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.04,
    change: 2.34,
    changePercent: 1.35,
    open: 174.93,
    high: 176.24,
    low: 174.50,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 175.04, open: 174.93 },
        { date: '2024-03-19', close: 176.24, open: 175.12 },
        { date: '2024-03-20', close: 175.84, open: 176.50 },
        { date: '2024-03-21', close: 176.94, open: 175.90 },
        { date: '2024-03-22', close: 177.77, open: 177.00 },
        { date: '2024-03-23', close: 178.72, open: 177.80 },
        { date: '2024-03-24', close: 179.66, open: 178.75 }
      ]
    }
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 415.32,
    change: -3.45,
    changePercent: -0.82,
    open: 414.50,
    high: 416.78,
    low: 413.90,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 415.32, open: 414.50 },
        { date: '2024-03-19', close: 416.78, open: 415.60 },
        { date: '2024-03-20', close: 415.92, open: 416.90 },
        { date: '2024-03-21', close: 417.45, open: 416.00 },
        { date: '2024-03-22', close: 418.23, open: 417.50 },
        { date: '2024-03-23', close: 419.12, open: 418.30 },
        { date: '2024-03-24', close: 420.05, open: 419.20 }
      ]
    }
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.56,
    change: 1.23,
    changePercent: 0.87,
    open: 142.20,
    high: 143.45,
    low: 141.90,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 142.56, open: 142.20 },
        { date: '2024-03-19', close: 143.45, open: 142.60 },
        { date: '2024-03-20', close: 142.89, open: 143.50 },
        { date: '2024-03-21', close: 143.78, open: 143.00 },
        { date: '2024-03-22', close: 144.23, open: 143.80 },
        { date: '2024-03-23', close: 144.89, open: 144.30 },
        { date: '2024-03-24', close: 145.45, open: 144.90 }
      ]
    }
  }
];

const Dashboard = () => {
  const { selectedStock } = useSelector((state) => state.stock);

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 0, p: 0 }}>
      <Box sx={{ mb: 6, p: { xs: 2, md: 4 }, background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
          Dashboard
        </Typography>
      </Box>

      {/* Featured Stocks */}
      <Box mb={4} sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: { xs: 2, md: 4 } }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#F3F4F6', fontWeight: 600 }}>
          Featured Stocks
        </Typography>
        <Grid container spacing={3}>
          {featuredStocks.map((stock) => (
            <Grid key={stock.ticker} item xs={12} md={4}>
              <StockCard stock={stock} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stock Chart */}
      <Box sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: { xs: 2, md: 4 } }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#F3F4F6', fontWeight: 600 }}>
          Stock Chart
        </Typography>
        <StockChart />
      </Box>
    </Container>
  );
};

export default Dashboard;
