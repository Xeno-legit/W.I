import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { History } from './pages/History';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Simple routing based on pathname
const pathname = window.location.pathname;
const root = ReactDOM.createRoot(rootElement);

if (pathname === '/history') {
  root.render(
    <React.StrictMode>
      <History />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}