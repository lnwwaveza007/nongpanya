import * as code from "../utils/codeStore";

export const getCurrentCode = (req, res, next) => {
  try {
    const currentCode = code.generateCode();

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
    const { reqCode } = req.params;

    if (reqCode !== code.getCode()) {
      return res.status(403).json({
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
