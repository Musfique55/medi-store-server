import { Router } from "express";
import { medicineController } from "./medicine.controller";

const routes = Router();

// public routes
routes.get("/", medicineController.getMedicines);
routes.get("/top-medicines", medicineController.topMedicines);
routes.get("/:slug", medicineController.getMedicine);

export const medicineRoutes = routes;
