import React from 'react';

import api from '../../api';
import useStore from '../../store';

import logo from '/assets/logo.png';

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
    <header>




      {/* <img src={logo} alt='Cia da Capa' className='logo' />
      {isAuthenticated && (
        <button onClick={handleLogout}>Logout</button>
      )}
      <div className='header__menu'>
        <button className={`svg-icon ${isAuthenticated ? '' : 'mouse-disabled'}`}>
          <span className="material-symbols-outlined header__menu-icon">
            menu
          </span>
        </button>
      </div> */}
    </header>
  )};

  export default Header;