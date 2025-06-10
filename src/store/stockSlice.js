import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStockCandles, searchStocks } from '../api/finnhub';

// Async thunks
export const fetchStockData = createAsyncThunk(
  'stock/fetchStockData',
  async ({ symbol, resolution, from, to }) => {
    const data = await getStockCandles(symbol, resolution, from, to);
    if (data.s === 'no_data') {
      throw new Error('No data available for this time period');
    }
    return data;
  }
);

export const searchStocksAction = createAsyncThunk(
  'stock/searchStocks',
  async (query) => {
    return await searchStocks(query);
  }
);

const initialState = {
  data: null,
  searchResults: [],
  loading: false,
  error: null,
  selectedSymbol: 'AAPL',
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStockData
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle searchStocks
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
        state.searchResults = [];
      });
  },
});

export const { setSelectedSymbol, clearError } = stockSlice.actions;
export default stockSlice.reducer; 