// import passport from "passport";
import jwt from "jsonwebtoken";
import { getCode } from "../utils/codeStore.js";

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

    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    
    res.redirect(`http://localhost:5173/form?code=${getCode()}`);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).send("Error authenticating user");
  }
};

export const signout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).send('Logged out');
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return res.status(204).send('Logged out');
};

