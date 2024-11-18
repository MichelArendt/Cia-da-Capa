// List.jsx

import React from 'react';
import classNames from 'classnames';

import { SmartContentProvider, SmartContentType } from './shared/SmartContentContext';
import SmartContentHeader from './shared/SmartContentHeader';

const List = ({
  children,
  orientation = 'vertical',
  className = '',
  // header,
  headerClassName = '',
}) => {
  const [headerChild, ...bodyChildren] = React.Children.toArray(children);
  // const bodyClass = classNames(
  //   'smart-content__body',
  //   'list__body',
  //   `list__body--${orientation}`,
  //   className
  // );

  return (
    <SmartContentProvider contentType={SmartContentType.List}>
      <div className={`list ${className}`}>
        <div>{headerChild}</div>
        <div className='list__content'>{bodyChildren}</div>
      </div>
    </SmartContentProvider>
  );
};

export default List;
