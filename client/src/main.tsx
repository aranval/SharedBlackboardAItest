import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { FirebaseProvider } from './firebase/FirebaseProvider';
import { Toaster } from '@/components/ui/sonner';

// Force dark mode
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
      <Toaster />
    </FirebaseProvider>
  </React.StrictMode>
);
