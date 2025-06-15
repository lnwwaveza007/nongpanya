import {
  getMedicineRequestTimeSeriesByDate,
  getAllTimeMedicineRank,
  getRequestHistoryByDate,
} from "../services/dashboardServices.js";

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

export const getRequestHistory = async (req, res, next) => {
  try {
    const { date } = req.query;

    const response = await getRequestHistoryByDate(date);

    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the specified date",
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
