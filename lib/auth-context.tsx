'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'CONSUMER' | 'HOST' | 'ADMIN';
  activeMode: 'CONSUMER' | 'HOST';
  avatar?: string;
  headline?: string;
  bio?: string;
  college?: string;
  skills?: string[];
  links?: Record<string, string>;
}

interface AuthContextType {
  user: UserProfile | null;
  activeMode: 'CONSUMER' | 'HOST';
  isLoadingAuth: boolean;
  switchMode: (mode: 'CONSUMER' | 'HOST') => void;
  switchUser: (userId: string) => Promise<void>;
  login: (email: string) => Promise<void>;
  loginWithGoogle: (account: { email: string; name?: string; avatar?: string; password?: string }) => Promise<UserProfile | null>;
  logout: () => void;
  availableUsers: Array<{ id: string; name: string; role: string; email: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const defaultUsers: Array<{ id: string; name: string; role: 'CONSUMER' | 'HOST' | 'ADMIN'; email: string }> = [
  { id: 'usr_alex', name: 'Alex Rivera', role: 'CONSUMER', email: 'alex@sushanti.dev' },
  { id: 'usr_priya', name: 'Priya Sharma (Host)', role: 'HOST', email: 'priya@sushanti.dev' },
  { id: 'usr_rohit', name: 'Rohit Verma', role: 'CONSUMER', email: 'rohit@sushanti.dev' },
  { id: 'usr_admin', name: 'Platform Admin', role: 'ADMIN', email: 'admin@sushanti.dev' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeMode, setActiveMode] = useState<'CONSUMER' | 'HOST'>('CONSUMER');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Check saved mode or user from localStorage or cookie
    let savedUserId = localStorage.getItem('sushanti_user_id');
    if (!savedUserId && typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)sushanti_user_id=([^;]+)/);
      if (match) {
        savedUserId = decodeURIComponent(match[1]);
        localStorage.setItem('sushanti_user_id', savedUserId);
      }
    }
    const savedMode = (localStorage.getItem('sushanti_mode') as 'CONSUMER' | 'HOST') || 'CONSUMER';
    setActiveMode(savedMode);
    if (savedUserId) {
      loadUser(savedUserId).finally(() => setIsLoadingAuth(false));
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  const loadUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/auth/me?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role === 'HOST' && !localStorage.getItem('sushanti_mode')) {
          setActiveMode('HOST');
        }
      } else {
        localStorage.removeItem('sushanti_user_id');
        setUser(null);
      }
    } catch {
      localStorage.removeItem('sushanti_user_id');
      setUser(null);
    }
  };

  const switchMode = (mode: 'CONSUMER' | 'HOST') => {
    setActiveMode(mode);
    localStorage.setItem('sushanti_mode', mode);
  };

  const switchUser = async (userId: string) => {
    localStorage.setItem('sushanti_user_id', userId);
    await loadUser(userId);
  };

  const login = async (email: string) => {
    const target = defaultUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || defaultUsers[0];
    await switchUser(target.id);
  };

  const loginWithGoogle = async (account: { email: string; name?: string; avatar?: string; password?: string }): Promise<UserProfile | null> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('sushanti_user_id', data.user.id);
        return data.user;
      }
      return null;
    } catch (e) {
      console.error('Google login failed:', e);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sushanti_user_id');
    if (typeof document !== 'undefined') {
      document.cookie = 'sushanti_user_id=; path=/; max-age=0;';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeMode,
        isLoadingAuth,
        switchMode,
        switchUser,
        login,
        loginWithGoogle,
        logout,
        availableUsers: defaultUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
