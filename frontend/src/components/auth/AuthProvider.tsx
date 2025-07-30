import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { auth } from "@/api/auth";
import { User } from '@/types/auth';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, requireAuth = true }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await auth();
        const isAuth = response.data.success;
        setAuthenticated(isAuth);
        if (isAuth && response.data.data) {
          setUser(response.data.data);
        }
      } catch {
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const value = {
    authenticated,
    loading,
    user: user || undefined
  };

  if (loading) {
    return <div className="text-center text-2xl font-bold">.·´¯`(&gt;▂&lt;)´¯`·. </div>;
  }

  if (requireAuth && !authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
