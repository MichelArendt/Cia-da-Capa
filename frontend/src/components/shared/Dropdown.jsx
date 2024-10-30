import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from '../Svg';

const Dropdown = ({sizes = [20, 20], title = "", children}) => {
  const dropdown__sub_menu = useRef(null)
  const [show, setShow] = useState('')

  const toggleDropdown = () => {
    show == '' ? setShow('show') : setShow('');
  }

  return(
    <>
      <button className='dropdown__btn' onClick={toggleDropdown}>
        <Svg type="arrow_drop_down" sizes={sizes}/> {title}
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