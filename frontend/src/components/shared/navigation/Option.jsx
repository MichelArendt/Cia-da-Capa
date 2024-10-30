import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Option = ({children}) => {
  const [open, setOpen] = useState('')


  // functional updates (prev => ...) to ensure state is based on the previous value
  const navigationClicked = () => {
    setOpen((prev) => (prev === '' ? 'open' : ''));
  };

  return(
    <>
      <div className={`nav__option ${open}`} onClick={navigationClicked}>
        {children}
      </div>
    </>
  )
};

export default Option;