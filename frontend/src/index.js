import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Select the root element
const rootElement = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);