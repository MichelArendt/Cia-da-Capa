// Collapsible.jsx

import React from 'react';
import { SmartContentProvider, SmartContentType } from './shared/SmartContentContext';
import SmartContentHeader from './shared/SmartContentHeader';
import SmartContentBody from './shared/SmartContentBody';

const Collapsible = ({
  children,
  hideArrow = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  // Separate header and body content
  const [headerChild, ...bodyChildren] = React.Children.toArray(children);

  return (
    <SmartContentProvider contentType={SmartContentType.Collapsible}>
      <div className={`collapsible smart-content ${className}`}>
        <SmartContentHeader hideArrow={hideArrow} className={headerClassName}>
          {headerChild}
        </SmartContentHeader>
        <SmartContentBody className={bodyClassName}>{bodyChildren}</SmartContentBody>
      </div>
    </SmartContentProvider>
  );
};

export default Collapsible;
