import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from '../Svg';

const Dropdown = ({sizes = [20, 20], title = "", svg = '', children}) => {
  const dropdown__btn = useRef(null)
  const dropdown__sub_menu = useRef(null)
  const [show, setShow] = useState('')
  const [rotate, setRotate] = useState('')


  // functional updates (prev => ...) to ensure state is based on the previous value
  const toggleDropdown = () => {
    setShow((prev) => (prev === '' ? 'show' : ''));
    setRotate((prev) => (prev === '' ? 'rotate' : ''));
  };

  return(
    <>
      <button className={`dropdown__btn ${rotate}`} ref={dropdown__btn} onClick={toggleDropdown}>
        <Svg type={svg} sizes={sizes}/> {title} <Svg type='arrow_drop_down' sizes={sizes}/>
      </button>
      <ul className={`dropdown__sub_menu ${show}`} ref={dropdown__sub_menu}>
        <div>
          {children.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </div>
      </ul>
    </>
  )
};

export default Dropdown;