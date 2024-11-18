import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';

import { SmartContentProvider, SmartContentType } from './shared/SmartContentContext';

import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices
import useToggleContent from '/src/hooks/useToggleContent'; // Custom hook to detect mobile devices
import Svg from '/src/components/shared/Svg';
import useStore from '/src/store';


const Dropdown = ({
  children,
  hideArrow = false,
  className = '',
  mobileContentTitle = 'Selecione uma opção:',
  headerClassName = '',
  contentClassName = '',
}) => {
  // Separate header and body content
  const [headerChild, ...bodyChildren] = React.Children.toArray(children);

  const closeAllMenusSignal = useStore((state) => state.closeAllMenusSignal);
  const { isOpen, closeContent, toggleContent } = useToggleContent();
  const isWebsiteMobile = useIsWebsiteMobile();

  const clickHandler = () => { isWebsiteMobile ? toggleContent() : undefined}

  // Close the menu whenever the signal changes
  useEffect(() => {
    closeContent();
  }, [closeAllMenusSignal]);

  const dropdownContentClasses = classNames(
    'dropdown__content',
    { 'dropdown__content--visible': isOpen }
  );

  return (
    <SmartContentProvider contentType={SmartContentType.Dropdown}>
      <div className={`dropdown ${className}`} onClick={clickHandler}>
        <button className="dropdown__button">
          {headerChild} {hideArrow ? '' : <Svg type='arrow_drop_down' sizes={[15,15]} />}
        </button>
        <div className={`${dropdownContentClasses} ${contentClassName}`}>
          <div
            className="dropdown__content-wrapper"
            onClick={(e) => e.stopPropagation()} // Stop propagation
          >
            {isWebsiteMobile && <div className="dropdown__content-title">{mobileContentTitle}</div> }
            {bodyChildren}
          </div>
          {isWebsiteMobile && <button className="overlay__button overlay__button--close">&times;</button>}
        </div>
      </div>
    </SmartContentProvider>
  );
};

export default Dropdown;
