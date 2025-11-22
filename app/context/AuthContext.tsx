'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // 1. අලුතින් එකතු කළා
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 2. Loading state එක
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
        // App එක Load වෙනකොට localStorage එක check කරනවා
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('userEmail');
          
          if (storedToken) {
            setToken(storedToken);
            if (storedUser) setUser(storedUser);
          }
        }
        setIsLoading(false); // 3. Check කරලා ඉවර වුනාම Loading නවත්වනවා
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, email: string) => {
    setToken(newToken);
    setUser(email);

    if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userEmail', email);
    }

    router.push('/');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    }
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
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