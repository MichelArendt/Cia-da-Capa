import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '/src/styles/main.scss';

// Lazy load the Manage component
const Main = lazy(() => import('/src/layouts/Main'));
const Manage = lazy(() => import('/src/layouts/Manage'));

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
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