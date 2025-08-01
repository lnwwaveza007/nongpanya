import { Router } from "express";
import { getAllSymptoms, giveMedicineController, submitRequestForm, getAllMedicines, getMedicineStock, getMedInfo, addStockController, updateStockController, checkMedicineAvailabilityController } from "../controllers/medController.js";
import { getMedicineRequestTimeSeries, getMedicineRequestHistory, getMedicineRank } from "../controllers/medRequestController.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const medRoute = Router();

medRoute.get("/", getAllMedicines);
medRoute.get("/:medId/info", getMedInfo);
medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/form", submitRequestForm);
medRoute.post("/form/test", giveMedicineController);
medRoute.post("/form/check-availability", checkMedicineAvailabilityController);

// Dashboard routes
medRoute.get("/stock", authorizeRoles("admin","superadmin") , getMedicineStock);
medRoute.get("/req/timeseries", authorizeRoles("admin","superadmin"), getMedicineRequestTimeSeries);
medRoute.get("/req/rank", authorizeRoles("admin","superadmin"), getMedicineRank);
medRoute.get("/req/history", authorizeRoles("admin","superadmin"), getMedicineRequestHistory);

// Stock management routes
medRoute.post("/stock/add", authorizeRoles("admin","superadmin"), addStockController);
medRoute.put("/stock/:medicineId/update", authorizeRoles("admin","superadmin"), updateStockController);

export default medRoute;
