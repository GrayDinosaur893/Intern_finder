import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './index.css';

const rootElement = document.getElementById('app') || document.getElementById('root');
if (rootElement) rootElement.style.overflow = 'hidden';

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);