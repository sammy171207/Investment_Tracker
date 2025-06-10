import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Portfolio', icon: <BarChartIcon />, path: '/portfolio' },
  { text: 'Compare', icon: <ListAltIcon />, path: '/compare' },
  { text: 'Watchlist', icon: <StarIcon />, path: '/watchlist' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Only show on md and up

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Do not render sidebar on small screens
  if (!isDesktop) return null;

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isOpen ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #1e3a8a, #7e22ce)',
          color: 'white',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: isOpen ? 'flex-end' : 'center', p: 1 }}>
        <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List>
        {navItems.map((item) => (
          <ListItem
            button={true}
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              py: 1,
              px: isOpen ? 2 : 1,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Tooltip title={isOpen ? '' : item.text} placement="right">
              <ListItemIcon sx={{ color: 'white', minWidth: 'unset', mr: isOpen ? 2 : 'auto' }}>
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {isOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
