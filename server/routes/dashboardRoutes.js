import { Router } from "express";
import { getMedicineRequestTimeSeries, getMedicineRank, getRequestHistory } from "../controllers/dashboardController.js";

const dashboardRoute = Router();

dashboardRoute.get("/med/timeseries", getMedicineRequestTimeSeries);
dashboardRoute.get("/med/rank", getMedicineRank);
dashboardRoute.get("/med/history", getRequestHistory);

export default dashboardRoute;
