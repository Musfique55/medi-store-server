import { Router } from "express";
import { manufacturerController } from "./manufacturer.controller";
import { roles } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const routes = Router();

routes.post("/",auth(roles.ADMIN),manufacturerController.createManufacturer);
routes.get("/",manufacturerController.getManufacturers);

export const manufacturerRoutes = routes;
