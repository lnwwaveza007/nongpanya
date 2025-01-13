import dotenv from "dotenv";
import { MqttHandler } from "../utils/mqtt_handler.js";
import { createRequest, getSymptoms, giveMedicine } from "../models/medModels.js";
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

export const giveMedicineController = async (req, res, next) => {
  return res.status(200).json(await giveMedicine([1,4,8], 52));
}

export const submitSymptoms = async (req, res, next) => {
  const formData = req.body;
  const userId = req.user.id;

  try {
    //Check code of the form that send is current working code?
    if (formData.code !== code.getCode()) {
      res.status(403).json({
        success: false,
        message: "QR code timeout",
      });
      return;
    }

    const response = await createRequest(formData, userId);
    if (!response || !response.success) {
      throw new Error("Failed to create request.");
    }
    code.resetCode();
    res.status(201).json({
      success: true,
      data: formData,
      message: "Submit form successfully",
    });

    //Send Data To Vending Machine
    mqttClient.connect();
    mqttClient.sendMessage(
      "nongpanya/order",
      JSON.stringify({ message: "order" })
    );


    setImmediate(() => {
      setTimeout(async () => {
        try {
          // Medicine dispensing
          const medRes = await giveMedicine(formData.symptoms, formData.weight);

          //Send Complete To Vending Machine
          mqttClient.sendMessage(
            "nongpanya/complete",
            JSON.stringify(medRes)
          );
        } catch (asyncError) {
          mqttClient.sendMessage(
            "nongpanya/complete",
            "error"
          );
        }
      }, 1000); 
    });
  } catch (error) {
    next(error);
  }
};
