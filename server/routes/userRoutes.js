import { Router } from "express";
import { getQuota, getUser } from "../controllers/userController.js";

const userRoute = Router();

userRoute.get("/", getUser);
userRoute.get("/quota", getQuota);

export default userRoute;
