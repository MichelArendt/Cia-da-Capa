// SmartContent.tsx
import React, { useState, createContext, useContext, FC, ReactNode } from 'react';
import classNames from 'classnames';
import useIsMobile from '../../hooks/useIsWebsiteMobile'; // Import the custom hook from your specified path

// Enumeration for content types
export enum SmartContentType {
  Dropdown = 'dropdown',     // Fullscreen overlay only on mobile
  Select = 'select',         // Fullscreen overlay only on mobile
  Collapsible = 'collapsible', // Never fullscreen
  List = 'list',             // Never fullscreen, can be displayed horizontally or vertically
  Slider = 'slider',         // Always fullscreen
}

// -------------------------
// CONTEXT
// -------------------------

// Context interface
interface SmartContentContextProps {
  isOpen: boolean;
  // Overlay content functions
  toggleOverlay?: () => void;
  openOverlay?: () => void;
  closeOverlay?: () => void;
  // Non-overlay content functions
  toggleContent?: () => void;
  openContent?: () => void;
  closeContent?: () => void;
  contentType: SmartContentType;
  isOverlay: boolean;
  isFullscreen: boolean;
  isFullscreenOnMobile: boolean;
  slideDirection?: 'left' | 'right' | 'top' | 'bottom'; // Direction for Slider
  orientation?: 'vertical' | 'horizontal'; // For List content type
}

// Create the context
const SmartContentContext = createContext<SmartContentContextProps | undefined>(undefined);

// -------------------------
// SMART CONTENT COMPONENT
// -------------------------

// Props for SmartContent component
interface SmartContentProps {
  contentType: SmartContentType;
  defaultOpen?: boolean;
  slideDirection?: 'left' | 'right' | 'top' | 'bottom'; // Direction for Slider
  orientation?: 'vertical' | 'horizontal'; // For List content type
  children: ReactNode;
  className?: string;
}

// SmartContent component
const SmartContent: FC<SmartContentProps> = ({
  contentType,
  defaultOpen = false,
  slideDirection = 'right', // Default slide direction
  orientation = 'vertical', // Default orientation for List
  children,
  className = '',
}) => {
  // State to track if the content is open
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Function to prevent background scrolling when overlay is open
  const setBodyOverflowY = (isEnabled: boolean) => {
    document.body.style.overflowY = isEnabled ? 'hidden' : 'auto';
  };

  // Determine if the content should be overlay
  const isOverlay =
    contentType === SmartContentType.Slider ||
    contentType === SmartContentType.Dropdown ||
    contentType === SmartContentType.Select;

  // Determine if the content should always be fullscreen
  const isFullscreen = contentType === SmartContentType.Slider;

  // Determine if the content should be fullscreen only on mobile devices
  const isFullscreenOnMobile =
    contentType === SmartContentType.Dropdown ||
    contentType === SmartContentType.Select;

  // -------------------------
  // Functions for Overlay Content Types
  // -------------------------

  // Function to open the overlay content
  const openOverlay = () => {
    setIsOpen(true);
    setBodyOverflowY(true);
  };

  // Function to close the overlay content
  const closeOverlay = () => {
    setIsOpen(false);
    setBodyOverflowY(false);
  };

  // Function to toggle the overlay content
  const toggleOverlay = () => {
    if (isOpen) {
      closeOverlay();
    } else {
      openOverlay();
    }
  };

  // -------------------------
  // Functions for Non-Overlay Content Types
  // -------------------------

  // Function to open the non-overlay content
  const openContent = () => {
    setIsOpen(true);
  };

  // Function to close the non-overlay content
  const closeContent = () => {
    setIsOpen(false);
  };

  // Function to toggle the non-overlay content
  const toggleContent = () => {
    setIsOpen((prev) => !prev);
  };

  // Context value to provide to child components
  const contextValue: SmartContentContextProps = {
    isOpen,
    contentType,
    isOverlay,
    isFullscreen,
    isFullscreenOnMobile,
    slideDirection,
    orientation,
    // Assign appropriate functions based on content type
    ...(isOverlay
      ? {
          openOverlay,
          closeOverlay,
          toggleOverlay,
        }
      : {
          openContent,
          closeContent,
          toggleContent,
        }),
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

export default SmartContent;

// -------------------------
// SMART CONTENT HEADER COMPONENT
// -------------------------

// Interface for SmartContentHeader props
interface SmartContentHeaderProps {
  hideArrow?: boolean;
  children: ReactNode;
  className?: string;
}

// SmartContentHeader component
export const SmartContentHeader: FC<SmartContentHeaderProps> = ({
  hideArrow = false,
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
  const {
    contentType,
    isOpen,
    toggleOverlay,
    openOverlay,
    toggleContent,
    openContent,
  } = context;

  // Use the custom hook to determine if the device is mobile
  const isMobile = useIsMobile();

  // Determine if the header should be clickable
  const isClickable =
    contentType !== SmartContentType.List &&
    (isMobile || contentType === SmartContentType.Collapsible);

  // Click handler based on content type and device type
  let clickHandler: (() => void) | undefined;

  if (contentType === SmartContentType.Collapsible) {
    clickHandler = toggleContent;
  } else if (contentType === SmartContentType.List) {
    clickHandler = undefined; // Not clickable
  } else if (isMobile) {
    // Assign click handler on mobile for Dropdown and Select
    clickHandler = openOverlay;
  } else {
    clickHandler = undefined; // Prevent click handler on desktop
  }

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
                if (clickHandler) {
                  clickHandler();
                }
              }
            }
          : undefined
      }
    >
      {children}

      {/* Display the indicator if the header is clickable and hideArrow is false */}
      {contentType !== SmartContentType.List && !hideArrow && (
        <span className={indicatorClass} aria-hidden="true">
          ▼
        </span>
      )}
    </div>
  );
};

