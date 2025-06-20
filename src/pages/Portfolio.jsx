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
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          My Portfolio
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Track and manage your investment portfolio
        </Typography>
      </Box>

      {/* Portfolio Overview with Charts */}
      <Box mb={6}>
        <PortfolioOverview />
      </Box>

      {/* Holdings Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Holdings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {portfolio.length} {portfolio.length === 1 ? 'holding' : 'holdings'}
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Shares</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Purchase Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Gain/Loss</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {stock.ticker}
                      </Typography>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell align="right">{stock.shares}</TableCell>
                    <TableCell align="right">{formatCurrency(stock.purchasePrice)}</TableCell>
                    <TableCell align="right">{formatCurrency(stock.currentPrice)}</TableCell>
                    <TableCell align="right">{formatCurrency(totalStockValue)}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        {gainLoss >= 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                        <Typography color={gainLoss >= 0 ? 'success.main' : 'error.main'} fontWeight="medium">
                          {formatCurrency(gainLoss)}
                          <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                            ({formatPercentage(gainLossPercentage)})
                          </Typography>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveStock(stock.ticker)}
                        size="small"
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'error.lighter',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
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
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Your portfolio is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
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