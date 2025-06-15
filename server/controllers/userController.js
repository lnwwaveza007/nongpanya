import dotenv from "dotenv";
import { findUserById, getQuotaByUserId } from "../services/userServices.js";

dotenv.config();

export const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const response = await findUserById(userId);
    return res.status(200).json({
      success: true,
      data: response,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getQuota = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const response = await getQuotaByUserId(userId);
    return res.status(200).json({
      success: true,
      data: response,
      message: "Quota retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
}