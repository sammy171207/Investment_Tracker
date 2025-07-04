import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchStocksAction, setSelectedStock } from '../features/stock/stockSlice';
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Alert,
  CircularProgress,
  ClickAwayListener,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '../utils/useDebounce';
import debounce from 'lodash/debounce';

const SearchBox = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, loading, error } = useSelector((state) => state.stock);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        dispatch(searchStocksAction(searchQuery));
      }
    }, 400),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleStockSelect = (stock) => {
    setQuery(stock.ticker);
    setIsOpen(false);
    dispatch(setSelectedStock(stock));
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search stocks..."
          value={query}
          onChange={handleQueryChange}
          onClick={() => setIsOpen(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} sx={{ color: '#60A5FA' }} />
              </InputAdornment>
            ),
            style: { color: '#F3F4F6' },
          }}
          sx={{
            background: '#23272F',
            color: '#F3F4F6',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              color: '#F3F4F6',
              borderRadius: 2,
              background: '#23272F',
              '& fieldset': { borderColor: '#374151' },
              '&:hover fieldset': { borderColor: '#60A5FA' },
            },
            '& .MuiInputBase-input': { color: '#F3F4F6' },
          }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mt: 1, background: '#1E293B', color: '#F87171', borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isOpen && query && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1,
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              background: '#23272F',
              color: '#F3F4F6',
              borderRadius: 2,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} sx={{ color: '#60A5FA' }} />
              </Box>
            ) : (
              <List>
                {searchResults.map((stock, index) => {
                  // Skip invalid stock data
                  if (!stock || !stock.ticker) return null;
                  
                  return (
                    <ListItem
                      key={`${stock.ticker}-${stock.name}-${index}`}
                      onClick={() => handleStockSelect(stock)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#1E293B' } }}
                    >
                      <ListItemText
                        primary={<span style={{ color: '#F3F4F6', fontWeight: 600 }}>{stock.ticker}</span>}
                        secondary={<span style={{ color: '#9CA3AF' }}>{stock.name}</span>}
                      />
                    </ListItem>
                  );
                })}
                {searchResults.length === 0 && query && (
                  <ListItem key="no-results">
                    <ListItemText primary={<span style={{ color: '#9CA3AF' }}>No results found</span>} />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBox;
