
import dotenv from "dotenv";
import { MqttHandler } from "../utils/mqtt_handler.js";
import { getSymptoms } from "../models/medModels.js";
import * as code from "../utils/codeStore.js";

dotenv.config();
const mqttClient = new MqttHandler();

export const getAllSymptoms = async (req, res) => {
  try {
    const symptoms = await getSymptoms();
    
    return res.status(200).json({
      success: true,
      data: symptoms,
      message: "Symptoms retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "Internal server error",
    });
  }
}

export const submitForm = async (req, res) => {
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
};