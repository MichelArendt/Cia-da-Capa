import { useEffect, useRef } from 'react';

const useRenderCount = (component) => {
  if (process.env.NODE_ENV === 'production') {
    return; // Do nothing in production, code will be removed by Webpack
  }

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`[${component.name.toUpperCase()}] Render Count: ${renderCount.current}`);
  });
};

export default useRenderCount;