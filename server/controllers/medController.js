import dotenv from "dotenv";
import { MqttHandler } from "../utils/mqtt_handler.js";
import {
  createRequest,
  deleteRequest,
  getSymptoms,
  giveMedicine,
  setReqStatus,
  getMedicines,
} from "../services/medServices.js";
import * as code from "../utils/codeStore.js";
import { getQuotaByUserId } from "../services/userServices.js";
import { getAllMedicineStock } from "../services/mediStockServices.js";

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

export const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await getMedicines();

    return res.status(200).json({
      success: true,
      data: medicines,
      message: "Medicines retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineStock = async (req, res) => {
  const { expired } = req.query;

  try {
    const stock = await getAllMedicineStock(expired);

    if (!stock || stock.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medicine stock found",
      });
    }

    return res.status(200).json({
      success: true,
      data: stock,
      message: "Stock retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const giveMedicineController = async (req, res, next) => {
  const formData = req.body;
  return res
    .status(200)
    .json(
      await giveMedicine(
        formData.weight,
        formData.age,
        formData.allergies,
        formData.symptoms,
        formData.medicines
      )
    );
};

export const submitRequestForm = async (req, res, next) => {
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

    //Check quota
    if ((await getQuotaByUserId(userId)) >= 5) {
      res.status(403).json({
        success: false,
        message: "Limit Reach",
      });
      return;
    }

    const response = await createRequest(formData, userId);
    if (!response || !response.success) {
      throw new Error("Failed to create request.");
    }
    code.generateCode();
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
          const medRes = await giveMedicine(
            formData.weight,
            formData.age,
            formData.allergies,
            formData.symptoms,
            formData.medicines
          );
          await createRequestMedicines(formData.code, medRes.medicines);
          //Send Complete To Vending Machine
          mqttClient.sendMessage("nongpanya/complete", JSON.stringify(medRes));
          await setReqStatus(formData.code);
          console.log("completed");
        } catch (asyncError) {
          await deleteRequest(formData.code);
          mqttClient.sendMessage("nongpanya/complete", "error");
        }
      }, 1000);
    });
  } catch (error) {
    next(error);
  }
};
