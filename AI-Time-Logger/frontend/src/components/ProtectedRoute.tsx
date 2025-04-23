// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Handle Loading State
  // While the AuthProvider is checking for the token (on initial load),
  // display nothing or a loading spinner. This prevents flashing the login page
  // briefly if the user is actually already logged in.
  if (isLoading) {
    return <div>Loading...</div>; // Or return null, or a spinner component
  }

  // 2. Check Authentication
  // If done loading and the user is authenticated, render the nested route content.
  // <Outlet /> renders the child route element defined in App.tsx.
  if (isAuthenticated) {
    return <Outlet />;
  }

  // 3. Redirect if Not Authenticated
  // If done loading and not authenticated, redirect to the login page.
  // The 'replace' prop prevents adding the login route to the history stack,
  // so the user doesn't get stuck in a loop if they hit the back button.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;