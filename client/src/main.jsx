import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <AlertProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
  </AlertProvider>
</BrowserRouter>
);