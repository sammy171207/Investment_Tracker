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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Portfolio
      </Typography>

      {/* Portfolio Overview */}
      <Box mb={4}>
        <PortfolioOverview />
      </Box>

      {/* Portfolio Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h5">
                {formatCurrency(totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Gain/Loss
              </Typography>
              <Typography variant="h5" color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(totalGainLoss)}
                <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                  ({formatPercentage(totalGainLossPercentage)})
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Number of Holdings
              </Typography>
              <Typography variant="h5">
                {portfolio.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portfolio Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Purchase Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right">Gain/Loss</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.map((stock) => {
              const totalStockValue = stock.currentPrice * stock.shares;
              const totalCost = stock.purchasePrice * stock.shares;
              const gainLoss = totalStockValue - totalCost;
              const gainLossPercentage = (gainLoss / totalCost) * 100;

              return (
                <TableRow key={stock.ticker}>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
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
                      <Typography color={gainLoss >= 0 ? 'success.main' : 'error.main'}>
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {portfolio.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    Your portfolio is empty. Add stocks to start tracking your investments.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Portfolio;