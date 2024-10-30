import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMenuStore from '/src/store/menuStore';
import Svg from '/src/components/shared/Svg';

import logo from '/assets/logo.png';

const Navigation = ({children}) => {
  const { isOpen, toggleMenu } = useMenuStore();

  // Store references to elements using useRef
  const navRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if( isOpen ) {
      navRef.current.style.width = "100%";
      document.body.style.overflowY = 'hidden';
    } else {
      navRef.current.style.width = "0%";
      document.body.style.overflowY = 'auto';
    }
  }, [ isOpen ]);


  // const openNav = () => {
  //   navRef.current.style.width = "100%";
  //   document.body.style.overflowY = 'hidden';
  // };
  // const closeNav = () => {
  //   navRef.current.style.width = "0%";
  //   document.body.style.overflowY = 'auto';
  // };

  return(
    <>
      <Svg className='nav__menu_button' type="menu" onClick={toggleMenu} sizes={[40,40]} />
      <nav ref={navRef}>
        <div className='nav__contents nav__link-style poppins-light'>
          <div className='nav__option'>
            <Link to="/" style={{height: '40px'}}>
              <img src={logo} alt='Cia da Capa' className='logo' />
            </Link>
          </div>
          {/* {children.map((child, index) => (
            // <div className='nav__option' key={index}>
              {child}
            // </div>
          ))} */}
          {children}
        </div>
        <span className="nav__close_button" onClick={toggleMenu} ref={closeButtonRef}>&times;</span>
      </nav>
    </>
  )
};

export default Navigation;