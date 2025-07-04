import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Compare = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // const stocks = useSelector((state) => state.stock?.stocks || []);
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150, change: 1.2 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2800, change: -0.5 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3400, change: 2.1 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 300, change: 0.8 },
  ];
  const [selectedStock1, setSelectedStock1] = useState('');
  const [selectedStock2, setSelectedStock2] = useState('');

  const handleStockChange = (event, stockNumber) => {
    if (stockNumber === 1) {
      setSelectedStock1(event.target.value);
    } else {
      setSelectedStock2(event.target.value);
    }
  };

  const stock1 = stocks.find((stock) => stock.symbol === selectedStock1);
  const stock2 = stocks.find((stock) => stock.symbol === selectedStock2);

  const comparisonData = [
    { name: 'Stock 1', price: stock1?.currentPrice || 0, change: stock1?.change || 0 },
    { name: 'Stock 2', price: stock2?.currentPrice || 0, change: stock2?.change || 0 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 0, mb: 0, px: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ 
            textAlign: 'center', 
            color: '#F3F4F6',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Compare Stocks
        </Typography>

        {/* Stock Selection */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center', 
            gap: 2, 
            width: '100%',
            mb: 6
          }}
        >
          <Select
            value={selectedStock1}
            onChange={(event) => handleStockChange(event, 1)}
            sx={{ 
              width: { xs: '100%', md: '300px' },
              backgroundColor: '#23272F',
              color: '#F3F4F6',
              borderRadius: 2,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
              '.MuiSvgIcon-root': { color: '#F3F4F6' },
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60A5FA' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: '#23272F',
                  color: '#F3F4F6',
                  borderRadius: 2,
                },
              },
            }}
          >
            {stocks.map((stock) => (
              <MenuItem key={stock.symbol} value={stock.symbol} sx={{ color: '#F3F4F6', background: '#23272F', '&:hover': { background: '#1E293B' } }}>
                {stock.name} ({stock.symbol})
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedStock2}
            onChange={(event) => handleStockChange(event, 2)}
            sx={{ 
              width: { xs: '100%', md: '300px' },
              backgroundColor: '#23272F',
              color: '#F3F4F6',
              borderRadius: 2,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
              '.MuiSvgIcon-root': { color: '#F3F4F6' },
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60A5FA' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: '#23272F',
                  color: '#F3F4F6',
                  borderRadius: 2,
                },
              },
            }}
          >
            {stocks.map((stock) => (
              <MenuItem key={stock.symbol} value={stock.symbol} sx={{ color: '#F3F4F6', background: '#23272F', '&:hover': { background: '#1E293B' } }}>
                {stock.name} ({stock.symbol})
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Comparison Chart */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#23272F',
            color: '#F3F4F6',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
          }}
        >
          <Box sx={{ p: 3, bgcolor: 'transparent', textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 'bold',
                color: '#F3F4F6'
              }}
            >
              Comparison Chart
            </Typography>
          </Box>

          <Box sx={{ 
            height: isMobile ? '350px' : '450px',
            width: '100%',
            p: 2
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={comparisonData}
                margin={{
                  top: 24,
                  right: 32,
                  left: 16,
                  bottom: 24,
                }}
              >
                <CartesianGrid stroke="#374151" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#9CA3AF' }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#9CA3AF' }}
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  formatter={(value) => value.toFixed(2)}
                  contentStyle={{
                    background: '#23272F',
                    color: '#F3F4F6',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)'
                  }}
                />
                <Legend wrapperStyle={{ color: '#F3F4F6' }} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#60A5FA"
                  name="Price"
                  strokeWidth={3}
                  dot={{ r: isMobile ? 3 : 5 }}
                  activeDot={{ r: isMobile ? 5 : 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="change"
                  stroke="#22D3EE"
                  name="Change"
                  strokeWidth={3}
                  dot={{ r: isMobile ? 3 : 5 }}
                  activeDot={{ r: isMobile ? 5 : 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Compare;