'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '@/lib/types/loyalty';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        localStorage.setItem('so_user', JSON.stringify(data.user));
      } else {
        const cached = localStorage.getItem('so_user');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch auth session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('so_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Credenciais inválidas' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha na conexão' };
    }
  };

  const loginWithGoogle = async (email?: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('so_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Falha no login Google' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha na conexão' };
    }
  };

  const register = async (name: string, email: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('so_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Falha no cadastro' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha na conexão' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout api failed:', e);
    }
    setUser(null);
    localStorage.removeItem('so_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
