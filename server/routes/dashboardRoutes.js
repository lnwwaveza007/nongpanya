import { Router } from "express";
import { getMedicineRequestTimeSeries, getMedicineRank } from "../controllers/dashboardController.js";

const dashboardRoute = Router();

dashboardRoute.get("/med/timeseries", getMedicineRequestTimeSeries);
dashboardRoute.get("/med/rank", getMedicineRank);

export default dashboardRoute;
