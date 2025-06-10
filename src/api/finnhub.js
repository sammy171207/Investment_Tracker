import axios from 'axios';

const FINNHUB_API_KEY = 'd13p6e1r01qs7glj1um0d13p6e1r01qs7glj1umg';
const BASE_URL = 'https://finnhub.io/api/v1';

// Create axios instance with default config
const finnhubApi = axios.create({
  baseURL: BASE_URL,
  params: {
    token: FINNHUB_API_KEY
  }
});

// Stock API functions
export const getStockCandles = async (symbol, resolution, from, to) => {
  try {
    const response = await finnhubApi.get('/stock/candle', {
      params: {
        symbol,
        resolution,
        from,
        to
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await finnhubApi.get('/search', {
      params: { q: query }
    });
    return response.data.result || [];
  } catch (error) {
    handleApiError(error);
  }
};

// Error handling helper
const handleApiError = (error) => {
  if (error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
  } else if (error.request) {
    throw new Error('No response from server');
  } else {
    throw new Error(`Request Error: ${error.message}`);
  }
}; 