import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { StyleProvider } from './contexts/StyleContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StyleProvider>
  </StrictMode>,
);
