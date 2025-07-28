// WebSocket server service for handling browser connections
// Provides real-time communication between server and clients

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.server = null;
    this.clients = new Set();
    this.isInitialized = false;
    this.currentPort = null;
  }

  async initialize(port = 3002, maxRetries = 5) {
    if (this.isInitialized) {
      console.log('WebSocket service already initialized');
      return;
    }

    let currentPort = port;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Create HTTP server for WebSocket
        this.server = createServer();
        this.wss = new WebSocketServer({ server: this.server });

        // Set up WebSocket connection handling
        this.wss.on('connection', (ws, req) => {
          console.log('New WebSocket client connected from:', req.socket.remoteAddress);
          this.clients.add(ws);

          ws.on('message', (message) => {
            try {
              const data = JSON.parse(message.toString());
              this.handleClientMessage(ws, data);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          });

          ws.on('close', () => {
            console.log('WebSocket client disconnected');
            this.clients.delete(ws);
          });

          ws.on('error', (error) => {
            console.error('WebSocket client error:', error);
            this.clients.delete(ws);
          });

          // Send connection confirmation
          this.sendToClient(ws, {
            type: 'connected',
            data: { message: 'WebSocket connection established' }
          });
        });

        // Set up error handling for the WebSocket server
        this.wss.on('error', (error) => {
          console.error('WebSocket server error:', error);
        });

        // Start the server with promise-based approach
        await new Promise((resolve, reject) => {
          this.server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
              reject(new Error(`Port ${currentPort} is already in use`));
            } else {
              reject(error);
            }
          });

          this.server.listen(currentPort, () => {
            console.log(`WebSocket server running on port ${currentPort}`);
            this.isInitialized = true;
            this.currentPort = currentPort;
            resolve();
          });
        });

        // If we get here, the server started successfully
        break;

      } catch (error) {
        console.warn(`Failed to start WebSocket server on port ${currentPort}: ${error.message}`);
        
        // Clean up failed attempt
        if (this.server) {
          this.server.close();
          this.server = null;
        }
        if (this.wss) {
          this.wss.close();
          this.wss = null;
        }

        retries++;
        currentPort++;

        if (retries >= maxRetries) {
          throw new Error(`Failed to start WebSocket server after ${maxRetries} attempts. Ports ${port} to ${currentPort - 1} are in use.`);
        }

        console.log(`Retrying with port ${currentPort}...`);
      }
    }
  }

  handleClientMessage(ws, message) {
    console.log('Received message from client:', message);
    
    // Handle different message types from clients if needed
    switch (message.type) {
      case 'ping':
        this.sendToClient(ws, { type: 'pong', data: 'pong' });
        break;
      case 'subscribe':
        // Handle subscription requests if needed
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  sendToClient(ws, message) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  broadcastToClients(message) {
    console.log(`Broadcasting to ${this.clients.size} clients:`, message);
    
    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error sending message to client:', error);
          this.clients.delete(client);
        }
      } else {
        this.clients.delete(client);
      }
    });
  }

  getConnectedClientsCount() {
    return this.clients.size;
  }

  getCurrentPort() {
    return this.currentPort;
  }

  close() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
    this.clients.clear();
    this.isInitialized = false;
    console.log('WebSocket service closed');
  }
}

// Export singleton instance
export default new WebSocketService();
