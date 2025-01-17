import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';

// Shared components
import Svg from '/src/components/shared/Svg';
import { SmartContentProvider, SmartContentType } from './shared/SmartContentContext';

// Hooks
import useStore from '/src/store';
// import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices
import useToggleContent from '/src/hooks/useToggleContent'; // Custom hook to detect mobile devices
import { useDynamicPosition } from '/src/hooks/useDynamicPosition'; // Dynamic positioning hook


const Select = ({
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
  const isMobile = useStore((state) => state.isMobile);

  const clickHandler = () => { isMobile ? toggleContent() : undefined}

  // Close the menu whenever the signal changes
  useEffect(() => {
    closeContent();
  }, [closeAllMenusSignal]);

  // Use dynamic positioning only on mobile
  const { ref, style } = useDynamicPosition();

  const selectContentClasses = classNames(
    'select__content',
    { 'select__content--visible': isOpen }
  );

  return (
    <SmartContentProvider contentType={SmartContentType.Select}>
      <div className={`select ${className}`} onClick={clickHandler}>
        <button className={`select__button ${headerClassName}`}>
          {headerChild} {hideArrow ? '' : <Svg type='arrow_drop_down' sizes={[15,15]} />}
        </button>
        <div
          className={`${selectContentClasses} ${contentClassName}`}
          ref={ref}
          style={style} // Apply the dynamic positioning styles
        >
          <div
            className="select__content-wrapper"
            onClick={(e) => e.stopPropagation()} // Stop propagation
          >
            {isMobile && <div className="select__content-title">{mobileContentTitle}</div> }
            {bodyChildren}
          </div>
          {isMobile && <button className="overlay__button overlay__button--close">&times;</button>}
        </div>
      </div>
    </SmartContentProvider>
  );
};

export default Select;
