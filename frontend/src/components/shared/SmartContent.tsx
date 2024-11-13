
import React, { useState, createContext, useContext, FC, ReactNode } from 'react';

export enum SmartContentType {
  Dropdown = 'dropdown',
  Select = 'select',
  Collapsible = 'collapsible',
  List = 'list',
}

// -------------------------
// CONTEXT
// -------------------------
interface SmartContentContextProps {
  isOpen: boolean;
  toggleOverlay: () => void;
  openOverlay: () => void;
  closeOverlay: () => void;
  contentType: SmartContentType;
  fullScreenOnMobile: boolean;
}

const SmartContentContext = createContext<SmartContentContextProps | undefined>(undefined);

interface SmartContentProps {
  contentType: SmartContentType;
  defaultOpen?: boolean;
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

// -------------------------
// SMART COMPONENT
// -------------------------
const SmartContent: FC<SmartContentProps> = ({
  contentType,
  defaultOpen = false,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOverlay = () => {
    setIsOpen((prev) => !prev);
  };

  const openOverlay = () => {
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
  };

  // Determine if the content should be fullscreen on mobile
  const fullScreenOnMobile =
    contentType === SmartContentType.Dropdown ||
    contentType === SmartContentType.Select;

  const contextValue = {
    isOpen,
    toggleOverlay,
    closeOverlay,
    openOverlay,
    contentType,
    fullScreenOnMobile,
  };


  return (
    <SmartContentContext.Provider value={contextValue}>
      <div className={`smart-content smart-content--${contentType} ${className}`}>
        {children}
      </div>
    </SmartContentContext.Provider>
  );
};

// -------------------------
// HEADER - Optional
// -------------------------
interface SmartContentHeaderProps {
  children: ReactNode;
  className?: string;
}

export const SmartContentHeader: FC<SmartContentHeaderProps> = ({
  children,
  className = '',
}) => {
  const context = useContext(SmartContentContext);
  if (!context) {
    throw new Error('SmartContentHeader must be used within SmartContent');
  }

  const { toggleOverlay, openOverlay, contentType, isOpen } = context;

  // Determine if the header should be clickable
  const isClickable = contentType !== SmartContentType.List;

  // Determine the click handler based on content type
  const clickHandler = () => {
    if (contentType === SmartContentType.Collapsible) {
      toggleOverlay();
    } else {
      openOverlay();
    }
  };

  return (
    <div
      className={`smart-content__header--${contentType} ${className}`}
      onClick={isClickable ? clickHandler : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleOverlay();
              }
            }
          : undefined
      }
    >
      {children}
      {/* SVG Indicator */}
      {isClickable && (
        <span
          className={`smart-content__indicator ${
            isOpen ? 'smart-content__indicator--open' : 'smart-content__indicator--closed'
          }`}
          aria-hidden="true"
        >
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
interface SmartContentBodyProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export const SmartContentBody: FC<SmartContentBodyProps> = ({
  title,
  children,
  className = '',
}) => {
  const context = useContext(SmartContentContext);

  if (!context) {
    throw new Error('SmartContentBody must be used within SmartContent');
  }

  const { contentType, isOpen, fullScreenOnMobile, closeOverlay } = context;

  // Determine if the content should be rendered
  // const shouldRender = true;
  const shouldRender = isOpen || contentType === SmartContentType.List;

  if (!shouldRender) {
    return null;
  }

  // Event handler to close the overlay when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  };

  return fullScreenOnMobile ? (
    <div
      className={`smart-content__overlay`}
      onClick={handleOverlayClick}
    >
      <button
        className="smart-content__close-button"
        onClick={closeOverlay}
        aria-label="Close"
      >
        &times; {/* Or an SVG icon */}
      </button>

      <div
        className={`smart-content__body ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
      >
        {title && <div className="smart-content__title">{title}</div>}
        {children}
      </div>
    </div>
  ) : (
    <div className={`smart-content__body smart-content__body--${contentType} ${className}`}>
      {title && <div className="smart-content__title">{title}</div>}
      {children}
    </div>
  );

  // Conditionally wrap children with SmartContentContainer if contentType is dropdown or select
  const renderContent = () => {
    if (contentType === SmartContentType.Dropdown || contentType === SmartContentType.Select) {
      return (
        <SmartContentContainer>
          {children}
        </SmartContentContainer>
      );
    }
    return children;
  };

  return (
    <div className={`smart-content__body--${contentType} ${className}`}>
      {title && <div className="smart-content__title">{title}</div>}
      {title && <div className="smart-content__title">{title}</div>}
      {renderContent()}
    </div>
  );
};

export default SmartContent;