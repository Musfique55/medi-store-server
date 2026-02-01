import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";

const routes = Router();


routes.post("/",auth(roles.SELLER),medicineController.createMedicine);


export const medicineRoutes = routes;