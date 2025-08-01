import { config } from '../config';

export type WebSocketMessage = {
  type: 'order' | 'complete' | 'error' | 'connected' | 'ping' | 'pong' | 'subscribe' | 'subscribed' | 'authenticate' | 'auth_status';
  data?: unknown;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  fullname: string;
  role: string;
};

export type ConnectionData = {
  message: string;
  user?: AuthenticatedUser;
};

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private messageHandlers: Map<string, (data: unknown) => void> = new Map();
  private authToken: string | null = null;
  private isAuthenticated = false;
  private user: AuthenticatedUser | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Set authentication token for WebSocket connection
   * @param token JWT token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get authentication token from various sources
   */
  private getAuthToken(): string | null {
    // Try from manually set token first
    if (this.authToken) {
      return this.authToken;
    }

    // For cookie-based auth, we don't need to get the token manually
    // The browser will automatically send cookies with the WebSocket request
    // Let's try common storage locations as fallback
    const storedToken = localStorage.getItem('authToken') || 
                       sessionStorage.getItem('authToken') ||
                       localStorage.getItem('token') ||
                       sessionStorage.getItem('token');
    
    if (storedToken) {
      return storedToken;
    }

    // For cookie-based authentication, return a placeholder
    // The actual authentication will be handled by the server reading cookies
    return 'cookie-auth';
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = this.getAuthToken();
        if (!token) {
          reject(new Error('No authentication token available'));
          return;
        }

        // For cookie-based auth, don't include token in URL if it's the placeholder
        let wsUrl: string = config.websocket.endpoint;
        if (token !== 'cookie-auth') {
          wsUrl = `${config.websocket.endpoint}?token=${encodeURIComponent(token)}`;
        }
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            
            // Handle authentication status
            if (message.type === 'connected' && message.data) {
              const data = message.data as ConnectionData;
              if (data.user) {
                this.isAuthenticated = true;
                this.user = data.user;
              }
            }

            const handler = this.messageHandlers.get(message.type);
            if (handler) {
              handler(message.data);
            }
          } catch {
            // Error parsing WebSocket message
          }
        };

        this.ws.onclose = (event) => {
          this.isAuthenticated = false;
          this.user = null;
          
          // Don't auto-reconnect if it's an authentication error
          if (event.code === 401) {
            // WebSocket authentication failed - this might be normal during initial connection
            // Don't reject immediately for cookie-based auth, let it retry
            if (token !== 'cookie-auth') {
              reject(new Error('Authentication failed'));
              return;
            }
          }
          
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          // WebSocket error
          // Don't reject immediately for cookie-based auth
          if (token === 'cookie-auth') {
            // Will retry for cookie-based auth
          } else {
            reject(error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connect().catch(() => {});
      }, this.reconnectInterval);
    }
  }

  public subscribe(messageType: string, handler: (data: unknown) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  public unsubscribe(messageType: string) {
    this.messageHandlers.delete(messageType);
  }

  public send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
              // WebSocket is not connected
    }
  }

  /**
   * Subscribe to a specific channel (requires authentication)
   * @param channel Channel name to subscribe to
   */
  public subscribeToChannel(channel: string) {
    this.send({
      type: 'subscribe',
      data: { channel }
    });
  }

  /**
   * Send ping to keep connection alive
   */
  public ping() {
    this.send({
      type: 'ping',
      data: 'ping'
    });
  }

  /**
   * Re-authenticate with server
   */
  public authenticate() {
    this.send({
      type: 'authenticate',
      data: {}
    });
  }

  /**
   * Get current authenticated user
   */
  public getUser() {
    return this.user;
  }

  /**
   * Check if WebSocket is authenticated
   */
  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.isAuthenticated = false;
    this.user = null;
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
