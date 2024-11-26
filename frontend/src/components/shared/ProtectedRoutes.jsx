import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';

// Authorization
import useAuthStore from '/src/store/authStore';

// Shared components
import ContentLoader from '/src/components/shared/ContentLoader.jsx'

const ProtectedRoutes = ({ children }) => {
  useRenderCount(ProtectedRoutes);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const setLastAttemptedRoute = useAuthStore((state) => state.setLastAttemptedRoute);
  const location = useLocation();

  console.log('-------------------------------- ');

  if (isCheckingAuth) {
    return <ContentLoader displayMessage="Verificando autenticação..." />;
  }

  if (isAuthenticated === false) {
    setLastAttemptedRoute(location);
    return <Navigate to="/manage/user/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoutes;
