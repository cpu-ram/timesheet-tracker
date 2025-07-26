import { createContext, useContext, useState, useEffect } from 'react';
import { usePersistentAuthState } from '../hooks/usePersistentAuthState.ts';
import { fetchAuthData, fetchUsername } from '../api/auth.ts';

import { Dispatch, SetStateAction } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isSignedUp: boolean;
  setIsSignedUp: Dispatch<SetStateAction<boolean>>;
  username: string | null;
  setUsername: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = usePersistentAuthState('isAuthenticated', false);
  const [isSignedUp, setIsSignedUp] = usePersistentAuthState('isSignedUp', false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authData = await fetchAuthData();
      const authStatus = authData.authStatus;
      const signUpCompletionStatus = authData.signUpCompletionStatus;
      setIsSignedUp(signUpCompletionStatus);
      setIsAuthenticated(authStatus);
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isSignedUp) {
      fetchUsername()
        .then(userName => setUsername(userName))
        .catch(error => {
          console.error('Error fetching username:', error);
          setUsername(null);
        });
    }
  }, [isSignedUp]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isSignedUp,
        setIsSignedUp,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}
