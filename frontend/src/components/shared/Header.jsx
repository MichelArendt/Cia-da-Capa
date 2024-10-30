import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({logo, children}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState('0%'); // Store height as string with %

  const openNav = () => {
    // setMenuHeight(menuIsOpen ? '0%' : '100%'); // Toggle between 0% and 100%
    // setMenuIsOpen(!menuIsOpen);
    // console.log(menuIsOpen ? 'hidden' : 'block'); // Log for debugging
    document.querySelector("nav").style.width = "100%";
    document.body.style.overflowY = ' hidden';
  };
  const closeNav = () => {
    // setMenuHeight(menuIsOpen ? '0%' : '100%'); // Toggle between 0% and 100%
    // setMenuIsOpen(!menuIsOpen);
    // console.log(menuIsOpen ? 'hidden' : 'block'); // Log for debugging
    document.querySelector("nav").style.width = "0%";
  };


  return(
    <header>
      <div className='header__contents'>
        <Link to="/" style={{height: '40px'}}>
          <img src={logo} alt='Cia da Capa' className='logo' />
        </Link>
        {children}
      </div>
    </header>
  )
};

export default Header;