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
import mqttService from "./services/mqttService.js";
import websocketService from "./services/websocketService.js";

const app = express();

// Load configuration based on selected environment
const config = getConfig();
const port = config.port;
const websocketPort = config.websocketPort || 3001;

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
app.use("/api/code", codeRoute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Initialize services and start server
async function startServer() {
  // Initialize MQTT service
  console.log('Initializing MQTT service...');
  mqttService.initialize();

  // Initialize WebSocket service
  console.log('Initializing WebSocket service...');
  try {
    await websocketService.initialize(websocketPort);
  } catch (error) {
    console.error('Failed to initialize WebSocket service:', error.message);
    console.log('Server will continue without WebSocket support.');
  }

  app.listen(port, () => {
    console.log('-'.repeat(60));
    console.log(`  SERVER RUNNING ON http://localhost:${port}`);
    if (websocketService.currentPort) {
      console.log(`  WEBSOCKET RUNNING ON ws://localhost:${websocketService.currentPort}`);
    }
    console.log('-'.repeat(60));
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM signal. Shutting down gracefully...');
  
  mqttService.disconnect();
  websocketService.close();
  
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT signal. Shutting down gracefully...');
  
  mqttService.disconnect();
  websocketService.close();
  
  process.exit(0);
});