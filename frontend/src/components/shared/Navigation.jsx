import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Svg from '../Svg';

import logo from '/assets/logo.png';

const Navigation = ({children}) => {
  // Store references to elements using useRef
  const navRef = useRef(null);
  const closeButtonRef = useRef(null);

  const openNav = () => {
    navRef.current.style.width = "100%";
    // closeButtonRef.current.style.visibility = "visible";
    // closeButtonRef.current.style.opacity = "100%";
    // document.body.style.overflowY = ' hidden';
    document.body.style.overflowY = 'hidden';
  };
  const closeNav = () => {
    navRef.current.style.width = "0%";
    // closeButtonRef.current.style.visibility = "hidden";
    // closeButtonRef.current.style.opacity = "0";
    document.body.style.overflowY = 'auto';
  };

  return(
    <>
      <Svg type="menu" onClick={openNav} sizes={[40,40]} />
        <nav className='poppins-light' ref={navRef}>
          <div className='nav__contents'>
            <img src={logo} alt='Cia da Capa' className='logo' />
            {children}
          </div>
          <span className="nav__close_button" onClick={closeNav} ref={closeButtonRef}>&times;</span>
        </nav>
    </>
  )
};

export default Navigation;