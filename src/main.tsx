import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { HabitProvider } from './contexts/HabitContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HabitProvider>
        <App />
      </HabitProvider>
    </AuthProvider>
  </StrictMode>,
);
