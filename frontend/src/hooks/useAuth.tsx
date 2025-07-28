import { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import type { User } from '@/types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await auth();
        if (response.data.success) {
          // Get user data from localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // If no user data in localStorage, set authenticated but with minimal user data
            setIsAuthenticated(true);
            setUser({
              id: response.data.data.id,
              fullname: '',
              email: '',
              role: 'user', // Default role
              created_at: '',
              updated_at: ''
            });
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const hasMinimumRole = (role: 'user' | 'admin' | 'superadmin'): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      user: 0,
      admin: 1,
      superadmin: 2
    };
    
    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = roleHierarchy[role];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasMinimumRole,
    setUser
  };
};
