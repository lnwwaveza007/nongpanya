import { useEffect, useState, useCallback } from 'react';
import { WebSocketService, WebSocketMessage, AuthenticatedUser } from '@/services/websocketService';

export interface UseAuthenticatedWebSocketProps {
  /** Whether to auto-connect on mount */
  autoConnect?: boolean;
  /** Authentication token to use */
  token?: string;
  /** Callback when connection status changes */
  onConnectionChange?: (connected: boolean, authenticated: boolean) => void;
  /** Callback when authentication fails */
  onAuthError?: (error: Error) => void;
}

export const useAuthenticatedWebSocket = ({
  autoConnect = true,
  token,
  onConnectionChange,
  onAuthError
}: UseAuthenticatedWebSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const wsService = WebSocketService.getInstance();

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    try {
      setIsConnecting(true);
      setError(null);

      if (token) {
        wsService.setAuthToken(token);
      }

      await wsService.connect();
      
      setIsConnected(true);
      setIsAuthenticated(wsService.getIsAuthenticated());
      setUser(wsService.getUser());
      
      onConnectionChange?.(true, wsService.getIsAuthenticated());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Connection failed');
      setError(error);
      setIsConnected(false);
      setIsAuthenticated(false);
      setUser(null);
      
      if (error.message.includes('Authentication')) {
        onAuthError?.(error);
      }
      
      onConnectionChange?.(false, false);
    } finally {
      setIsConnecting(false);
    }
  }, [token, isConnecting, isConnected, onConnectionChange, onAuthError, wsService]);

  const disconnect = useCallback(() => {
    wsService.disconnect();
    setIsConnected(false);
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    onConnectionChange?.(false, false);
  }, [onConnectionChange, wsService]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (isConnected && isAuthenticated) {
      wsService.send(message);
    } else {
      console.warn('Cannot send message: WebSocket not connected or not authenticated');
    }
  }, [isConnected, isAuthenticated, wsService]);

  const subscribeToChannel = useCallback((channel: string) => {
    if (isConnected && isAuthenticated) {
      wsService.subscribeToChannel(channel);
    } else {
      console.warn('Cannot subscribe to channel: WebSocket not connected or not authenticated');
    }
  }, [isConnected, isAuthenticated, wsService]);

  const subscribe = useCallback((messageType: string, handler: (data: unknown) => void) => {
    wsService.subscribe(messageType, handler);
    
    return () => {
      wsService.unsubscribe(messageType);
    };
  }, [wsService]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect]); // Only depend on autoConnect to avoid reconnecting on every render

  // Set up connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      const connected = wsService.isConnected();
      const authenticated = wsService.getIsAuthenticated();
      const currentUser = wsService.getUser();
      
      setIsConnected(connected);
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, [wsService]);

  return {
    // State
    isConnected,
    isAuthenticated,
    isConnecting,
    user,
    error,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    subscribeToChannel,
    subscribe,
    
    // Helpers
    ping: () => wsService.ping(),
    authenticate: () => wsService.authenticate(),
  };
};
