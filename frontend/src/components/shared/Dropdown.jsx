import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from '../Svg';

const Dropdown = ({sizes = [20, 20], title = "", children}) => {
  return(
    <>
      <Svg type="arrow_drop_down" sizes={sizes} /> {title}
      <ul className='dropdown'>
        {children.map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </>
  )
};

export default Dropdown;