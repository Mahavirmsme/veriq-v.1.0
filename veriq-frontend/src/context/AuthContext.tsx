import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserSession } from '../services/authService';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<UserSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('veriq_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('veriq_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('veriq_user_session');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<UserSession> => {
    const session = await authService.login(username, password);
    setUser(session);
    return session;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veriq_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
