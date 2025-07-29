import jwt from "jsonwebtoken";
import { getCode } from "../utils/codeStore.js";
import { shouldGetPermanentToken } from "../utils/tokenUtils.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/userServices.js";

dotenv.config();

/**
 * Creates JWT token with appropriate expiration based on user role
 * @param {Object} payload - Token payload
 * @param {string} role - User role
 * @returns {string} - JWT token
 */
const createTokenForRole = (payload, role) => {
  const jwtOptions = shouldGetPermanentToken(role) 
    ? {} // No expiration for superadmin (permanent token)
    : { expiresIn: "3h" };
  
  return jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
};

/**
 * Sets cookie with appropriate options based on user role
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 * @param {string} role - User role
 */
const setCookieForRole = (res, token, role) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  
  // Set cookie maxAge based on user role
  if (!shouldGetPermanentToken(role)) {
    cookieOptions.maxAge = 3 * 60 * 60 * 1000; // 3 hours for regular users
  }
  // For superadmin, no maxAge means session cookie (permanent until browser closes)
  
  res.cookie("token", token, cookieOptions);
};

export const signin = async (req, res, next) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(404);
    }

    const user = await findUserById(userData.id);
    
    // Create token with appropriate expiration for user role
    const tokenPayload = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    };
    
    const token = createTokenForRole(tokenPayload, user.role);
    setCookieForRole(res, token, user.role);

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        code: getCode(),
        permanentToken: shouldGetPermanentToken(user.role),
      },
      message: shouldGetPermanentToken(user.role) 
        ? "Signed in successfully with permanent token" 
        : "Signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(204).send("Logged out");
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
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

    // Create token with appropriate expiration for user role
    const tokenPayload = {
      id: user.id,
      email: email,
      fullname: user.fullname,
      role: user.role,
    };
    
    const token = createTokenForRole(tokenPayload, user.role);
    setCookieForRole(res, token, user.role);

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        token: token,
        fullname: user.fullname,
        role: user.role,
        permanentToken: shouldGetPermanentToken(user.role),
      },
      message: shouldGetPermanentToken(user.role) 
        ? "Signed in successfully with permanent token" 
        : "Signed in successfully",
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

    // Create token with appropriate expiration for user role
    const tokenPayload = {
      id: newUser.id,
      email: email,
      fullname: fullname,
      role: role,
    };
    
    const token = createTokenForRole(tokenPayload, role);
    setCookieForRole(res, token, role);

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        fullname: fullname,
        role: role,
        permanentToken: shouldGetPermanentToken(role),
      },
      message: shouldGetPermanentToken(role) 
        ? "Registration successful with permanent token" 
        : "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};
