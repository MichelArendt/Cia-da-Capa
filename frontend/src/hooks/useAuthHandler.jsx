import useStore from '/src/store';
import { useNavigate } from 'react-router-dom';

export const useAuthHandler = () => {
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const clearLastAttemptedRoute = useStore((state) => state.clearLastAttemptedRoute);
  const navigate = useNavigate();
  const lastAttemptedRoute = useStore((state) => state.lastAttemptedRoute);

  const handleAuthSuccess = (isAuthenticated = false) => {
    if(isAuthenticated){
      setAuthenticated(true);
      clearLastAttemptedRoute();
      navigate(lastAttemptedRoute || '/manage');
    }
  };

  return { handleAuthSuccess };
};