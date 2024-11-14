
import React, { useState, createContext, useContext, FC, ReactNode } from 'react';
import classNames from 'classnames';

// Enumeration for content types
export enum SmartContentType {
  Dropdown = 'dropdown',
  Select = 'select',
  Collapsible = 'collapsible',
  List = 'list',
}

// -------------------------
// CONTEXT
// -------------------------

// Context interface
interface SmartContentContextProps {
  isOpen: boolean;
  toggleOverlay: () => void;
  openOverlay: () => void;
  closeOverlay: () => void;
  contentType: SmartContentType;
  fullScreenOnMobile: boolean;
}

// Create the context
const SmartContentContext = createContext<SmartContentContextProps | undefined>(undefined);

// -------------------------
// SMART COMPONENT
// -------------------------

// Props for SmartContent component
interface SmartContentProps {
  contentType: SmartContentType;
  defaultOpen?: boolean;
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

// SmartContent component
const SmartContent: FC<SmartContentProps> = ({
  contentType,
  defaultOpen = false,
  children,
  className = '',
}) => {
  // State to track if the content is open
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Function to toggle the content open/closed
  const toggleOverlay = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to open the content
  const openOverlay = () => {
    setIsOpen(true);
  };

  // Function to close the content (may be used by Zustand store later)
  const closeOverlay = () => {
    setIsOpen(false);
  };

  // Determine if the content should be full-screen on mobile devices
  const fullScreenOnMobile =
    contentType === SmartContentType.Dropdown ||
    contentType === SmartContentType.Select;

  // Context value to provide to child components
  const contextValue = {
    isOpen,
    toggleOverlay,
    closeOverlay,
    openOverlay,
    contentType,
    fullScreenOnMobile,
  };

  // Generate class names for the smart-content container
  const smartContentClass = classNames(
    'smart-content',
    `smart-content--${contentType}`,
    className
  );
  return (
    <SmartContentContext.Provider value={contextValue}>
      <div className={smartContentClass}>{children}</div>
    </SmartContentContext.Provider>
  );
};

// -------------------------
// HEADER - Optional
// -------------------------

// Interface for SmartContentHeader props
interface SmartContentHeaderProps {
  hideDropdownArrow: boolean;
  children: ReactNode;
  className?: string;
}

// SmartContentHeader component
export const SmartContentHeader: FC<SmartContentHeaderProps> = ({
  hideDropdownArrow = false,
  children,
  className = '',
}) => {
  // Access the SmartContent context
  const context = useContext(SmartContentContext);

  // Ensure the component is used within SmartContent
  if (!context) {
    throw new Error('SmartContentHeader must be used within SmartContent');
  }

  // Destructure necessary values from context
  const { toggleOverlay, openOverlay, contentType, isOpen } = context;

  // Determine if the header should be clickable
  const isClickable = contentType !== SmartContentType.List;

  // Click handler based on content type
  const clickHandler = () => {
    if (contentType === SmartContentType.Collapsible) {
      toggleOverlay();
      console.log(isOpen)
    } else {
      openOverlay();
    }
  };

  // Generate class names for the header
  const headerClass = classNames(
    'smart-content__header',
    `smart-content__header--${contentType}`,
    className
  );

  // Generate class names for the indicator
  const indicatorClass = classNames('smart-content__indicator', {
    'smart-content__indicator--open': isOpen,
    'smart-content__indicator--closed': !isOpen,
  });

  return (
    <div
      className={headerClass}
      onClick={isClickable ? clickHandler : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clickHandler();
              }
            }
          : undefined
      }
    >
      {children}

      {/* Display the indicator if the header is clickable */}
      {isClickable && !hideDropdownArrow && (
        <span className={indicatorClass} aria-hidden="true">
          ▼
        </span>
      )}
    </div>
  );
};

// -------------------------
// BODY WRAPPER COMPONENT
// -------------------------
interface SmartContentContainerProps {
  children: ReactNode;
  className?: string;
}

const SmartContentContainer: FC<SmartContentContainerProps> = ({ children, className = '' }) => {
  return <div className={`smart-content__container ${className}`}>{children}</div>;
};


// -------------------------
// BODY COMPONENT
// -------------------------


// Interface for SmartContentBody props
interface SmartContentBodyProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

// SmartContentBody component
export const SmartContentBody: FC<SmartContentBodyProps> = ({
  title,
  children,
  className = '',
}) => {
  // Access the SmartContent context
  const context = useContext(SmartContentContext);

  // Ensure the component is used within SmartContent
  if (!context) {
    throw new Error('SmartContentBody must be used within SmartContent');
  }

  // Destructure necessary values from context
  const {
    contentType,
    isOpen,
    fullScreenOnMobile,
    closeOverlay,
  } = context;

  // Determine if the content is collapsible
  const isCollapsible = contentType === SmartContentType.Collapsible;

  // Determine if we need to wrap the content (for collapsible or overlay content)
  const needsWrapper = isCollapsible || fullScreenOnMobile;

  // Generate class names for the outer wrapper
  const outerClass = classNames(
    'smart-content__wrapper', // Base wrapper class
    {
      [`smart-content__wrapper--${contentType}`]: isCollapsible || fullScreenOnMobile, // Modifier for content type
      [`smart-content__wrapper--${contentType}--visible`]: isCollapsible && isOpen, // Visible state
      'smart-content__overlay': fullScreenOnMobile, // Overlay class for full-screen content
      'smart-content__overlay--visible': fullScreenOnMobile && isOpen, // Visible state
    },
    className // Additional class names passed in props
  );

  // Class name for the inner content
  const innerClass = 'smart-content__body';

  // Event handler to close the overlay when clicking outside (for overlay content)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  };

  // Render wrapped content for collapsible and overlay types
  if (needsWrapper) {
    return (
      <div
        className={outerClass}
        onClick={fullScreenOnMobile ? handleOverlayClick : undefined}
      >
        {/* Close button for overlay content */}
        {fullScreenOnMobile && (
          <button
            className="smart-content__close-button"
            onClick={closeOverlay}
            aria-label="Close"
          >
            &times;
          </button>
        )}
        <div
          className={innerClass}
          onClick={
            fullScreenOnMobile
              ? (e) => e.stopPropagation() // Prevent closing when clicking inside the content
              : undefined
          }
        >
          {title && <div className="smart-content__title">{title}</div>}
          {children}
        </div>
      </div>
    );
  }

  // Render content without wrapper for other types
  return (
    <div className={`${innerClass} ${className}`}>
      {title && <div className="smart-content__title">{title}</div>}
      {children}
    </div>
  );
};

export default SmartContent;