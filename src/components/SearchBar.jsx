import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Typography,
  Popper,
  ClickAwayListener
} from '@mui/material';
import { searchStocks, setSelectedStock } from '../features/stock/stockSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.stock);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);
    dispatch(searchStocks(value));
  };

  const handleSelect = (ticker) => {
    dispatch(setSelectedStock(ticker));
    setSearchTerm('');
    setAnchorEl(null);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={handleSearch}
        size="small"
      />
      <Popper
        open={Boolean(anchorEl) && searchResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={3}>
            <List>
              {searchResults.map((stock) => (
                <ListItem
                  key={stock.ticker}
                  button
                  onClick={() => handleSelect(stock.ticker)}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1">{stock.ticker}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stock.name}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar; 