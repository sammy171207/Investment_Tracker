import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PortfolioOverview = () => {
  const portfolio = useSelector((state) => state.portfolio?.stocks || []);

  // Calculate portfolio distribution
  const portfolioDistribution = portfolio.reduce((acc, stock) => {
    const value = stock.currentPrice * stock.shares;
    const type = stock.type || 'Stocks'; // Default to Stocks if type not specified
    acc[type] = (acc[type] || 0) + value;
    return acc;
  }, {});

  const pieData = Object.entries(portfolioDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate total portfolio value
  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  // Calculate daily performance
  const dailyPerformance = portfolio.map(stock => ({
    date: new Date().toLocaleDateString(),
    value: stock.currentPrice * stock.shares,
    change: stock.change * stock.shares,
    changePercent: stock.changePercent,
  }));

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
    <Box>
      <Grid container spacing={3}>
        {/* Portfolio Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Daily Change
              </Typography>
              <Typography variant="h4" color={dailyPerformance[0]?.change >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(dailyPerformance[0]?.change || 0)}
                <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                  ({formatPercentage(dailyPerformance[0]?.changePercent || 0)})
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Number of Assets
              </Typography>
              <Typography variant="h4">
                {portfolio.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Portfolio Value"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioOverview; 