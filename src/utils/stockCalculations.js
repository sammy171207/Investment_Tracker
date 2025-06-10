export const calculateTotalValue = (portfolio) => {
  return portfolio.reduce((total, item) => {
    return total + (item.currentPrice * item.shares);
  }, 0);
};

export const calculateTotalGainLoss = (portfolio) => {
  return portfolio.reduce((total, item) => {
    const gainLoss = (item.currentPrice - item.purchasePrice) * item.shares;
    return total + gainLoss;
  }, 0);
};

export const calculateGainLossPercentage = (portfolio) => {
  const totalInvestment = portfolio.reduce((total, item) => {
    return total + (item.purchasePrice * item.shares);
  }, 0);

  if (totalInvestment === 0) return 0;

  const totalGainLoss = calculateTotalGainLoss(portfolio);
  return (totalGainLoss / totalInvestment) * 100;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always'
  }).format(value / 100);
};

export const calculatePortfolioAllocation = (portfolio) => {
  const totalValue = calculateTotalValue(portfolio);
  
  return portfolio.map(item => ({
    ...item,
    allocation: (item.currentPrice * item.shares) / totalValue * 100
  }));
};

export const calculateDailyChange = (portfolio) => {
  return portfolio.reduce((total, item) => {
    const dailyChange = item.change * item.shares;
    return total + dailyChange;
  }, 0);
};

export const calculateDailyChangePercentage = (portfolio) => {
  const totalValue = calculateTotalValue(portfolio);
  const dailyChange = calculateDailyChange(portfolio);
  
  if (totalValue === 0) return 0;
  
  return (dailyChange / totalValue) * 100;
}; 