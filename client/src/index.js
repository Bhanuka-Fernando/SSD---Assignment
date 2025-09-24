import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import api from './api';                 // <-- add this

// bootstrap Authorization for hard refreshes
const tok = localStorage.getItem('token');
if (tok) {
  api.defaults.headers.common.Authorization = `Bearer ${tok}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();