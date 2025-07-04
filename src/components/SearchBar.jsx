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
import { searchStocksAction, setSelectedStock } from '../features/stock/stockSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.stock);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);
    dispatch(searchStocksAction(value));
  };

  const handleSelect = (stock) => {
    dispatch(setSelectedStock(stock));
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
        InputProps={{
          style: { color: '#F3F4F6' },
        }}
      />
      <Popper
        open={Boolean(anchorEl) && searchResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={0} sx={{ background: '#23272F', color: '#F3F4F6', borderRadius: 2, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
            <List>
              {searchResults.map((stock) => (
                <ListItem
                  key={`${stock.ticker}-${stock.name}`}
                  button
                  onClick={() => handleSelect(stock)}
                  sx={{ '&:hover': { bgcolor: '#1E293B' } }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1" sx={{ color: '#F3F4F6', fontWeight: 600 }}>{stock.ticker}</Typography>
                        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
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