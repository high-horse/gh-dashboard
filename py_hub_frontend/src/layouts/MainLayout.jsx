// import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth"; // your auth hook
import { CircularProgress, Box } from "@mui/material";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function MainLayout() {
  const { loading, authenticated,logout } = useAuth();

  const handleClick = async () => {
    await logout();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleClick}>Logout</Button>
        </Toolbar>
      </AppBar>


      {/* 👇 This is where your page (Home/About/etc.) renders */}
      <Box p={2}>
        <Outlet />
      </Box>
    </Box>
  );
}