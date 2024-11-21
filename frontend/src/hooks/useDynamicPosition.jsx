import { useState, useEffect, useRef } from 'react';

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

    // Check if the element's left edge is beyond the middle of the screen
    if (rect.left > windowWidth / 2) {
      console.log("Anchor to right");
      newStyle.right = 0; // Anchor to the right
      newStyle.left = 'auto';
    } else {
      console.log("Anchor to left");
      newStyle.left = 0; // Anchor to the left
      newStyle.right = 'auto';
    }

    setStyle(newStyle);
  }, [isMobile, windowWidth]);

  return { ref: elementRef, style };
}
