import React from 'react';
import useStore from '../../store';

const Header = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return(
    <>
        Produtos Categorias Banner
    </>
  )
};

export default Header;