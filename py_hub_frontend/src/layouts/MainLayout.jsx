import * as React from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth"; // your auth hook
import {
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function MainLayout() {
  const { loading, authenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClick = async () => {
    await logout();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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

  // Sidebar content

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleClick}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <LocalDrawer toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

const LocalDrawer = ({ toggleDrawer }) => {
  const location = useLocation();
  const segments = [
    { path: "/", label: "Home", permissions: [] },
    { path: "/gh", label: "Github Dashboard", permissions: [] },
    { path: "/repos", label: "Repos", permissions: [] },
    { path: "/about", label: "About", permissions: [] },
  ];

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ m: 2 }}>
        Menu
      </Typography>
      <Divider />
      <List>
        {segments.map((segment) => {
          const selected = location.pathname === segment.path; // check if current path matches
          return (
            <ListItem
              button
              key={segment.path}
              component={Link}
              to={segment.path}
              selected={selected} // MUI prop that highlights selected item
            >
              <ListItemText primary={segment.label} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
