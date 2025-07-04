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
import Avatar from '@mui/material/Avatar';

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
          background: '#181C23',
          color: '#E5E7EB',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          borderRight: '1px solid #23272F',
          borderRadius: '18px',
          margin: '12px 0 12px 12px',
          minHeight: 'calc(100vh - 24px)',
        },
      }}
    >
      {/* User Avatar and Name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, mb: 2, borderBottom: '1px solid #23272F' }}>
        <Avatar sx={{ bgcolor: '#374151', width: 56, height: 56, fontWeight: 600, mb: 1 }}>SC</Avatar>
        {isOpen && <Box sx={{ fontWeight: 600, fontSize: 16, color: '#E5E7EB' }}>Sophia Carter</Box>}
      </Box>

      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: isOpen ? 'flex-end' : 'center', p: 1 }}>
        <IconButton onClick={toggleDrawer} sx={{ color: '#E5E7EB' }}>
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
              py: 1.5,
              px: isOpen ? 2 : 1,
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              '&:hover': { backgroundColor: '#23272F' },
            }}
          >
            <Tooltip title={isOpen ? '' : item.text} placement="right">
              <ListItemIcon sx={{ color: '#E5E7EB', minWidth: 'unset', mr: isOpen ? 2 : 'auto' }}>
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
