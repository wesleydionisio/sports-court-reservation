// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importação do Bootstrap
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);