import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* First Row: Summary Cards - 3 Columns */}
        <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center', width: '100%' }}>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'translateY(-4px)' },
                minWidth: 300,
                maxWidth: 400,
                mx: 'auto',
                width: '100%'
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ mb: 2 }}>
                  Total Portfolio Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalValue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'translateY(-4px)' },
                minWidth: 300,
                maxWidth: 400,
                mx: 'auto',
                width: '100%'
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ mb: 2 }}>
                  Daily Change
                </Typography>
                <Typography variant="h4" color={dailyPerformance[0]?.change >= 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(dailyPerformance[0]?.change || 0)}
                  <Typography component="span" variant="subtitle1" sx={{ display: 'block', mt: 1 }}>
                    ({formatPercentage(dailyPerformance[0]?.changePercent || 0)})
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'translateY(-4px)' },
                minWidth: 300,
                maxWidth: 400,
                mx: 'auto',
                width: '100%'
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ mb: 2 }}>
                  Number of Assets
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {portfolio.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Second Row: Charts - 2 Columns (50% each) */}
        <Grid container spacing={4} sx={{ justifyContent: 'center', width: '100%' }}>
          {/* Portfolio Distribution Chart */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: isMobile ? '350px' : '450px',
                borderRadius: 2, 
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Portfolio Distribution
                </Typography>
              </Box>
              <Box sx={{ 
                flex: 1,
                width: '100%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={isMobile ? 100 : 140}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend 
                      layout={isMobile ? "horizontal" : "vertical"}
                      verticalAlign={isMobile ? "bottom" : "middle"}
                      align={isMobile ? "center" : "right"}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Performance Chart */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: isMobile ? '350px' : '450px',
                borderRadius: 2, 
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Portfolio Performance
                </Typography>
              </Box>
              <Box sx={{ 
                flex: 1,
                width: '100%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
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
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name="Portfolio Value"
                      dot={!isMobile}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PortfolioOverview; 