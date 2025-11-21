import {
  createRequest,
  deleteRequest,
  getSymptoms,
  giveMedicine,
  setReqStatus,
  getMedicines,
  createRequestMedicines,
  getMedicalInfo,
  checkMedicineAvailability,
} from "../services/medServices.js";
import * as code from "../utils/codeStore.js";
// import { getQuotaByUserId } from "../services/userServices.js";
import { getAllMedicineStock, addStock } from "../services/medStockServices.js";
import websocketService from "../services/websocketService.js";
import prisma from "../config/prismaClient.js";
import logger from "../utils/logger.js";

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

    // Check quota
    // if ((await getQuotaByUserId(userId)) >= 3) {
    //   res.status(403).json({
    //     success: false,
    //     message: "Limit Reach",
    //   });
    //   return;
    // }

    // Check medicine availability before creating request
    const availabilityCheck = await checkMedicineAvailability(
      formData.allergies,
      formData.symptoms,
      formData.medicines
    );

    if (!availabilityCheck.available) {
      return res.status(409).json({
        success: false,
        message: "Some medicines are not available",
        unavailableMedicines: availabilityCheck.unavailableMedicines,
        code: "MEDICINE_UNAVAILABLE"
      });
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
            logger.log(
              "Medicine dispensing completed for code:",
              formData.code
            );
            await setReqStatus(formData.code);
            logger.log("Order completed successfully");

            // Send completion notification via WebSocket
            websocketService.broadcastToClients({
              type: "complete",
              data: medRes,
            });
          }
        } catch (asyncError) {
          await setReqStatus(formData.code, "failed");
          logger.log("Error in async operation:", asyncError);
          // Log error completion
          logger.log("Medicine dispensing failed for code:", formData.code);

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

export const checkMedicineAvailabilityController = async (req, res, next) => {
  const { allergies, symptoms, medicines } = req.body;

  try {
    const availabilityCheck = await checkMedicineAvailability(
      allergies,
      symptoms,
      medicines
    );

    return res.status(200).json({
      success: true,
      data: {
        available: availabilityCheck.available,
        unavailableMedicines: availabilityCheck.unavailableMedicines
      },
      message: availabilityCheck.available 
        ? "All medicines are available" 
        : "Some medicines are not available"
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
    logger.log("Adding stock for medicineId:", medicineId, "amount:", amount, "expireAt:", expireAt);
    // Validate medicine ID
    const medicineIdInt = parseInt(medicineId);
    if (isNaN(medicineIdInt) || medicineIdInt <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    // Validate amount
    const amountInt = parseInt(amount);
    if (isNaN(amountInt) || amountInt <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Validate and convert date string to ISO DateTime format
    let expireDateTime;
    try {
      const dateStr = expireAt.toString();
      if (dateStr.includes('T')) {
        // Already has time component
        expireDateTime = new Date(dateStr).toISOString();
      } else {
        // Add time component for date-only strings
        expireDateTime = new Date(dateStr + "T00:00:00.000Z").toISOString();
      }
      
      // Validate the resulting date
      if (isNaN(new Date(expireDateTime).getTime())) {
        throw new Error(`Invalid date: ${expireAt}`);
      }
      
      // Check if date is in the past (allow today's date)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const expireDate = new Date(expireDateTime);
      expireDate.setHours(0, 0, 0, 0); // Start of expire date
      
      if (expireDate < today) {
        return res.status(400).json({
          success: false,
          message: "Expiration date cannot be in the past",
        });
      }
    } catch (dateError) {
      return res.status(400).json({
        success: false,
        message: `Invalid expireAt date format: ${expireAt}. Expected format: YYYY-MM-DD`,
      });
    }

    const result = await addStock(medicineIdInt, amountInt, expireDateTime);

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
      // Validate and convert date string to ISO DateTime format
      if (!entry.expire_at) {
        throw new Error(`Missing expire_at for stock entry`);
      }

      let expireDateTime;
      try {
        // Handle different date formats
        const dateStr = entry.expire_at.toString();
        if (dateStr.includes('T')) {
          // Already has time component
          expireDateTime = new Date(dateStr).toISOString();
        } else {
          // Add time component for date-only strings
          expireDateTime = new Date(dateStr + "T00:00:00.000Z").toISOString();
        }
        
        // Validate the resulting date
        if (isNaN(new Date(expireDateTime).getTime())) {
          throw new Error(`Invalid date format: ${entry.expire_at}`);
        }
      } catch (dateError) {
        throw new Error(`Invalid expire_at date format: ${entry.expire_at}. Expected format: YYYY-MM-DD`);
      }

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
