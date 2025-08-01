import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';
import { useStyleContext } from './contexts/StyleContext.tsx';

import { useAuthContext } from './contexts/AuthContext.tsx';

import { PopupProvider } from './contexts/PopupContext.tsx';
import { TimesheetProvider } from './contexts/TimesheetContext.tsx';

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
          'html, body': {
            margin: 0,
            padding: 0,
            backgroundColor: `${theme.palette.grey[100]}`,
            overflowX: 'hidden',
            display: 'block',
          },
          '#root': {
            minHeight: '100vdh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      />
      <Router>
        {isAuthenticated && isSignedUp ? (
          <PopupProvider>
            <TimesheetProvider>
              <AuthenticatedRoutes />
            </TimesheetProvider>
          </PopupProvider>
        ) : (
          <UnauthenticatedRoutes />
        )}
      </Router>
    </>
  );
}

export default App;
