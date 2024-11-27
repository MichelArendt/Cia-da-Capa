import React, {useEffect} from 'react';

import { useAuthManager } from '/src/hooks/authentication/useAuthManager';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';
import useWhyDidYouRender from '/src/hooks/debug/useWhyDidYouRender';

// Stores
import useAuthStore from '/src/store/authStore';

const AuthChecker = ({ children }) => {
  useRenderCount(AuthChecker);
  // useWhyDidYouRender(AuthChecker);
  const setCheckingAuth = useAuthStore((state) => state.setCheckingAuth);
  const { checkUserAuthStatus } = useAuthManager();

  useEffect(() => {
    const invokeAuthCheck = async () => {
      try {
        await checkUserAuthStatus(); // Call the async function
      } catch (error) {
        console.error('Error during auth check:', error);
      }
    };

    invokeAuthCheck();
  }, []);



  // useAuthManager(); // Manages authentication logic without re-rendering main components
  return children;
};

export default AuthChecker;