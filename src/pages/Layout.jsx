import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#181C23' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{
          p: { xs: 1, sm: 2, md: 4 },
          minWidth: '100vw',
          minHeight: 'calc(100vh - 72px)',
          backgroundColor: '#181C23',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <Box sx={{
            width: '100%',
            maxWidth: 1400,
            background: '#23272F',
            borderRadius: 4,
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
            p: { xs: 2, sm: 4 },
            minHeight: '80vh',
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
