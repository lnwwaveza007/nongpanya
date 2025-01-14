import { Router } from "express";
import { getCurrentCode, validateCode } from "../controllers/codeController.js";

const codeRoute = Router();

codeRoute.get("/", getCurrentCode);
codeRoute.get("/validate", validateCode);

export default codeRoute;
