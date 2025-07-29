import { useEffect, useRef } from 'react';
import { WebSocketService } from '../services/websocketService';

export const useWebSocket = () => {
  const wsService = useRef<WebSocketService>();

  useEffect(() => {
    wsService.current = WebSocketService.getInstance();
    
    const connectWebSocket = async () => {
      try {
        await wsService.current?.connect();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      wsService.current?.disconnect();
    };
  }, []);

  const subscribe = (messageType: string, handler: (data: unknown) => void) => {
    wsService.current?.subscribe(messageType, handler);
  };

  const unsubscribe = (messageType: string) => {
    wsService.current?.unsubscribe(messageType);
  };

  const isConnected = () => {
    return wsService.current?.isConnected() ?? false;
  };

  return {
    subscribe,
    unsubscribe,
    isConnected
  };
};
