import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
  getStockCandles, 
  searchStocks, 
  getStockQuote, 
  getCompanyProfile,
  subscribeToStock,
  unsubscribeFromStock
} from '../../api/finnhub';

// const API_KEY = "R2QtNzOLRS1Np9Ouf07SCD7K99hqK6WC";
// const BASE_URL = "https://api.polygon.io/v3/reference/tickers";

// Dummy stock data for different companies
const dummyStocks = {
  'AAPL': {
    name: "Apple Inc.",
    ticker: "AAPL",
    currentPrice: 175.04,
    change: 2.34,
    changePercent: 1.35,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 175.04, open: 174.93 },
        { date: '2024-03-19', close: 176.24, open: 175.12 },
        { date: '2024-03-20', close: 175.84, open: 176.50 },
        { date: '2024-03-21', close: 176.94, open: 175.90 },
        { date: '2024-03-22', close: 177.77, open: 177.00 },
        { date: '2024-03-23', close: 178.72, open: 177.80 },
        { date: '2024-03-24', close: 179.66, open: 178.75 }
      ],
      '1month': Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 2, i + 1).toISOString().split('T')[0],
        close: 170 + Math.random() * 10,
        open: 170 + Math.random() * 10
      })),
      '1year': Array.from({ length: 365 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        close: 150 + Math.random() * 50,
        open: 150 + Math.random() * 50
      }))
    }
  },
  'MSFT': {
    name: "Microsoft Corporation",
    ticker: "MSFT",
    currentPrice: 415.32,
    change: -3.45,
    changePercent: -0.82,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 415.32, open: 414.50 },
        { date: '2024-03-19', close: 416.78, open: 415.60 },
        { date: '2024-03-20', close: 415.92, open: 416.90 },
        { date: '2024-03-21', close: 417.45, open: 416.00 },
        { date: '2024-03-22', close: 418.23, open: 417.50 },
        { date: '2024-03-23', close: 419.12, open: 418.30 },
        { date: '2024-03-24', close: 420.05, open: 419.20 }
      ],
      '1month': Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 2, i + 1).toISOString().split('T')[0],
        close: 410 + Math.random() * 15,
        open: 410 + Math.random() * 15
      })),
      '1year': Array.from({ length: 365 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        close: 380 + Math.random() * 60,
        open: 380 + Math.random() * 60
      }))
    }
  },
  'GOOGL': {
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    currentPrice: 142.56,
    change: 1.23,
    changePercent: 0.87,
    chartData: {
      '1week': [
        { date: '2024-03-18', close: 142.56, open: 142.20 },
        { date: '2024-03-19', close: 143.45, open: 142.60 },
        { date: '2024-03-20', close: 142.89, open: 143.50 },
        { date: '2024-03-21', close: 143.78, open: 143.00 },
        { date: '2024-03-22', close: 144.23, open: 143.80 },
        { date: '2024-03-23', close: 144.89, open: 144.30 },
        { date: '2024-03-24', close: 145.45, open: 144.90 }
      ],
      '1month': Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 2, i + 1).toISOString().split('T')[0],
        close: 140 + Math.random() * 8,
        open: 140 + Math.random() * 8
      })),
      '1year': Array.from({ length: 365 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        close: 130 + Math.random() * 30,
        open: 130 + Math.random() * 30
      }))
    }
  }
};

// Helper function to generate dummy chart data
const generateChartData = (basePrice, days, volatility = 0.02) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    currentPrice += change;
    const close = currentPrice;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      close,
      high: Math.max(open, close) + Math.random() * volatility * basePrice,
      low: Math.min(open, close) - Math.random() * volatility * basePrice,
    });
  }
  
  return data;
};

// Dummy data for featured stocks
const featuredStocks = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.04,
    change: 2.34,
    changePercent: 1.35,
    open: 174.93,
    high: 176.24,
    low: 174.50,
    chartData: {
      '1week': generateChartData(175.04, 7),
      '1month': generateChartData(175.04, 30),
      '1year': generateChartData(175.04, 365)
    }
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 415.32,
    change: -3.45,
    changePercent: -0.82,
    open: 414.50,
    high: 416.78,
    low: 413.90,
    chartData: {
      '1week': generateChartData(415.32, 7),
      '1month': generateChartData(415.32, 30),
      '1year': generateChartData(415.32, 365)
    }
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.56,
    change: 1.23,
    changePercent: 0.87,
    open: 142.20,
    high: 143.45,
    low: 141.90,
    chartData: {
      '1week': generateChartData(142.56, 7),
      '1month': generateChartData(142.56, 30),
      '1year': generateChartData(142.56, 365)
    }
  }
];

const initialState = {
  selectedStock: null,
  selectedPeriod: '1week',
  searchResults: [],
  loading: false,
  error: null,
  realTimeData: {},
};

// Async thunks
export const searchStocksAction = createAsyncThunk(
  'stock/searchStocks',
  async (query) => {
    const results = await searchStocks(query);
    return results;
  }
);

