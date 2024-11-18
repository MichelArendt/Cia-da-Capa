import { useState, useEffect } from 'react';

export default function useToggleContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [visibilityClass, setVisibilityClass] = useState('');

  const openContent = () => setIsOpen(true);
  const closeContent = () => setIsOpen(false);
  const toggleContent = () => setIsOpen(prev => !prev);

  // Toggle body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable body scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable body scrolling
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = ''; // Ensure scrolling is re-enabled
    };
  }, [isOpen]);

  return { isOpen, openContent, closeContent, toggleContent };
}