import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './AuthContext'; // 👈 import our new context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 👈 wrap the app */}
      <App />
    </AuthProvider>
  </StrictMode>
);
