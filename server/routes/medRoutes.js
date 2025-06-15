import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitRequestForm, getAllMedicines, getMedicineStock } from "../controllers/medController.js";
import { getMedicineRequestTimeSeries, getMedicineRequestHistory, getMedicineRank } from "../controllers/medRequestController.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const medRoute = Router();

medRoute.get("/", getAllMedicines);
medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/form", submitRequestForm);
medRoute.post("/form/test", giveMedicineController);

// Dashboard routes
medRoute.get("/stock", authorizeRoles("admin","superadmin") , getMedicineStock);
medRoute.get("/req/timeseries", authorizeRoles("admin","superadmin"), getMedicineRequestTimeSeries);
medRoute.get("/req/rank", authorizeRoles("admin","superadmin"), getMedicineRank);
medRoute.get("/req/history", authorizeRoles("admin","superadmin"), getMedicineRequestHistory);

export default medRoute;
