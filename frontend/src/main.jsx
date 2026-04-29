import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import './i18n/index.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { style: { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' } },
          error: { style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } }
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
