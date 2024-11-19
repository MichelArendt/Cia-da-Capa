import { useEffect } from 'react';
import useStore from '../store';

const useGlobalResizeListener = () => {
  const setIsMobile = useStore((state) => state.setIsMobile);
  const breakpointDesktop = useStore((state) => state.breakpointDesktop);

  useEffect(() => {
    const handleResize = () => {
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