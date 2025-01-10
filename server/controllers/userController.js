
import dotenv from "dotenv";
import { findUserById } from "../models/userModels.js";

dotenv.config();

export const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const [response] = await findUserById(userId);
    return res.status(200).json({
      success: true,
      data: response,
      message: "User retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "Internal server error",
    });
  }
}
