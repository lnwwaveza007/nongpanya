import express from "express";
import cors from "cors";
import connection from "./config/database.js";
import authRoute from "./routes/authRoutes.js";
import { MqttHandler } from "./utils/mqtt_handler.js";
import * as code from "./utils/codeStore.js";
import bodyParser from "body-parser";

const app = express();
const port = 4000;
const MqttHandler = require('./utils/mqtt_handler.js');

const mqttClient = new MqttHandler();
const corsOptions = {
    origin: ['http://nongpanya-main.scnd.space:80', 'http://nongpanya-main.scnd.space', 'http://localhost'],
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/auth', authRoute);
app.get("/api/getcode", (req, res) => {
  res.status(200).json({
    code: code.generateCode(),
  });
});

app.post("/api/submit-symptoms", (req, res) => {
  const formData = req.body;

  //Check code of the form that send is current working code?
  if (formData.code !== code.getCode()) {
    res.status(200).json({
      error: "TimeoutQRCODE",
    });
    return;
  }
  //Reset Code
  code.resetCode();

  //Send Data To Vending Machine
  mqttClient.connect();
  mqttClient.sendMessage(
    "nongpanya/order",
    JSON.stringify({
      mockup: "data",
    })
  );

  //Send Response
  res.status(200).json({
    message: "susccess",
    receivedData: formData,
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
  console.log(`Server listening at http://localhost:${port}`);
});