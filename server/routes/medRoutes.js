import { Router } from "express";
import { getAllSymptoms, submitForm } from "../controllers/medController.js";

const medRoute = Router();

medRoute.get("/symptoms", getAllSymptoms);
medRoute.post("/symptoms/submit", submitForm);

export default medRoute;
