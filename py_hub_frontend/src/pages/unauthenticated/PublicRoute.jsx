import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useAuth } from "@hooks/useAuth";

export default function PublicRoute() {
  const { loading, authenticated } = useAuth();

  if (loading) return null; // or a spinner if you want

  if (authenticated) {
    // If logged in, redirect away from login page
    return <Navigate to="/" replace />;
  }

  // Not authenticated, show login page or nested routes
  return <Outlet />;
}
