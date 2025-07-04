import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { removeFromPortfolio } from '../features/portfolio/portfolioSlice';
import PortfolioOverview from '../components/PortfolioOverview';

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector((state) => state.portfolio?.stocks || []);

  const handleRemoveStock = (ticker) => {
    dispatch(removeFromPortfolio(ticker));
  };

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

  // Calculate portfolio metrics
  const totalValue = portfolio.reduce((sum, stock) => sum + (stock.currentPrice * stock.shares), 0);
  const totalCost = portfolio.reduce((sum, stock) => sum + (stock.purchasePrice * stock.shares), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = (totalGainLoss / totalCost) * 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 0, p: 0 }}>
      <Box sx={{ mb: 6, p: { xs: 2, md: 4 }, background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
          My Portfolio
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#9CA3AF' }}>
          Track and manage your investment portfolio
        </Typography>
      </Box>

      {/* Portfolio Overview with Charts */}
      <Box mb={6} sx={{ background: '#23272F', borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', p: { xs: 2, md: 4 } }}>
        <PortfolioOverview />
      </Box>

      {/* Holdings Table */}
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', background: '#23272F', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', mb: 6 }}>
        <Box sx={{ p: 3, bgcolor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F3F4F6' }}>
            Holdings
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            {portfolio.length} {portfolio.length === 1 ? 'holding' : 'holdings'}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#374151' }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'transparent' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Shares</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Purchase Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Current Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Total Value</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Gain/Loss</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#F3F4F6', borderBottom: '1px solid #374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((stock) => {
                const totalStockValue = stock.currentPrice * stock.shares;
                const totalCost = stock.purchasePrice * stock.shares;
                const gainLoss = totalStockValue - totalCost;
                const gainLossPercentage = (gainLoss / totalCost) * 100;

                return (
                  <TableRow 
                    key={stock.ticker}
                    sx={{ 
                      '&:hover': { bgcolor: '#1F2937' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#60A5FA' }}>
                        {stock.ticker}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#F3F4F6' }}>{stock.name}</TableCell>
                    <TableCell align="right" sx={{ color: '#F3F4F6' }}>{stock.shares}</TableCell>
                    <TableCell align="right" sx={{ color: '#F3F4F6' }}>{formatCurrency(stock.purchasePrice)}</TableCell>
                    <TableCell align="right" sx={{ color: '#F3F4F6' }}>{formatCurrency(stock.currentPrice)}</TableCell>
                    <TableCell align="right" sx={{ color: '#F3F4F6' }}>{formatCurrency(totalStockValue)}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        {gainLoss >= 0 ? <TrendingUpIcon sx={{ color: '#22D3EE' }} /> : <TrendingDownIcon sx={{ color: '#F87171' }} />}
                        <Typography sx={{ color: gainLoss >= 0 ? '#22D3EE' : '#F87171', fontWeight: 600 }}>
                          {formatCurrency(gainLoss)}
                          <Typography component="span" variant="body2" sx={{ ml: 1, color: '#9CA3AF' }}>
                            ({formatPercentage(gainLossPercentage)})
                          </Typography>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{ 
                          color: '#F87171',
                          '&:hover': { 
                            bgcolor: '#1E293B',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleRemoveStock(stock.ticker)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {portfolio.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#9CA3AF' }}>
                      Your portfolio is empty
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
                      Add stocks to start tracking your investments
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Portfolio;