import React from 'react';

const Header = ({children}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return(
    <>
      {children}
    </>
  )
};

export default Header;