// // SmartContentBody.js

// import React, { useContext, useEffect } from 'react';
// import { SmartContentContext, SmartContentType } from './SmartContentContext';
// import useIsMobile from '../../../../hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices
// import classNames from 'classnames';

// const SmartContentBody = ({ children, className = '' }) => {
//   const context = useContext(SmartContentContext);

//   if (!context) {
//     throw new Error('SmartContentBody must be used within a SmartContentProvider');
//   }

//   const { contentType, isOpen, closeContent } = context;
//   const isMobile = useIsMobile();

//   // Disable body scrolling when overlay is open
//   useEffect(() => {
//     if (
//       isOpen &&
//       (contentType === SmartContentType.Slider ||
//         (isMobile && (contentType === SmartContentType.Dropdown || contentType === SmartContentType.Select)))
//     ) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isOpen, contentType, isMobile]);

//   // Construct class names based on BEM conventions
//   const bodyClass = classNames(
//     'smart-content__body',
//     `${contentType}__body`,
//     { [`${contentType}__body--visible`]: isOpen },
//     className
//   );

//   const wrapperClass = classNames(
//     'smart-content__wrapper',
//     `${contentType}__wrapper`,
//     { [`${contentType}__wrapper--visible`]: isOpen }
//   );

//   // For List component
//   if (contentType === SmartContentType.List) {
//     return (
//       <div className={bodyClass}>
//         {children}
//       </div>
//     );
//   }

//   // Mobile Dropdown and Select (no wrapper)
//   if (
//     isMobile &&
//     (contentType === SmartContentType.Dropdown || contentType === SmartContentType.Select)
//   ) {
//     return (
//       <div className={bodyClass}>
//         <div className="smart-content__content">
//           {children}
//           {/* Close button */}
//           <button className="smart-content__close-button" onClick={closeContent}>
//             &times;
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Slider component
//   if (contentType === SmartContentType.Slider) {
//     return (
//       <div className={bodyClass}>
//         <div className="slider__content">
//           {children}
//           {/* Close button */}
//           <button className="smart-content__close-button" onClick={closeContent}>
//             &times;
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Desktop Dropdown, Select, and Collapsible with wrapper
//   return (
//     <div className={wrapperClass}>
//       <div className={bodyClass}>{children}</div>
//     </div>
//   );
// };

// export default SmartContentBody;
