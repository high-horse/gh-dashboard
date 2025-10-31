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
  ListItemButton,
  ListItemIcon,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { useUI } from "@hooks/useUI";

export default function MainLayout() {
  const { loading, authenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);


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
            My Dashboard
          </Typography>
          <ProfileMenu />
          {/* <Button color="inherit" variant="outlined" onClick={handleClick}>
            Logout
          </Button> */}
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
    { path: "/", label: "Home", icon: <HomeIcon />, permissions: [] },
    {
      path: "/gh",
      label: "Github Dashboard",
      icon: <DashboardIcon />,
      permissions: [],
    },
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
          const selected = location.pathname === segment.path;

          return (
            <ListItem key={segment.path} disablePadding>
              <ListItemButton
                component={Link}
                to={segment.path}
                selected={selected}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? "white" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {segment.icon}
                </ListItemIcon>
                <ListItemText primary={segment.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, loading, authenticated, logout } = useAuth();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const {showSnackbar} = useUI();

  const {showDialog} = useConfirmDialog();

  const handleLogout = async () => {
    try {
      showDialog({
        title: "Log Out?",
        message: "Are you sure you want to Log Out ?",
        enableCancel: false,
        onOk: async() => {
          await logout();
        }
      })
    } catch (error) {
      showSnackbar("Something went wrong.", "error")
      console.error(error)
    }
  };

  return (
    <>
      {authenticated && (
        <Box>
          <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
            <Avatar
              alt={user?.username}
              src={user?.profile_pic}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 220, p: 1 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.full_name?.trim() || user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              {user?.phone_number && (
                <Typography variant="body2" color="text.secondary">
                  📞 {user?.phone_number}
                </Typography>
              )}
            </Box>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );
};
