import { Router } from "express";
import { getAllSymptoms, submitSymptoms } from "../controllers/medController.js";

const medRoute = Router();

medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/symptoms/submit", submitSymptoms);

export default medRoute;
