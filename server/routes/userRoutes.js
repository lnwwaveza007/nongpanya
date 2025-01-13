import { Router } from "express";
import { getQoutaController, getUser } from "../controllers/userController.js";

const userRoute = Router();

userRoute.get("/", getUser);
userRoute.get("/qouta", getQoutaController);

export default userRoute;
