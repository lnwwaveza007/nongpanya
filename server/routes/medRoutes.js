import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitSymptoms, getAllMedicines } from "../controllers/medController.js";

const medRoute = Router();

medRoute.get("/", getAllMedicines);
medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/submit", submitSymptoms);
medRoute.post("/submit/test", giveMedicineController);

export default medRoute;
