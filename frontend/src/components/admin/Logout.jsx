import React from 'react';

import api from '../../api';
import useStore from '../../store';

const Header = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </>
  )};

  export default Logout;