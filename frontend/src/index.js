import React from 'react';
import ReactDOM from 'react-dom/client';

// API
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '/src/services/api/queryClient';

// Debug (why-did-you-render for development)
import './wdyr'; // Import `why-did-you-render` setup if using it

// Main App
import App from './App';

// React Strict Mode (optional, for catching warnings in dev)
const isDev = process.env.NODE_ENV === 'development';

// Select the root element
const rootElement = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
  {/* {isDev ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )} */}
    <App />
  </QueryClientProvider>
);