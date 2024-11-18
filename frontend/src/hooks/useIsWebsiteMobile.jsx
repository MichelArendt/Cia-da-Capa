// /src/utils/useIsMobile.js
import { useState, useEffect } from 'react';

const useIsWebsiteMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < parseInt(getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-desktop')));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < parseInt(getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-desktop')));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useIsWebsiteMobile;
