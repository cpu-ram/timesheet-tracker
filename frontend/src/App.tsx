import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';

import { usePersistentAuthState } from './hooks/usePersistentAuthState.ts';

import { TimesheetProvider } from './contexts/TimesheetContext.tsx';
import { PopupProvider } from './contexts/PopupContext.tsx';

import { AuthProvider, useAuthContext } from './contexts/AuthContext.tsx';
import { StyleProvider } from './contexts/StyleContext.tsx';

import { useStyleContext } from './contexts/StyleContext.tsx';

import AuthenticatedRoutes from './routes/AuthenticatedRoutes.tsx';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.tsx';

function App() {
  const { isAuthenticated, isSignedUp } = useAuthContext();
  const { theme } = useStyleContext();

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
          * {
              boxSizing: border-box; 
          },
        `}
      </style>
      <GlobalStyles
        styles={{
          '*': { boxSizing: 'border-box' },
          'html, body, #root': {
            height: '100%',
            margin: 0,
            padding: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: `${theme.palette.grey[100]}`,
            overflowX: 'hidden',
          }
        }}
      />
      <Router>
        {
          (isAuthenticated && isSignedUp) ?
            <PopupProvider>
              <TimesheetProvider>
                <AuthenticatedRoutes />
              </TimesheetProvider>
            </PopupProvider>
            : <UnauthenticatedRoutes />
        }
      </Router>
    </>
  )
}

export default App;
