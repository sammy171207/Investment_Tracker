import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, ButtonGroup, Button, Grid } from '@mui/material';
import { setPeriod, fetchChartData } from '../features/stock/stockSlice';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StockChart = () => {
  const dispatch = useDispatch();
  const { selectedPeriod, selectedStock } = useSelector((state) => state.stock);
  const chartData = selectedStock?.chartData?.[selectedPeriod] || [];

  useEffect(() => {
    if (selectedStock?.ticker) {
      dispatch(fetchChartData({ symbol: selectedStock.ticker, period: selectedPeriod }));
    }
  }, [dispatch, selectedStock?.ticker, selectedPeriod]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatChange = (change) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    }).format(change);
  };

  const formatPercent = (percent) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'always'
    }).format(percent / 100);
  };

  if (!selectedStock) {
    return (
      <Paper elevation={0} sx={{ p: 4, background: '#23272F', color: '#F3F4F6', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
        <Typography variant="h6" align="center" sx={{ color: '#9CA3AF' }}>
          Select a stock to view its chart
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, background: '#23272F', color: '#F3F4F6', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
      {/* Stock Info Header */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#60A5FA' }}>
              {selectedStock.name} ({selectedStock.ticker})
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
                {formatPrice(selectedStock.currentPrice)}
              </Typography>
              <Box display="flex" alignItems="center" sx={{ color: selectedStock.change >= 0 ? '#22D3EE' : '#F87171', fontWeight: 600 }}>
                {selectedStock.change >= 0 ? <TrendingUpIcon sx={{ color: '#22D3EE' }} /> : <TrendingDownIcon sx={{ color: '#F87171' }} />}
                <Typography variant="body1" component="span" sx={{ color: selectedStock.change >= 0 ? '#22D3EE' : '#F87171', fontWeight: 600 }}>
                  {formatChange(selectedStock.change)} ({formatPercent(selectedStock.changePercent)})
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup variant="contained" size="small" sx={{ background: '#181C23', borderRadius: 2, boxShadow: 'none' }}>
                <Button 
                  onClick={() => dispatch(setPeriod('1week'))}
                  sx={{ background: selectedPeriod === '1week' ? '#2563EB' : 'transparent', color: '#F3F4F6', fontWeight: 600, borderRadius: 2, '&:hover': { background: '#1D4ED8' } }}
                >
                  1 Week
                </Button>
                <Button 
                  onClick={() => dispatch(setPeriod('1month'))}
                  sx={{ background: selectedPeriod === '1month' ? '#2563EB' : 'transparent', color: '#F3F4F6', fontWeight: 600, borderRadius: 2, '&:hover': { background: '#1D4ED8' } }}
                >
                  1 Month
                </Button>
                <Button 
                  onClick={() => dispatch(setPeriod('1year'))}
                  sx={{ background: selectedPeriod === '1year' ? '#2563EB' : 'transparent', color: '#F3F4F6', fontWeight: 600, borderRadius: 2, '&:hover': { background: '#1D4ED8' } }}
                >
                  1 Year
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chart */}
      <Box height="400px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 24,
              right: 32,
              left: 16,
              bottom: 24,
            }}
          >
            <CartesianGrid stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              interval={selectedPeriod === '1year' ? 'preserveStartEnd' : 0}
              stroke="#9CA3AF"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => formatPrice(value)}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              stroke="#9CA3AF"
            />
            <Tooltip 
              formatter={(value) => formatPrice(value)}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ background: '#23272F', color: '#F3F4F6', border: 'none', borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ color: '#F3F4F6' }} />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#60A5FA"
              name="Close Price"
              dot={selectedPeriod !== '1year'}
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#22D3EE"
              name="Open Price"
              dot={selectedPeriod !== '1year'}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StockChart;
