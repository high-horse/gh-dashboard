import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // your auth hook
import { CircularProgress, Box } from "@mui/material";

export default function MainLayout() {
  const { loading, authenticated } = useAuth();

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
    <div>
      {/* Your main layout UI: header, sidebar, etc */}
      <header>Main Navigation</header>

      {/* Render nested routes */}
      <Outlet />
    </div>
  );
}