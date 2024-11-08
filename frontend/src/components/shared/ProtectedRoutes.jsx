import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useStore from '/src/store';

const ProtectedRoutes = ({ children, redirectPath = '/manage/login' }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setLastAttemptedRoute = useStore((state) => state.setLastAttemptedRoute);
  const location = useLocation();

  if (!isAuthenticated) {
    // Only set last attempted route if being redirected to login
    if (location.pathname !== redirectPath) {
      setLastAttemptedRoute(location.pathname);
    }
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoutes;