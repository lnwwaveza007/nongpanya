import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitRequestForm, getAllMedicines, getMedicineStock } from "../controllers/medController.js";

const medRoute = Router();

medRoute.get("/", getAllMedicines);
medRoute.get("/symptoms", getAllSymptoms);
medRoute.get("/stock", getMedicineStock);
medRoute.post("/form", submitRequestForm);
medRoute.post("/form/test", giveMedicineController);

export default medRoute;
