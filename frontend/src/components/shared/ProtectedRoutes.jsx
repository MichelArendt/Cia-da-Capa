import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '/src/store';

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setLastAttemptedRoute = useStore((state) => state.setLastAttemptedRoute);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the current location to redirect after login
    setLastAttemptedRoute(location.pathname + location.search);
    // Redirect to login page
    return <Navigate to="/manage/user/login" />;
  }

  // If authenticated, render the child routes
  return children;
};

export default ProtectedRoutes;
