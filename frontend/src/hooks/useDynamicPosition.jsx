import { useState, useEffect, useRef } from 'react';
// import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Detects mobile view

// Hooks
import useStore from '/src/store';

export function useDynamicPosition() {
  const elementRef = useRef(null);
  const [style, setStyle] = useState({ left: 0 }); // Default to `left: 0`

  const isMobile = useStore((state) => state.isMobile);
  const windowWidth = useStore((state) => state.windowWidth);

  useEffect(() => {
    // Only apply positioning calculations on desktop
    if (isMobile || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const newStyle = {};

    // If the dropdown overflows on the right, align to the right
    if (rect.right > windowWidth) {
      newStyle.right = 0;
      newStyle.left = 'auto';
    } else {
      newStyle.left = 0;
      newStyle.right = 'auto';
    }

    setStyle(newStyle);
  }, [isMobile, windowWidth]);

  return { ref: elementRef, style };
}
