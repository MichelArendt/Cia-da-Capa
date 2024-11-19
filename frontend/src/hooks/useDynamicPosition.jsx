import { useState, useEffect, useRef } from 'react';
// import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Detects mobile view

// Hooks
import useStore from '/src/store';

export function useDynamicPosition() {
  const elementRef = useRef(null);
  const [style, setStyle] = useState({ left: 0 }); // Default to `left: 0`
  const isMobile = useStore((state) => state.isMobile);

  useEffect(() => {
    // Only apply positioning calculations on desktop
    if (isMobile || !elementRef.current) return;

    const updatePosition = () => {
      const rect = elementRef.current.getBoundingClientRect();
      const newStyle = {};

      // If the dropdown overflows on the right, align to the right
      if (rect.right > window.innerWidth) {
        newStyle.right = 0;
        newStyle.left = 'auto';
      } else {
        newStyle.left = 0;
        newStyle.right = 'auto';
      }

      setStyle(newStyle);
    };

    // Calculate position initially and on window resize
    updatePosition();
    window.addEventListener('resize', updatePosition);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', updatePosition);
  }, [isMobile]); // Depend on `isMobile` to apply changes only when switching to desktop

  return { ref: elementRef, style };
}
