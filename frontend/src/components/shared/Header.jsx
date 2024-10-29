import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from '../Svg';

import logo from '/assets/logo.png';

const Header = ({children}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState('0%'); // Store height as string with %

  const openNav = () => {
    // setMenuHeight(menuIsOpen ? '0%' : '100%'); // Toggle between 0% and 100%
    // setMenuIsOpen(!menuIsOpen);
    // console.log(menuIsOpen ? 'hidden' : 'block'); // Log for debugging
    document.querySelector("nav").style.height = "100%";
  };


  return(
    <header>
      <div className='header__contents'>
        <Link to="/">
          <img src={logo} alt='Cia da Capa' className='logo' />
        </Link>
        <Svg type="menu" onClick={openNav} className='header__menu-button' sizes={[40,40]} />
        <nav className='poppins-light'>
          {children}
        </nav>
      </div>
    </header>
  )
};

export default Header;