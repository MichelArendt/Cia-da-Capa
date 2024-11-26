import { useAuthManager } from '/src/hooks/authentication/useAuthManager';

const AuthChecker = ({ children }) => {
  useAuthManager(); // Manages authentication logic without re-rendering main components
  return children;
};

export default AuthChecker;