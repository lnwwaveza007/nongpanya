// WebSocket server service for handling browser connections
// Provides real-time communication between server and clients

import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { getCurrentEnvironment } from "../config/envConfig.js";
import { getConfig } from "../config/envConfig.js";
import jwt from "jsonwebtoken";
import { parse } from "url";
import { findUserById } from "./userServices.js";
import logger from "../utils/logger.js";

// Get environment-specific configuration
const config = getConfig();

class WebSocketService {
  constructor() {
    this.wss = null;
    this.server = null;
    this.clients = new Map(); // Changed to Map to store client info
    this.isInitialized = false;
    this.currentPort = null;
  }

  /**
   * Authenticate WebSocket connection using JWT token
   * @param {Object} request - HTTP request object
   * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
   */
  async authenticateWebSocketConnection(request) {
    try {
      const { query } = parse(request.url, true);
      let token = query.token;

      // If no token in query, try to get from headers
      if (!token && request.headers.authorization) {
        token = request.headers.authorization.split(" ")[1];
      }

      // If no token in authorization header, try cookie
      if (!token && request.headers.cookie) {
        const cookies = request.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        token = cookies.token;
      }

      if (!token) {
        logger.log("WebSocket authentication failed: No token provided");
        return null;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Optional: Verify user still exists in database
      const user = await findUserById(decoded.id);
      if (!user) {
        logger.log("WebSocket authentication failed: User not found");
        return null;
      }

      logger.log(`WebSocket authentication successful for user: ${decoded.email}`);
      return {
        id: decoded.id,
        email: decoded.email,
        fullname: decoded.fullname,
        role: decoded.role,
        token: token
      };
    } catch (error) {
      logger.log("WebSocket authentication failed:", error.message);
      return null;
    }
  }

  async initialize(port = 3002, maxRetries = 5) {
    if (this.isInitialized) {
      logger.log("WebSocket service already initialized");
      return;
    }

    let currentPort = port;
    let retries = 0;
    const isProduction = getCurrentEnvironment() === "PROD";

    while (retries < maxRetries) {
      try {
        this.server = createServer();
        logger.log("WebSocket server using HTTP/WS (development)");

        this.wss = new WebSocketServer({
          server: this.server,
          verifyClient: async (info, done) => {
            const origin = info.origin || "unknown";
            logger.log(`Incoming WebSocket request from origin: ${origin}`);

            const allowedOrigins = config.cors.origins || [];
            // Allow requests without origin (from tools like Postman)
            if (!info.origin) {
              logger.log("WebSocket connection allowed (no origin header)");
              
              // Still require authentication even without origin
              const user = await this.authenticateWebSocketConnection(info.req);
              if (!user) {
                logger.log("WebSocket connection denied: Authentication failed");
                done(false, 401, "Unauthorized: Authentication required");
                return;
              }
              
              // Store user info in request for later use
              info.req.user = user;
              done(true);
              return;
            }

            // Check if origin is in allowed list
            const isAllowed = allowedOrigins.some((allowedOrigin) => {
              // Support exact match and subdomain matching
              return (
                origin === allowedOrigin ||
                origin.endsWith(
                  "." + allowedOrigin.replace(/^https?:\/\//, "")
                ) ||
                allowedOrigin.includes(origin.replace(/^https?:\/\//, ""))
              );
            });

            if (isAllowed) {
              // Authenticate the user
              const user = await this.authenticateWebSocketConnection(info.req);
              if (!user) {
                logger.log(`WebSocket connection denied from origin: ${origin} - Authentication failed`);
                done(false, 401, "Unauthorized: Authentication required");
                return;
              }
              
              // Store user info in request for later use
              info.req.user = user;
              logger.log(`WebSocket connection allowed from origin: ${origin} for user: ${user.email}`);
              done(true);
            } else {
              logger.log(`WebSocket connection denied from origin: ${origin}`);
              done(false, 403, "Forbidden: Origin not allowed");
            }
          },
        });

        // Set up WebSocket connection handling
        this.wss.on("connection", (ws, req) => {
          const user = req.user; // Get authenticated user from verifyClient
          logger.log(
            `New authenticated WebSocket client connected: ${user.email} (${user.role}) from ${req.socket.remoteAddress}`
          );
          
          // Store client with user information
          this.clients.set(ws, {
            user: user,
            connectedAt: new Date(),
            lastActivity: new Date()
          });

          ws.on("message", (message) => {
            try {
              const data = JSON.parse(message.toString());
              this.handleClientMessage(ws, data, user);
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
              this.sendToClient(ws, {
                type: "error",
                data: { message: "Invalid message format" },
              });
            }
          });

          ws.on("close", () => {
            logger.log(`WebSocket client disconnected: ${user.email}`);
            this.clients.delete(ws);
          });

          ws.on("error", (error) => {
            console.error(`WebSocket client error for ${user.email}:`, error);
            this.clients.delete(ws);
          });

          // Send connection confirmation with user info
          this.sendToClient(ws, {
            type: "connected",
            data: { 
              message: "WebSocket connection established",
              user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
              }
            },
          });
        });

        // Set up error handling for the WebSocket server
        this.wss.on("error", (error) => {
          console.error("WebSocket server error:", error);
        });

        // Start the server with promise-based approach
        await new Promise((resolve, reject) => {
          this.server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
              reject(new Error(`Port ${currentPort} is already in use`));
            } else {
              reject(error);
            }
          });

          this.server.listen(currentPort, () => {
            logger.log(`WebSocket server running on port ${currentPort}`);
            this.isInitialized = true;
            this.currentPort = currentPort;
            resolve();
          });
        });

        // If we get here, the server started successfully
        break;
      } catch (error) {
        logger.warn(
          `Failed to start WebSocket server on port ${currentPort}: ${error.message}`
        );

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
          throw new Error(
            `Failed to start WebSocket server after ${maxRetries} attempts. Ports ${port} to ${
              currentPort - 1
            } are in use.`
          );
        }

        logger.log(`Retrying with port ${currentPort}...`);
      }
    }
  }

  handleClientMessage(ws, message, user) {
    logger.log(`Received message from ${user.email} (${user.role}):`, message);

    // Update last activity timestamp
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
    }

    // Handle different message types from clients
    switch (message.type) {
      case "ping":
        this.sendToClient(ws, { type: "pong", data: "pong" });
        break;
      case "subscribe":
        // Handle subscription requests if needed
        // You can implement role-based subscriptions here
        if (this.isAuthorizedForSubscription(user, message.data?.channel)) {
          this.sendToClient(ws, { 
            type: "subscribed", 
            data: { channel: message.data?.channel } 
          });
        } else {
          this.sendToClient(ws, { 
            type: "error", 
            data: { message: "Unauthorized subscription" } 
          });
        }
        break;
      case "authenticate":
        // Re-authentication request
        this.sendToClient(ws, { 
          type: "auth_status", 
          data: { 
            authenticated: true,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          } 
        });
        break;
      default:
        logger.log("Unknown message type:", message.type);
        this.sendToClient(ws, { 
          type: "error", 
          data: { message: "Unknown message type" } 
        });
    }
  }

  /**
   * Check if user is authorized for specific subscription
   * @param {Object} user - User object
   * @param {string} channel - Channel name
   * @returns {boolean} - Authorization status
   */
  isAuthorizedForSubscription(user, channel) {
    // Implement role-based authorization logic here
    switch (channel) {
      case "admin":
        return ["admin", "superadmin"].includes(user.role);
      case "screen":
        return ["screen", "admin", "superadmin"].includes(user.role);
      case "general":
        return true; // All authenticated users can subscribe to general channel
      default:
        return false;
    }
  }

  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  broadcastToClients(message, options = {}) {
    const { roleFilter, userFilter, excludeUser } = options;
    let targetClients = 0;
    
    logger.log(`Broadcasting to clients with filters:`, {
      totalClients: this.clients.size,
      roleFilter,
      userFilter,
      excludeUser
    });

    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === WebSocket.OPEN) {
        const user = clientInfo.user;
        
        // Apply role filter
        if (roleFilter && !roleFilter.includes(user.role)) {
          return;
        }
        
        // Apply user filter
        if (userFilter && userFilter !== user.id) {
          return;
        }
        
        // Exclude specific user
        if (excludeUser && excludeUser === user.id) {
          return;
        }
        
        try {
          client.send(JSON.stringify(message));
          targetClients++;
        } catch (error) {
          console.error(`Error sending message to ${user.email}:`, error);
          this.clients.delete(client);
        }
      } else {
        this.clients.delete(client);
      }
    });
    
    logger.log(`Message broadcast to ${targetClients} clients`);
  }

  /**
   * Broadcast to clients with specific roles
   * @param {Object} message - Message to broadcast
   * @param {Array} roles - Array of roles to broadcast to
   */
  broadcastToRoles(message, roles) {
    this.broadcastToClients(message, { roleFilter: roles });
  }

  /**
   * Send message to specific user
   * @param {Object} message - Message to send
   * @param {string} userId - Target user ID
   */
  sendToUser(message, userId) {
    this.broadcastToClients(message, { userFilter: userId });
  }

  /**
   * Get connected clients information
   * @returns {Array} - Array of client information
   */
  getConnectedClientsInfo() {
    const clientsInfo = [];
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === WebSocket.OPEN) {
        clientsInfo.push({
          user: {
            id: clientInfo.user.id,
            email: clientInfo.user.email,
            role: clientInfo.user.role,
            fullname: clientInfo.user.fullname
          },
          connectedAt: clientInfo.connectedAt,
          lastActivity: clientInfo.lastActivity
        });
      }
    });
    return clientsInfo;
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
    logger.log("WebSocket service closed");
  }

  /**
   * Clean up inactive connections
   * @param {number} maxInactiveMinutes - Maximum inactive time in minutes
   */
  cleanupInactiveConnections(maxInactiveMinutes = 30) {
    const now = new Date();
    const maxInactiveMs = maxInactiveMinutes * 60 * 1000;
    let cleanedCount = 0;

    this.clients.forEach((clientInfo, client) => {
      const inactiveTime = now - clientInfo.lastActivity;
      if (inactiveTime > maxInactiveMs) {
        logger.log(`Closing inactive connection for user: ${clientInfo.user.email}`);
        client.close(1000, "Connection inactive");
        this.clients.delete(client);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      logger.log(`Cleaned up ${cleanedCount} inactive connections`);
    }
  }
}

// Export singleton instance
export default new WebSocketService();
