
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure the root element exists before mounting
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root with strict mode for better development experience
const root = createRoot(rootElement);

// Render app with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
