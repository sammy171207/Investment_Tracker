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
import Avatar from '@mui/material/Avatar';

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
      <AppBar position="static" sx={{ background: '#181C23', boxShadow: 'none', borderBottom: '1px solid #23272F' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 72 }}>
          {/* Left Side: Logo and Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isTabletOrBelow && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
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
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              <span style={{ fontWeight: 700 }}>WealthTrack</span>
            </Typography>
          </Box>

          {/* Desktop Navigation, Search, and Avatar */}
          {!isTabletOrBelow && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{ color: '#E5E7EB', fontWeight: 500, fontSize: 16, textTransform: 'none', px: 2, borderRadius: 2, '&:hover': { background: '#23272F' } }}
                >
                  {item.title}
                </Button>
              ))}
              <Box sx={{ maxWidth: 260, width: '100%', mx: 2 }}>
                <SearchBox onStockSelect={handleStockSelect} sx={{ borderRadius: 2, background: '#23272F', color: '#E5E7EB' }} />
              </Box>
              <Avatar sx={{ bgcolor: '#374151', width: 40, height: 40, fontWeight: 600 }}>SC</Avatar>
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
        PaperProps={{ sx: { background: '#181C23', color: '#E5E7EB' } }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Search Box */}
      {isTabletOrBelow && (
        <Box sx={{ px: 2, py: 1.5, backgroundColor: '#23272F', boxShadow: 1 }}>
          <SearchBox onStockSelect={handleStockSelect} sx={{ borderRadius: 2, background: '#23272F', color: '#E5E7EB' }} />
        </Box>
      )}
    </>
  );
};

export default Navbar;
