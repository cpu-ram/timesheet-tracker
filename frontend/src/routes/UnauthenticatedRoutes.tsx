import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext.tsx';

import LoginPage from '../pages/LoginPage.tsx';
import SignupPage from '../pages/SignupPage.tsx';

const UnauthenticatedRoutes = () => {
  const { isAuthenticated, setIsAuthenticated, isSignedUp, setIsSignedUp } = useAuthContext();

  return (
    <Routes>
      <Route path="/login"
        element={
          !isAuthenticated ?
            <LoginPage {...{ setIsAuthenticated, setIsSignedUp }} />
            : <Navigate to="/signup" />
        }
      />

      <Route path="/signup"
        element={
          <SignupPage {...{ setIsAuthenticated, setIsSignedUp }} />
        }
      />

      <Route path="*"
        element={
          <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default UnauthenticatedRoutes;