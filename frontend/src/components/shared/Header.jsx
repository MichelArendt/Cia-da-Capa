import React from 'react';

import logo from '/assets/logo.png';
import svg_menu from '/assets/svgs/menu.svg';

const Header = ({children}) => {
  return(
    <header>
      <div className='header__contents'>
        <img src={logo} alt='Cia da Capa' className='logo' />
        {children}
      </div>
    </header>
  )
};

export default Header;