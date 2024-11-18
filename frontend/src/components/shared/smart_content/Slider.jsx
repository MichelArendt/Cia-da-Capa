// Slider.jsx

import React, { useEffect } from 'react';
import classNames from 'classnames';

import { SmartContentProvider, SmartContentType } from './shared/SmartContentContext';
import SmartContentHeader from './shared/SmartContentHeader';
import SmartContentBody from './shared/SmartContentBody';
import Svg from '/src/components/shared/Svg';
import useStore from '/src/store';
import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices
import useToggleContent from '/src/hooks/useToggleContent'; // Custom hook to detect mobile devices

const Slider = ({
  children,
  slideInFromDirection = 'right', // Default slide direction
  className = '',
  mobileContentTitle = 'Selecione uma opção:',
  headerClassName = '',
  bodyClassName = '',
  contentClassName = '',
}) => {
  // Separate header and body content
  const [headerChild, ...bodyChildren] = React.Children.toArray(children);

  const closeAllMenusSignal = useStore((state) => state.closeAllMenusSignal);
  const { isOpen, closeContent, toggleContent } = useToggleContent();
  const isWebsiteMobile = useIsWebsiteMobile();

  const clickHandler = () => { toggleContent()}

  // Close the menu whenever the signal changes
  useEffect(() => {
    closeContent();
  }, [closeAllMenusSignal]);

  const sliderContentClasses = classNames(
    'slider__content',
    `slider__content--${slideInFromDirection}`,
    { 'slider__content--visible': isOpen }
  );

  return (
    <SmartContentProvider contentType={SmartContentType.Slider}>
      <div className={`slider ${className}`} onClick={clickHandler}>
        <button className={`slider__button ${headerClassName}`}>
          {headerChild}
        </button>
        <div className={`${sliderContentClasses} ${contentClassName}`}>
          <div
            className="slider__content-wrapper"
            onClick={(e) => e.stopPropagation()} // Stop propagation
          >
            {isWebsiteMobile && <div className="slider__content-title">{mobileContentTitle}</div> }
            {bodyChildren}
            <button className="overlay__button overlay__button--close"  onClick={clickHandler}>&times;</button>
          </div>
          {isWebsiteMobile ? (
            <>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </SmartContentProvider>
  );
};

export default Slider;
