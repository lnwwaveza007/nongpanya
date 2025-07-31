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
import { getAllMedicineStock, addStock } from "../services/medStockServices.js";
import websocketService from "../services/websocketService.js";
import prisma from "../config/prismaClient.js";

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

export const getMedicineStock = async (req, res, next) => {
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
      type: "order",
      data: {
        success: true,
        code: formData.code,
        message: "Medicine order is being processed",
      },
    });

    setImmediate(() => {
      setTimeout(async () => {
        try {
          // Medicine dispensing
          const medRes = await giveMedicine(
            formData.allergies,
            formData.symptoms,
            formData.medicines
          );
          console.log("Medicine dispensing result:", medRes, !medRes);

          if (!medRes || medRes.length === 0) {
            await setReqStatus(formData.code, "failed");

            // Send error notification via WebSocket
            websocketService.broadcastToClients({
              type: "complete",
              data: [],
            });
          } else {
            await createRequestMedicines(formData.code, medRes);
            // Log successful completion
            console.log(
              "Medicine dispensing completed for code:",
              formData.code
            );
            await setReqStatus(formData.code);
            console.log("Order completed successfully");

            // Send completion notification via WebSocket
            websocketService.broadcastToClients({
              type: "complete",
              data: medRes,
            });
          }
        } catch (asyncError) {
          await setReqStatus(formData.code, "failed");
          console.log("Error in async operation:", asyncError);
          // Log error completion
          console.log("Medicine dispensing failed for code:", formData.code);

          // Send error notification via WebSocket
          websocketService.broadcastToClients({
            type: "complete",
            data: "error",
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

export const addStockController = async (req, res, next) => {
  const { medicineId, amount, expireAt } = req.body;

  try {
    if (!medicineId || !amount || !expireAt) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: medicineId, amount, expireAt",
      });
    }

    // Convert date string to ISO DateTime format
    const expireDateTime = new Date(expireAt + "T00:00:00.000Z").toISOString();

    const result = await addStock(medicineId, amount, expireDateTime);

    return res.status(201).json({
      success: true,
      data: result,
      message: "Stock added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateStockController = async (req, res, next) => {
  const { stockEntries } = req.body;
  const { medicineId } = req.params;

  try {
    if (!stockEntries || !Array.isArray(stockEntries)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid stockEntries array",
      });
    }

    // First, remove all existing stock for this medicine
    await prisma.medicine_stocks.deleteMany({
      where: { medicine_id: parseInt(medicineId) },
    });

    // Then add the new stock entries
    const results = [];
    for (const entry of stockEntries) {
      // Convert date string to ISO DateTime format
      const expireDateTime = new Date(
        entry.expire_at + "T00:00:00.000Z"
      ).toISOString();

      const result = await addStock(
        parseInt(medicineId),
        entry.stock_amount,
        expireDateTime
      );
      results.push(result);
    }

    return res.status(200).json({
      success: true,
      data: results,
      message: "Stock updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
