import React from 'react';
import ReactDOM from 'react-dom/client';

// API
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '/src/services/api/queryClient';

import App from './App';

// Select the root element
const rootElement = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);