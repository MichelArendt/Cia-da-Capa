import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from './Svg';

const Dropdown = ({sizes, title = "", svg = '', children}) => {
  const dropdown__container = useRef(null)
  const dropdown__btn = useRef(null)
  const dropdown__sub_menu = useRef(null)
  const [open, setOpen] = useState('')
  const [show, setShow] = useState('')
  const [rotate, setRotate] = useState('')


  // functional updates (prev => ...) to ensure state is based on the previous value
  const toggleDropdown = () => {
    setShow((prev) => (prev === '' ? 'show' : ''));
    setRotate((prev) => (prev === '' ? 'rotate' : ''));
    // setOpen((prev) => (prev === '' ? 'open' : ''));
  };

  return(
    <div className='dropdown__container'>
      <span className={`dropdown__btn ${rotate}`} ref={dropdown__btn} onClick={toggleDropdown}>
        <Svg type='arrow_drop_down' sizes={sizes}/> <span>{title}</span>
      </span>
      <ul className={`dropdown__sub_menu ${show}`} ref={dropdown__sub_menu}>
        <div>
          {children.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </div>
      </ul>
    </div>
  )
};

export default Dropdown;