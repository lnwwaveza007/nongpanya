import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import authenticateToken from "./middlewares/authenticateToken.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";
import medRoute from "./routes/medRoutes.js";
import codeRoute from "./routes/codeRoutes.js";
import { getConfig, getCorsOrigins } from "./config/envConfig.js";
import websocketService from "./services/websocketService.js";
import { generateCode } from "./utils/codeStore.js";
import logger from "./utils/logger.js";

const app = express();

// Load configuration based on selected environment
const config = getConfig();
const port = config.port;
const websocketPort = config.websocketPort || 3002;

const corsOptions = {
    origin: getCorsOrigins(),
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/user', authenticateToken, userRoute);
// app.use('/api/user', userRoute);
app.use('/api/med', authenticateToken, medRoute);
// app.use('/api/med', medRoute);
app.use('/api/auth', authRoute);
app.use("/api/code", authenticateToken, codeRoute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Initialize services and start server
async function startServer() {
  // Initialize WebSocket service
  logger.log('Initializing WebSocket service...');
  generateCode();
  try {
    await websocketService.initialize(websocketPort);
  } catch (error) {
    console.error('Failed to initialize WebSocket service:', error.message);
    logger.log('Server will continue without WebSocket support.');
  }

  app.listen(port, () => {
    logger.log('-'.repeat(60));
    logger.log(`  SERVER RUNNING ON http://localhost:${port}`);
    if (websocketService.currentPort) {
      logger.log(`  WEBSOCKET RUNNING ON ws://localhost:${websocketService.currentPort}`);
    }
    logger.log('-'.repeat(60));
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.log('\nReceived SIGTERM signal. Shutting down gracefully...');
  websocketService.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.log('\nReceived SIGINT signal. Shutting down gracefully...');
  websocketService.close();
  process.exit(0);
});