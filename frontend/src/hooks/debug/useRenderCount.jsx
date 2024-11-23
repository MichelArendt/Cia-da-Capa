import { useEffect, useRef } from 'react';

const useRenderCount = (component) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1; // Increment the render count
    console.log(`[${component.name}] Render Count: ${renderCount.current}`);
  });
};

export default useRenderCount;
