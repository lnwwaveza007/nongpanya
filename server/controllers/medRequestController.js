import {
  getMedicineRequestTimeSeriesByDate,
  getAllTimeMedicineRank,
  getMedicineRequestHistoryByDate,
  getMedicineRequestHistoryByUserId,
} from "../services/medRequestServices.js";

export const getMedicineRequestTimeSeries = async (req, res, next) => {
  try {
    const { date } = req.query;
    const response = await getMedicineRequestTimeSeriesByDate(date);

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineRank = async (req, res, next) => {
  try {
    const response = await getAllTimeMedicineRank();

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineRequestHistory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const response = await getMedicineRequestHistoryByDate(startDate, endDate);

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the specified date range",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
}

export const getUserMedicineRequestHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const response = await getMedicineRequestHistoryByUserId(userId);

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the user",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Data retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
}