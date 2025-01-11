import { generateCode, getCode } from "../utils/codeStore.js";

export const getCurrentCode = (req, res, next) => {
  try {
    const currentCode = generateCode();

    res.status(200).json({
      success: true,
      code: currentCode,
    });
  } catch (error) {
    next(error);
  }
};

export const validateCode = (req, res, next) => {
  try {
    const code = req.query.code;
    if (code !== getCode() || code === "") {
      return res.status(200).json({
        success: false,
        message: "QR code invalid",
      });
    }

    res.status(200).json({
      success: true,
      message: "QR code valid",
    });
  } catch (error) {
    next(error);
  }
};
