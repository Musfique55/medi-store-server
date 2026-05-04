import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";

const routes = Router();

// public routes
routes.get("/", medicineController.getMedicines);
routes.get("/:slug", medicineController.getMedicine);

export const medicineRoutes = routes;
