import { Router } from "express";
import { getQuota, getUser } from "../controllers/userController.js";
import { getUserMedicineRequestHistory } from "../controllers/medRequestController.js";

const userRoute = Router();

userRoute.get("/", getUser);
userRoute.get("/quota", getQuota);
userRoute.get("/req/history", getUserMedicineRequestHistory);

export default userRoute;
