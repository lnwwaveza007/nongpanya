import { Router } from "express";
import { getCurrentCode, validateCode } from "../controllers/codeController.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const codeRoute = Router();

codeRoute.get("/", authorizeRoles('screen'), getCurrentCode);
codeRoute.get("/validate", validateCode);

export default codeRoute;
