import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// App entry. The design system is loaded wholesale from src/theme; the app
// body has no data until the operator fills it.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
