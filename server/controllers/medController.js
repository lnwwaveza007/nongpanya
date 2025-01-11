import dotenv from "dotenv";
import { MqttHandler } from "../utils/mqtt_handler.js";
import { getSymptoms } from "../models/medModels.js";
import * as code from "../utils/codeStore.js";

dotenv.config();
const mqttClient = new MqttHandler();

export const getAllSymptoms = async (req, res, next) => {
  try {
    const symptoms = await getSymptoms();

    return res.status(200).json({
      success: true,
      data: symptoms,
      message: "Symptoms retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const submitSymptoms = async (req, res, next) => {
  const formData = req.body;

  try {
    //Check code of the form that send is current working code?
    if (formData.code !== code.getCode()) {
      res.status(403).json({
        success: false,
        message: "QR code timeout",
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
    res.status(201).json({
      success: true,
      data: formData,
      message: "Submit form successfully",
    });
  } catch (error) {
    next(error);
  }
};
