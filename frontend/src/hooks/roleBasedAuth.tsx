import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "@/api/auth";

interface RoleBasedAuthProps {
  allowedRoles?: ('user' | 'admin' | 'superadmin')[];
  requiredRole?: 'user' | 'admin' | 'superadmin';
  fallbackPath?: string;
}

const roleBasedAuth = (
  Component: JSX.Element, 
  { allowedRoles, requiredRole, fallbackPath = '/' }: RoleBasedAuthProps = {}
) => {
  const AuthenticatedComponent = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          const response = await auth(); 
          if (response.data.success) {
            setAuthenticated(true);
            
            // Check role-based access
            const userData = localStorage.getItem('user');
            if (userData) {
              const user = JSON.parse(userData);
              const userRole = user.role;
              
              // Role hierarchy for minimum role check
              const roleHierarchy = {
                user: 0,
                admin: 1,
                superadmin: 2
              };

              let accessGranted = true;

              // Check specific allowed roles
              if (allowedRoles && allowedRoles.length > 0) {
                accessGranted = allowedRoles.includes(userRole);
              }

              // Check minimum required role
              if (requiredRole && accessGranted) {
                const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy];
                const requiredLevel = roleHierarchy[requiredRole];
                accessGranted = userLevel >= requiredLevel;
              }

              setHasAccess(accessGranted);
            } else {
              // If no user data, default to user role
              if (allowedRoles) {
                setHasAccess(allowedRoles.includes('user'));
              } else if (requiredRole) {
                setHasAccess(requiredRole === 'user');
              } else {
                setHasAccess(true);
              }
            }
          } else {
            setAuthenticated(false);
            setHasAccess(false);
          }
        } catch {
          setAuthenticated(false);
          setHasAccess(false);
        } finally {
          setLoading(false);
        }
      };

      verifyAuth();
    }, []);

    if (loading) {
      return <div className="text-center text-2xl font-bold">.·´¯`(&gt;▂&lt;)´¯`·. </div>;
    }

    if (!authenticated) {
      return <Navigate to="/" replace />;
    }

    if (!hasAccess) {
      return <Navigate to={fallbackPath} replace />;
    }

    return Component;
  };

  return <AuthenticatedComponent />;
};

export default roleBasedAuth;
