import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedWebSocket } from '@/hooks/useAuthenticatedWebSocket';

const LoadingScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subscribe, isConnected, isAuthenticated, error } = useAuthenticatedWebSocket({
    autoConnect: true,
    // onConnectionChange: (connected, authenticated) => {
    //   console.log('WebSocket status:', { connected, authenticated });
    // },
    onAuthError: (error) => {
      console.warn('WebSocket authentication issue (user is already logged in):', error);
      // Since user is already authenticated via HTTP, this might be a WebSocket-specific issue
      // Let's not show an alert unless it's persistent
    }
  });

  useEffect(() => {
    const handleComplete = (data: unknown) => {
      if (data === "error") {
        alert('Error while sending data');
        navigate('/');
      } else {
        try {
          const messageJson = typeof data === 'string' ? JSON.parse(data) : data;
          navigate('/result', { state: { data: messageJson } });
        } catch (error) {
          console.error('Error parsing message:', error);
          navigate('/');
        }
      }
    };

    const unsubscribe = subscribe('complete', handleComplete);

    return () => {
      unsubscribe();
    };
  }, [navigate, subscribe]);
  
  // Primary: PANTONE 172 C (orange)
  const primaryColor = 'hsl(34, 100%, 56%)';
  // Secondary: PANTONE 123 C (yellow)
  const secondaryColor = 'hsl(48, 100%, 57%)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28] relative">
        {/* Animated Face */}
        <div className="text-center">
          <div 
            className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer mb-4"
            style={{ color: '#FF4B28' }}
          >
            (｡•ᴗ•｡)
          </div>
          <h1 className="text-3xl font-bold animate-bounce" style={{ color: '#FF4B28' }}>
            {t("loading.title")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("loading.subtitle")}</p>
          
          {/* Optional: Show connection status for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-2">
              WebSocket: {isConnected ? '🟢' : '🔴'} | Auth: {isAuthenticated ? '✅' : '❌'}
              {error && <div className="text-red-500">Error: {error.message}</div>}
            </div>
          )}
        </div>

        {/* Animated Pills */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>

        {/* Floating Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-slow text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.3,
                color: i % 2 === 0 ? primaryColor : secondaryColor
              }}
            >
              ✧
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;
