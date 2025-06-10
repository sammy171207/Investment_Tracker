import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, ButtonGroup, Button, Grid } from '@mui/material';
import { setPeriod } from '../features/stock/stockSlice';
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
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" align="center">
          Select a stock to view its chart
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      {/* Stock Info Header */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography variant="h5" component="div">
              {selectedStock.name} ({selectedStock.ticker})
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" component="div">
                {formatPrice(selectedStock.currentPrice)}
              </Typography>
              <Box display="flex" alignItems="center" color={selectedStock.change >= 0 ? 'success.main' : 'error.main'}>
                {selectedStock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography variant="body1" component="span">
                  {formatChange(selectedStock.change)} ({formatPercent(selectedStock.changePercent)})
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup variant="contained" size="small">
                <Button 
                  onClick={() => dispatch(setPeriod('1week'))}
                  color={selectedPeriod === '1week' ? 'primary' : 'inherit'}
                >
                  1 Week
                </Button>
                <Button 
                  onClick={() => dispatch(setPeriod('1month'))}
                  color={selectedPeriod === '1month' ? 'primary' : 'inherit'}
                >
                  1 Month
                </Button>
                <Button 
                  onClick={() => dispatch(setPeriod('1year'))}
                  color={selectedPeriod === '1year' ? 'primary' : 'inherit'}
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
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval={selectedPeriod === '1year' ? 'preserveStartEnd' : 0}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              name="Close Price"
              dot={selectedPeriod !== '1year'}
            />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#82ca9d"
              name="Open Price"
              dot={selectedPeriod !== '1year'}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StockChart;
