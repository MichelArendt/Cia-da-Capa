import React from 'react';
import useStore from '../../store';

const Header = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return(
    <>
        PRODUTOS CATEGORIAS BANNER
    </>
  )
};

export default Header;