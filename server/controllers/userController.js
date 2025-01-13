import dotenv from "dotenv";
import { findUserById, getQouta } from "../models/userModels.js";

dotenv.config();

export const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const [response] = await findUserById(userId);
    return res.status(200).json({
      success: true,
      data: response,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getQoutaController = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const response = await getQouta(userId);
    return res.status(200).json({
      success: true,
      data: response,
      message: "Qouta retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
}