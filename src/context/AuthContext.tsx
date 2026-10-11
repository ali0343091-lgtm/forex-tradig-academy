import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PaymentRequest } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  paymentStatus: 'none' | 'pending' | 'approved' | 'rejected';
  canAccessClasses: boolean;
  latestPayment: PaymentRequest | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fta_token'));
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [canAccessClasses, setCanAccessClasses] = useState(false);
  const [latestPayment, setLatestPayment] = useState<PaymentRequest | null>(null);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('fta_token');
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setPaymentStatus('none');
      setCanAccessClasses(false);
      setLatestPayment(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(currentToken);
        setPaymentStatus(data.paymentStatus);
        setCanAccessClasses(data.canAccessClasses);
        setLatestPayment(data.latestPayment);
      } else {
        // Token expired
        localStorage.removeItem('fta_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('fta_token', newToken);
    setToken(newToken);
    setUser(newUser);
    refreshUser();
  };

  const logout = () => {
    localStorage.removeItem('fta_token');
    setToken(null);
    setUser(null);
    setPaymentStatus('none');
    setCanAccessClasses(false);
    setLatestPayment(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        paymentStatus,
        canAccessClasses,
        latestPayment,
        login,
        logout,
        refreshUser
      }}
    >
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
