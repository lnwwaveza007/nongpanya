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
  
    // },
    onAuthError: (error) => {
              // WebSocket authentication issue (user is already logged in)
      // Since user is already authenticated via HTTP, this might be a WebSocket-specific issue
      // Let's not show an alert unless it's persistent
    }
  });

  // Handle WebSocket connection errors
  useEffect(() => {
    if (error && !isConnected) {
              // WebSocket connection error
      // Give some time for reconnection attempts
      const timer = setTimeout(() => {
        if (!isConnected) {
          alert(t('loading.errors.connectionError'));
          navigate('/');
        }
      }, 10000); // Wait 10 seconds before showing error

      return () => clearTimeout(timer);
    }
  }, [error, isConnected, navigate, t]);

  useEffect(() => {
    const handleComplete = (data: unknown) => {
      try {
        // Handle explicit error responses
        if (data === "error" || data === null || data === undefined) {
          // Received error response
          alert(t('loading.errors.sendingData'));
          navigate('/');
          return;
        }

        // Handle error objects
        if (typeof data === 'object' && data && 'error' in data) {
          // Received error object
          const errorData = data as { error?: string };
          const errorMsg = errorData.error || t('loading.errors.unknown');
          alert(`${t('loading.errors.serverError')}: ${errorMsg}`);
          navigate('/');
          return;
        }

        // Handle empty responses
        if (typeof data === 'string' && data.trim() === '') {
          // Received empty response
          alert(t('loading.errors.emptyResponse'));
          navigate('/');
          return;
        }

        // Parse and validate data
        let messageJson;
        if (typeof data === 'string') {
          try {
            messageJson = JSON.parse(data);
          } catch (parseError) {
            // JSON parsing error
            alert(t('loading.errors.invalidResponse'));
            navigate('/');
            return;
          }
        } else {
          messageJson = data;
        }

        // Validate that we have valid data structure
        if (!messageJson || typeof messageJson !== 'object') {
          // Invalid data structure
          alert(t('loading.errors.invalidData'));
          navigate('/');
          return;
        }

        // Check for medicine data or expected response structure
        if (Array.isArray(messageJson) && messageJson.length === 0) {
          // Received empty medicine list
          alert(t('loading.errors.noMedicines'));
          navigate('/');
          return;
        }

        // Success case
        navigate('/result', { state: { data: messageJson } });
        
      } catch (error) {
        // Unexpected error in handleComplete
        alert(t('loading.errors.unexpected'));
        navigate('/');
      }
    };

    const unsubscribe = subscribe('complete', handleComplete);

    return () => {
      unsubscribe();
    };
  }, [navigate, subscribe, t]);
  
  // Primary: PANTONE 172 C (orange)
  const primaryColor = 'hsl(34, 100%, 56%)';
  // Secondary: PANTONE 123 C (yellow)
  const secondaryColor = 'hsl(48, 100%, 57%)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-2 border-[#FF4B28] relative">
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
              className="w-6 h-12 bg-primary rounded-full animate-pulse"
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
