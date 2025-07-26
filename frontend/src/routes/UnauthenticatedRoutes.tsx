import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext.tsx';

import LoginPage from '../pages/LoginPage.tsx';
import SignupPage from '../pages/SignupPage.tsx';

const UnauthenticatedRoutes = () => {
  const { isAuthenticated, setIsAuthenticated, setIsSignedUp } = useAuthContext();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/signup" />} />

      <Route path="/signup" element={<SignupPage {...{ setIsAuthenticated, setIsSignedUp }} />} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default UnauthenticatedRoutes;