// -------------------------
// SMART CONTENT BODY COMPONENT
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
    isOverlay,
    isFullscreen,
    isFullscreenOnMobile,
    closeOverlay,
    slideDirection,
    orientation,
  } = context;

  // Use the custom hook to determine if the device is mobile
  const isMobile = useIsMobile();

  // **Always wrap content for Dropdown and Select to control visibility**
  const needsWrapper = isOverlay || contentType === SmartContentType.Collapsible;

  // Determine if we should show the visible class
  const shouldShowVisibleClass =
    (isOpen && isMobile) || // Show when open on mobile
    (contentType === SmartContentType.Collapsible && isOpen) || // For Collapsible
    (contentType === SmartContentType.Slider && isOpen); // For Slider

  // Generate class names for the outer wrapper
  const outerClass = classNames(
    'smart-content__wrapper',
    `smart-content__wrapper--${contentType}`,
    {
      'smart-content__wrapper--visible': shouldShowVisibleClass,
      'smart-content__overlay': isOverlay && (isMobile || isFullscreen),
      'smart-content__fullscreen': isFullscreen,
      'smart-content__fullscreen--mobile': isFullscreenOnMobile,
      [`smart-content__slider--${slideDirection}`]: contentType === SmartContentType.Slider,
    },
    className
  );

  // Class name for the inner content
  const innerClass = classNames('smart-content__body', {
    [`smart-content__body--${orientation}`]: contentType === SmartContentType.List,
  });

  // Event handler to close the overlay when clicking outside (for overlay content)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (closeOverlay) closeOverlay();
    }
  };

  // Render wrapped content for collapsible and overlay types
  if (needsWrapper) {
    return (
      <div
        className={outerClass}
        onClick={isOverlay && (isMobile || isFullscreen) ? handleOverlayClick : undefined}
      >
        {/* Close button for overlay content */}
        {isOverlay && (isMobile || isFullscreen) && closeOverlay && (
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
            isOverlay && (isMobile || isFullscreen)
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
