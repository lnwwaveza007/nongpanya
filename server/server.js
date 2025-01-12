import express from "express";
import cors from "cors";
import connection from "./config/database.js";
import authRoute from "./routes/authRoutes.js";
import * as code from "./utils/codeStore.js";
import bodyParser from "body-parser";
import authenticateToken from "./middlewares/authenticateToken.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";
import medRoute from "./routes/medRoutes.js";
import codeRoute from "./routes/codeRoutes.js";

const app = express();
const port = 3000;

const corsOptions = {
    origin: ['http://localhost:3001','https://nongpanya-website2.scnd.space'],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/user', authenticateToken, userRoute);
// app.use('/api/med', authenticateToken, medRoute);
app.use('/api/med', medRoute);
app.use('/api/auth', authRoute);
app.use("/api/code", codeRoute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database is connected");
  }
});


app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});