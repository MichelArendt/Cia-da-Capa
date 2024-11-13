import React, { useState } from 'react';

export function Option ({toggleable = false, children}) {
  const [selectedClass, setSelectedclass] = useState('');

  const extraClasses = toggleable ? 'toggle' : '';

  const unselect = () => {
    setSelectedclass('');
  }

  const select = () => {
    setSelectedclass('selected');
  }

  return (
    <div
    className={`option ${extraClasses} ${selectedClass}`}
    onClick={select}>
      {children}
    </div>
  );
}

export default Option;