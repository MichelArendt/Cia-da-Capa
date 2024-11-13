import { useState } from 'react';
import React from 'react';

export function Dropdown ({children}) {
	// Animation
  const [showList, setShowList] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const toggleAnimation = () => {
    // Temporarily remove show-list class to reset animation
    setTriggerAnimation(false);
    setTimeout(() => {
      setTriggerAnimation(true); // Reapply show-list class after delay
      setShowList((prev) => !prev);
    }, 10); // Small delay to reset animation
  };

 return (
   <div className='dropdown'>
    {React.Children.map(children, (child) => {
      // Pass `toggleAnimation`, `showList`, and `triggerAnimation` to each child
      return React.cloneElement(child, { toggleAnimation, triggerAnimation });
    })}
   </div>
 );
}

export function DropdownHeader ({toggleAnimation, children}) {
  return (
    <button className='header' onClick={toggleAnimation}>
      {children}
    </button>
  );
}

export function DropdownSubmenu ({children, triggerAnimation}) {

  return (
    <div className={`submenu ${triggerAnimation  ? 'show-list' : ''}`}>
      {React.Children.map(children, (child, index) => {
        // Each child gets an incrementing delay based on its index
        const delay = `${index * 0.1}s`; // Adjust `0.1s` as needed for the delay interval
        return React.cloneElement(child, {
          style: { animationDelay: delay },
        });
      })}
    </div>
  );
}

// export function DropdownOption ({children, style}) {
//   return (
//     <div className='option' style={style}>
//       {children}
//     </div>
//   );
// }

export default Dropdown;