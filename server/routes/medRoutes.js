import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitRequestForm, getAllMedicines, getMedicineStock } from "../controllers/medController.js";
import { getMedicineRequestTimeSeries, getMedicineRequestHistory, getMedicineRank } from "../controllers/medRequestController.js";

const medRoute = Router();

medRoute.get("/", getAllMedicines);
medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/form", submitRequestForm);
medRoute.post("/form/test", giveMedicineController);

// Dashboard routes
medRoute.get("/stock", getMedicineStock);
medRoute.get("/req/timeseries", getMedicineRequestTimeSeries);
medRoute.get("/req/rank", getMedicineRank);
medRoute.get("/req/history", getMedicineRequestHistory);

export default medRoute;
