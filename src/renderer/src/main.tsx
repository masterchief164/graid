import './assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { ipcRenderer } from 'electron';
//
// ipcRenderer.on('open-url', (_, data) => {
//   console.log(data);
//   // window.location.href = data;
// });
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
