import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AuthSession,
  clearAuthSession,
  DEMO_SESSION,
  loadAuthSession,
  saveAuthSession,
} from '../utils/authPrefs';

interface AuthContextType {
  session: AuthSession | null;
  ready: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  ready: false,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAuthSession().then((data) => {
      setSession(data);
      setReady(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim();
    if (!trimmed || !password.trim()) return false;

    const next: AuthSession = {
      ...DEMO_SESSION,
      email: trimmed,
      displayName: trimmed.split('@')[0] || DEMO_SESSION.displayName,
      loggedInAt: Date.now(),
    };
    setSession(next);
    await saveAuthSession(next);
    return true;
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    await clearAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        ready,
        isAuthenticated: !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
