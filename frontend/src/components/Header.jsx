import React from 'react';

import logo from '/assets/logo.png';
import svg_menu from '/assets/svgs/menu.svg';

const Header = () => (
    <header>
      <img src={logo} alt='Cia da Capa' className='logo' />
      <h1>My Website</h1>
    </header>
  );

  export default Header;