export const fetchStockDetails = createAsyncThunk(
  'stock/fetchStockDetails',
  async (symbol, { rejectWithValue }) => {
    try {
      const [quote, profile] = await Promise.all([
        getStockQuote(symbol),
        getCompanyProfile(symbol)
      ]);

      return {
        ticker: symbol,
        name: profile.name,
        currentPrice: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        previousClose: quote.pc,
        marketCap: profile.marketCapitalization,
        sector: profile.finnhubIndustry,
        website: profile.weburl,
        logo: profile.logo
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'stock/fetchChartData',
  async ({ symbol, period }, { rejectWithValue }) => {
    try {
      // For development, use dummy data
      if (process.env.NODE_ENV === 'development') {
        const dummyData = dummyStocks[symbol]?.chartData?.[period] || [];
        return {
          period,
          data: dummyData
        };
      }

      // For production, use actual API
      const end = Math.floor(Date.now() / 1000);
      let start;
      let resolution;

      switch (period) {
        case '1week':
          start = end - 7 * 24 * 60 * 60;
          resolution = '1D';
          break;
        case '1month':
          start = end - 30 * 24 * 60 * 60;
          resolution = '1D';
          break;
        case '1year':
          start = end - 365 * 24 * 60 * 60;
          resolution = '1W';
          break;
        default:
          start = end - 7 * 24 * 60 * 60;
          resolution = '1D';
      }

      const data = await getStockCandles(symbol, resolution, start, end);
      
      return {
        period,
        data: data.t.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index]
        }))
      };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // If API call fails, fall back to dummy data
      const dummyData = dummyStocks[symbol]?.chartData?.[period] || [];
      return {
        period,
        data: dummyData
      };
    }
  }
);

// Commented out API calls for now
/*
export const fetchStock = createAsyncThunk("fetch/stock", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        market: "stocks",
        active: "true",
        order: "asc",
        limit: 100,
        sort: "ticker",
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

export const fetchChartData = createAsyncThunk(
  "fetch/chart",
  async ({ ticker = "AAPL", period = "1week" }, { rejectWithValue }) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "1week":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "1month":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "1year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    const formatDate = (d) => d.toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}`;

    try {
      const response = await axios.get(url, {
        params: {
          adjusted: true,
          sort: "desc",
          limit: period === "1year" ? 365 : period === "1month" ? 30 : 7,
          apiKey: API_KEY,
        },
      });

      const data = response.data.results
        ?.reverse()
        .map(item => ({
          date: new Date(item.t).toLocaleDateString(),
          close: item.c,
          open: item.o,
          high: item.h,
          low: item.l,
          volume: item.v
        }));

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chart data");
    }
  }
);

export const fetchStockDetails = createAsyncThunk(
  "fetch/stockDetails",
  async (ticker = "AAPL", { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}`, {
        params: {
          apiKey: API_KEY
        }
      });
      
      const lastPriceResponse = await axios.get(`https://api.polygon.io/v2/last/trade/${ticker}`, {
        params: {
          apiKey: API_KEY
        }
      });

      return {
        ticker: response.data.results.ticker,
        name: response.data.results.name,
        currentPrice: lastPriceResponse.data.results.p,
        change: lastPriceResponse.data.results.p - response.data.results.last_updated_prev_close,
        changePercent: ((lastPriceResponse.data.results.p - response.data.results.last_updated_prev_close) / response.data.results.last_updated_prev_close) * 100
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching stock details");
    }
  }
);
*/

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    setSelectedStock: (state, action) => {
      const stock = action.payload;
      if (typeof stock === 'string') {
        // If only the ticker is provided, use the dummy data
        state.selectedStock = dummyStocks[stock] || null;
      } else {
        // If full stock object is provided, use it
        state.selectedStock = stock;
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    updateRealTimePrice: (state, action) => {
      const { symbol, price } = action.payload;
      if (state.selectedStock?.ticker === symbol) {
        state.selectedStock.currentPrice = price;
      }
      state.realTimeData[symbol] = price;
    }
  },
  extraReducers: (builder) => {
    builder
      // Commented out API-related reducers
      /*
      .addCase(fetchStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      */
      // Search stocks
      .addCase(searchStocksAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStocksAction.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchStocksAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch stock details
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
        // Subscribe to real-time updates
        subscribeToStock(action.payload.ticker, (price) => {
          state.dispatch(updateRealTimePrice({ 
            symbol: action.payload.ticker, 
            price 
          }));
        });
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch chart data
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedStock) {
          state.selectedStock.chartData = {
            ...state.selectedStock.chartData,
            [action.payload.period]: action.payload.data
          };
        }
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setPeriod, 
  setSelectedStock, 
  clearSearchResults,
  updateRealTimePrice 
} = stockSlice.actions;

export default stockSlice.reducer;
