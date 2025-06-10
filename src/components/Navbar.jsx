import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';

const navLinks = [
  { title: 'Dashboard', path: '/' },
  { title: 'Portfolio', path: '/portfolio' },
  { title: 'Compare', path: '/compare' },
  { title: 'Watchlist', path: '/watchlist' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleStockSelect = (symbol) => {
    // Navigate to the stock detail page or update the current view
    navigate(`/stock/${symbol}`);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Typography variant="h6" sx={{ py: 2, fontWeight: 'bold', color: '#2563eb' }}>
        Investment Tracker
      </Typography>
      <List>
        {navLinks.map((item) => (
          <ListItem disablePadding key={item.title}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1e3a8a, #7e22ce)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Side: Logo and Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isTabletOrBelow && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Investment Tracker
            </Typography>
          </Box>

          {/* Desktop Navigation and Search */}
          {!isTabletOrBelow && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  {item.title}
                </Button>
              ))}
              <Box sx={{ maxWidth: 300, width: '100%' }}>
                <SearchBox onStockSelect={handleStockSelect} />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile/Tablet */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Search Box */}
      {isTabletOrBelow && (
        <Box sx={{ px: 2, py: 1.5, backgroundColor: 'white', boxShadow: 1 }}>
          <SearchBox onStockSelect={handleStockSelect} />
        </Box>
      )}
    </>
  );
};

export default Navbar;
