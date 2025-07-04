import axios from 'axios';

const FINNHUB_API_KEY = 'd13p6e1r01qs7glj1um0d13p6e1r01qs7glj1umg';
const BASE_URL = 'https://finnhub.io/api/v1';
const WS_URL = 'wss://ws.finnhub.io?token=' + FINNHUB_API_KEY;

// Create axios instance with default config
const finnhubApi = axios.create({
  baseURL: BASE_URL,
  params: {
    token: FINNHUB_API_KEY
  }
});

// WebSocket connection
let socket = null;
const subscribers = new Map();

export const connectWebSocket = () => {
  if (socket) return;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket Connected');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'trade') {
      const symbol = data.data[0].s;
      const price = data.data[0].p;
      const subscribers = subscribers.get(symbol) || [];
      subscribers.forEach(callback => callback(price));
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket Disconnected');
    socket = null;
    // Attempt to reconnect after 5 seconds
    setTimeout(connectWebSocket, 5000);
  };
};

export const subscribeToStock = (symbol, callback) => {
  if (!socket) connectWebSocket();
  
  if (!subscribers.has(symbol)) {
    subscribers.set(symbol, []);
    socket.send(JSON.stringify({ type: 'subscribe', symbol }));
  }
  
  subscribers.get(symbol).push(callback);
};

export const unsubscribeFromStock = (symbol, callback) => {
  const callbacks = subscribers.get(symbol);
  if (callbacks) {
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    if (callbacks.length === 0) {
      subscribers.delete(symbol);
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }
};

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

export const getStockQuote = async (symbol) => {
  try {
    const response = await finnhubApi.get('/quote', {
      params: { symbol }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCompanyProfile = async (symbol) => {
  try {
    const response = await finnhubApi.get('/stock/profile2', {
      params: { symbol }
    });
    return response.data;
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