import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';

import { usePersistentAuthState } from './hooks/usePersistentAuthState.ts';
import { TimesheetProvider } from './contexts/TimesheetContext.tsx';
import { AuthProvider, useAuthContext } from './contexts/AuthContext.tsx';

import AuthenticatedRoutes from './routes/AuthenticatedRoutes.tsx';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.tsx';

function App() {
  const { isAuthenticated, isSignedUp } = useAuthContext();

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
          * {
              boxSizing: border-box; 
          },
          h1, h2, h3, h4, h5, h6{
            font-family: 'Helvetica !important',
          },
        `}
      </style>
      <GlobalStyles
        styles={{
          '*': { boxSizing: 'border-box' },
          body: {
            padding: '0',
            margin: '0 !important',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      />
      <Router>
        {
          (isAuthenticated && isSignedUp) ?
            <TimesheetProvider>
              <AuthenticatedRoutes />
            </TimesheetProvider>
            : <UnauthenticatedRoutes />
        }
      </Router>
    </>
  )
}

export default App;
