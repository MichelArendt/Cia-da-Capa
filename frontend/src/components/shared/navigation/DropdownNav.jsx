import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Svg from '/src/components/shared/Svg';

const Dropdown = ({ title = 'Sem Título', sizes, children }) => {

  return(
    <li>
      <button className="dropdown_button">
        <Svg type='arrow_drop_down' sizes={sizes}/>
        <span>{title}</span>
      </button>
      <ul className="dropdown_submenu">
        <div>
          {children.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </div>
      </ul>
    </li>

    // <div className='dropdown__container'>
    //   <span className={`dropdown__btn ${rotate}`} ref={dropdown__btn} onClick={toggleDropdown}>
    //     <Svg type='arrow_drop_down' sizes={sizes}/> <span>{title}</span>
    //   </span>
    //   <ul className={`dropdown__sub_menu ${show}`} ref={dropdown__sub_menu}>
    //     <div>
    //       {children.map((child, index) => (
    //         <li key={index}>{child}</li>
    //       ))}
    //     </div>
    //   </ul>
    // </div>
  )
};

export default Dropdown;