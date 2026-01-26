import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { Categories } from './pages/Categories';

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
} else if (pathname === '/favorites') {
  root.render(
    <React.StrictMode>
      <Favorites />
    </React.StrictMode>
  );
} else if (pathname === '/categories') {
  root.render(
    <React.StrictMode>
      <Categories />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}