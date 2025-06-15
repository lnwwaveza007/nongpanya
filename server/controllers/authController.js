import jwt from "jsonwebtoken";
import { getCode } from "../utils/codeStore.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/userServices.js";

dotenv.config();

export const signin = async (req, res, next) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(404);
    }

    const user = await findUserById(userData.id);
    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        code: getCode(),
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).send("Logged out");
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.status(204).send("Logged out");
};

export const localSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password); // assumes hashed password

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: email,
        fullname: user.fullname,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        token: token,
        fullname: user.fullname,
        role: user.role,
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const localRegister = async (req, res, next) => {
  try {
    const { email, password, fullname, role } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = createUser({
      id: uuidv4().split("-")[0],
      email: email,
      fullname: fullname,
      role: role,
      password: hashedPassword,
      auth_provider: "local",
    });

    // Issue JWT
    const token = jwt.sign(
      { id: newUser.id, email: email, fullname: fullname, role: role },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        fullname: fullname,
        role: role,
      },
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};
