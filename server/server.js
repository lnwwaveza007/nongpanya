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

const app = express();

// Load configuration based on selected environment
const config = getConfig();
const port = config.port;

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

app.listen(port, () => {
  console.log('-'.repeat(60));
  console.log(`  SERVER RUNNING ON http://localhost:${port}`);
  console.log('-'.repeat(60));
});