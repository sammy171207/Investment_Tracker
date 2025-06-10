import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchStocks, setSelectedStock } from '../features/stock/stockSlice';
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
        dispatch(searchStocks(searchQuery));
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
    dispatch(setSelectedStock(stock.ticker));
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
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
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
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List>
                {searchResults.map((stock) => (
                  <ListItem
                    key={stock.ticker}
                    onClick={() => handleStockSelect(stock)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemText
                      primary={stock.ticker}
                      secondary={stock.name}
                    />
                  </ListItem>
                ))}
                {searchResults.length === 0 && query && (
                  <ListItem>
                    <ListItemText primary="No results found" />
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
