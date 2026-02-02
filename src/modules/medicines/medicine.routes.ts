import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";

const routes = Router();


routes.post("/",auth(roles.SELLER),medicineController.createMedicine);
routes.get("/",medicineController.getMedicines);
routes.get("/:id",medicineController.getMedicine);
routes.patch("/:id/stock",auth(roles.SELLER),medicineController.updateStocks);
routes.put("/:id",auth(roles.SELLER),medicineController.updateMedicine);
routes.delete("/:id",auth(roles.SELLER),medicineController.deleteMedicine);


export const medicineRoutes = routes;