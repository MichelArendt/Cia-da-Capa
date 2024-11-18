// SmartContentHeader.js

import React, { useContext } from 'react';
import { SmartContentContext, SmartContentType } from './SmartContentContext';
import useIsMobile from '../../../../hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices
import classNames from 'classnames';

const SmartContentHeader = ({ children, hideArrow = false, className = '' }) => {
  const context = useContext(SmartContentContext);

  if (!context) {
    throw new Error('SmartContentHeader must be used within a SmartContentProvider');
  }

  const { contentType, isOpen, toggleContent } = context;
  const isMobile = useIsMobile();

  // Determine if the header should be clickable
  const isClickable =
    contentType !== SmartContentType.List &&
    (isMobile ||
      contentType === SmartContentType.Collapsible ||
      contentType === SmartContentType.Slider);

  const headerClass = classNames(
    'smart-content__header',
    `${contentType}__header`,
    className
  );

  const indicatorClass = classNames('smart-content__indicator', {
    'smart-content__indicator--open': isOpen,
    'smart-content__indicator--closed': !isOpen,
  });

  const clickHandler = isClickable ? toggleContent : undefined;

  return (
    <div
      className={headerClass}
      onClick={clickHandler}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
      {!hideArrow && contentType !== SmartContentType.List && (
        <span className={indicatorClass} aria-hidden="true">
          ▼
        </span>
      )}
    </div>
  );
};

export default SmartContentHeader;
