import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '/src/styles/main.scss';

// Lazy load the Manage component
const Main = lazy(() => import('/src/layouts/Main'));
const Manage = lazy(() => import('/src/layouts/Manage'));

// Detect the base path for deployment in a nested folder
const basePath = window.location.pathname.split('/').slice(0, -1).join('/');

function App() {
  return (
    <Router basename={basePath}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route path="/manage/*" element={<Manage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;