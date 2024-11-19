import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Hooks
import useStore from '/src/store';
import useGlobalResizeListener from '/src/hooks/useGlobalResizeListener';

// Shared
import '/src/styles/main.scss';
import ContentLoader from './components/shared/ContentLoader';

// Lazy load the Manage component
const Main = lazy(() => import('/src/layouts/Main'));
const Manage = lazy(() => import('/src/layouts/Manage'));

// Signals components to close menus/overlays on route changes
function LocationListener() {
  const location = useLocation();
  const triggerCloseAllMenus = useStore((state) => state.triggerCloseAllMenus);

  useEffect(() => {
    // Trigger the signal when the location changes
    triggerCloseAllMenus();
  }, [location, triggerCloseAllMenus]);

  return null; // This component doesn't render anything
}

function App() {
  // Use the global resize listener to manage isMobile state
  useGlobalResizeListener();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <LocationListener />
      <Suspense fallback={
        <ContentLoader />
      }>
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route path="/manage/*" element={<Manage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;