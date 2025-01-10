import jwt from "jsonwebtoken";
import { getCode } from "../utils/codeStore.js";
import dotenv from "dotenv";

dotenv.config();

export const signin = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404);
    }
    
    const token = jwt.sign(
      { id: user.studentId },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user.studentId,
        code: getCode()
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error authenticating user",
    });
  }
};

export const signout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).send('Logged out');
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return res.status(204).send('Logged out');
};

