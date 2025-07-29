import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { screenAuth } from '@/utils/screenAuth';

interface ScreenAuthProps {
  children: ReactElement;
  redirectTo?: string;
}

const ScreenAuth = ({ children, redirectTo = '/screen/pin' }: ScreenAuthProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenAuth = () => {
      const isAuthValid = screenAuth.isAuthenticated();
      
      setIsAuthenticated(isAuthValid);
      setIsLoading(false);
      
      if (!isAuthValid) {
        navigate(redirectTo);
      }
    };

    checkScreenAuth();
  }, [navigate, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="w-[1000px] h-[590px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4B28] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the navigation will handle redirecting
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ScreenAuth;
