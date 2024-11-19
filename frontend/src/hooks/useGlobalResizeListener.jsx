import { useEffect } from 'react';
import useStore from '../store';

const useGlobalResizeListener = () => {
  const setIsMobile = useStore((state) => state.setIsMobile);
  const setWindowDimensions = useStore((state) => state.setWindowDimensions);
  const breakpointDesktop = useStore((state) => state.breakpointDesktop);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update window dimensions in the store
      setWindowDimensions(width, height);

      // Update isMobile state
      const isMobile = window.innerWidth < breakpointDesktop;
      setIsMobile(isMobile);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, breakpointDesktop]);
};

export default useGlobalResizeListener;