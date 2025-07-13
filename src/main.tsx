import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
