import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('veriq_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('veriq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('veriq_user');
    }
  }, [user]);

  const login = async (username: string): Promise<boolean> => {
    // Simulate enterprise authentication handshake
    const mockUser: User = {
      id: 'usr-1001',
      username,
      name: username === 'admin' ? 'Chief Technical Officer' : 'Lead Systems Architect',
      email: `${username}@veriq-platform.io`,
      role: 'ENTERPRISE_ADMIN',
    };
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
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
