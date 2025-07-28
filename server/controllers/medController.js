import {
  createRequest,
  deleteRequest,
  getSymptoms,
  giveMedicine,
  setReqStatus,
  getMedicines,
  createRequestMedicines,
  getMedicalInfo,
} from "../services/medServices.js";
import * as code from "../utils/codeStore.js";
import { getQuotaByUserId } from "../services/userServices.js";
import { getAllMedicineStock } from "../services/medStockServices.js";
import websocketService from "../services/websocketService.js";

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
    if ((await getQuotaByUserId(userId)) >= 3) {
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

    // Send order processing notification via WebSocket
    websocketService.broadcastToClients({
      type: 'order',
      data: {
        success: true,
        code: formData.code,
        message: 'Medicine order is being processed'
      }
    });

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
          await createRequestMedicines(formData.code, medRes);
          // Log successful completion
          console.log("Medicine dispensing completed for code:", formData.code);
          await setReqStatus(formData.code);
          console.log("Order completed successfully");
          
          // Send completion notification via WebSocket
          websocketService.broadcastToClients({
            type: 'complete',
            data: medRes
          });
        } catch (asyncError) {
          await deleteRequest(formData.code);
          console.log("Error in async operation:", asyncError);
          // Log error completion
          console.log("Medicine dispensing failed for code:", formData.code);
          
          // Send error notification via WebSocket
          websocketService.broadcastToClients({
            type: 'complete',
            data: "error"
          });
        }
      }, 1000);
    });
  } catch (error) {
    next(error);
  }
};

export const getMedInfo = async (req, res, next) => {
  const { medId } = req.params;
  const medInfo = await getMedicalInfo(parseInt(medId));
  return res.status(200).json({
    success: true,
    data: medInfo,
    message: "Medicine info retrieved successfully",
  });
};