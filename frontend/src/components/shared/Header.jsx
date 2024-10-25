import React, { useState } from 'react';

import logo from '/assets/logo.png';

const Header = ({children}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState('0%'); // Store height as string with %

  const toggleMenu = () => {
    setMenuHeight(menuIsOpen ? '0%' : '100%'); // Toggle between 0% and 100%
    setMenuIsOpen(!menuIsOpen);
    console.log(menuIsOpen ? 'hidden' : 'block'); // Log for debugging
  };


  return(
    <header>
      <div className='header__contents'>
        <img src={logo} alt='Cia da Capa' className='logo' />
        <span className="material-symbols-outlined header__menu-icon"
          onClick={toggleMenu}>
          menu
        </span>
        <nav >
          {children}
        </nav>
      </div>
    </header>
  )
};

export default Header;