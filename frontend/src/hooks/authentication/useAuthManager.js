import React,  {useEffect} from 'react';
import { useFetchAuthStatus, useLogin } from '/src/services/api/usePublicApi';
import { useLogout } from '/src/services/api/useManageApi';
import queryClient from '/src/services/api/queryClient';
import useAuthStore from '/src/store/authStore';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';

export const useAuthManager = () => {
  useRenderCount(useAuthManager);
  const setCheckingAuth = useAuthStore((state) => state.setCheckingAuth);
  const updateAuthStatus = useAuthStore((state) => state.updateAuthStatus);
  // const { isPending, isFetching, isSuccess, data, isError, error } = useFetchAuthStatus();

  // Fetch authentication status
  const { refetch: fetchAuthStatus } = useFetchAuthStatus({
    onSuccess: (data) => {
      updateAuthStatus(data?.authenticated, null);
      console.log('data?.authenticated: ' + data?.authenticated)
      setCheckingAuth(false);
      console.log(2)
    },
    onError: (error) => {
      console.error('Authentication fetch failed:', error);
      updateAuthStatus(false, error?.message);
      setCheckingAuth(false);
      console.log(3)
    },
    onSettled: () => {
      setCheckingAuth(false);
      console.log(4)
    },
    enabled: false, // Disable automatic fetching
  })

  useEffect(() => {
    setCheckingAuth(true);
    fetchAuthStatus();
    console.log(1)
  }, []);
  // }, [fetchAuthStatus, setCheckingAuth]);




  // if (isCheckingAuth && isSuccess)
  // {
  //   console.log('-- isSuccess, data')
  //   updateAuthStatus(data?.authenticated, null);
  //   console.log('-- authenticated: ' + data?.authenticated + ' on store ' + isAuthenticated);

  //   // setCheckingAuth(false);
  //   console.log('-- FETCHING auth - FINISHED ');
  // }

  // if ((isFetching || isPending) && !isCheckingAuth) {
  //   setCheckingAuth(true);
  //   console.log('-- FETCHING auth - STARTED ');
  // }

  // useEffect(() => {
  //   console.log('-- isFetching, isPending')
  //   if ((isFetching || isPending) && !isCheckingAuth) {
  //     setCheckingAuth(true); // Start checking
  //     console.log('-- FETCHING auth - STARTED ');
  //   } else {
  //     // setCheckingAuth(false); // Start checking
  //     console.log('-- FETCHING auth - FINISHED ');
  //   }
  // }, [isFetching, isPending]);

  // useEffect(() => {
  //   if(isError) {
  //     console.log('-- isError, error')
  //     console.error('Verify auth error: ', error)
  //     isError && updateAuthStatus(false, error?.message);
  //   }
  // }, [isError, error]);

  // useEffect(() => {
  //   if(isSuccess && data) {
  //     console.log('-- isSuccess, data')
  //     updateAuthStatus(data?.authenticated, null);
  //     console.log('-- authenticated: ' + data?.authenticated + ' on store ' + isAuthenticated);
  //   }
  // }, [isSuccess, data]);

  // Login
  const { mutateAsync: login } = useLogin();

  const handleLogin = async (credentials) => {
    try {
      setCheckingAuth(true); // Start checking during login
      const response = await login(credentials);

      if (response?.authenticated) {
        updateAuthStatus(true, null);

        // Invalidate and refetch auth status
        await queryClient.invalidateQueries('authStatus');

        return { success: true, message: 'Login successful' };
      } else {
        updateAuthStatus( false, 'Invalid credentials');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (loginError) {
      console.error('Login failed:', loginError);
      updateAuthStatus( false, loginError.message || 'Login error' );
      return { success: false, message: 'Login error' };
    } finally {
      setCheckingAuth(false); // End checking state
    }
  };

  // Logout
  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    try {
      console.log('-- LOGGING OUT');
      setCheckingAuth(true); // Start checking during logout
      await logout(); // Call the logout API

      console.log('-- UPDATING AUTH STATUS FROM ' + isAuthenticated);
      // Invalidate and refetch auth status
      await queryClient.invalidateQueries('authStatus');
      updateAuthStatus( false, null );
      console.log('TO ' + isAuthenticated);
      return { success: true, message: 'Logout successful' };
    } catch (logoutError) {
      console.error('Logout failed:', logoutError);
      return { success: false, message: 'Logout error' };
    } finally {
      console.log('setCheckingAuth(false)');
      setCheckingAuth(false); // End checking state
    }
  };

  return { handleLogin, handleLogout };
};

export default useAuthManager;