import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitSymptoms } from "../controllers/medController.js";

const medRoute = Router();

medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/symptoms/submit", submitSymptoms);
medRoute.post("/symptoms/giveMedicine", giveMedicineController);

export default medRoute;
