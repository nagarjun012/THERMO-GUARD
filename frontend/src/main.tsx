import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initNativeApp } from './utils/nativeApp';
import 'leaflet/dist/leaflet.css';
import './index.css';

// Initialize native features (StatusBar, Keyboard, BackButton) — no-op on web
initNativeApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
