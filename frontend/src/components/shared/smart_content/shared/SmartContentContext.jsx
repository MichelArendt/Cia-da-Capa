// SmartContentContext.js

import React, { createContext, useState } from 'react';

// Enumeration for component types
export const SmartContentType = {
  Dropdown: 'dropdown',
  Select: 'select',
  Collapsible: 'collapsible',
  List: 'list',
  Slider: 'slider',
};

// Create a context for sharing state
export const SmartContentContext = createContext(null);

// Provider component to manage open/close state
export const SmartContentProvider = ({ contentType, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Functions to control the content state
  const openContent = () => setIsOpen(true);
  const closeContent = () => setIsOpen(false);
  const toggleContent = () => setIsOpen((prev) => !prev);

  return (
    <SmartContentContext.Provider
      value={{ isOpen, openContent, closeContent, toggleContent, contentType }}
    >
      {children}
    </SmartContentContext.Provider>
  );
};
