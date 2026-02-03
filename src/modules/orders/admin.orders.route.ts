import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { orderController } from "./orders.controller";

const routes = Router();

routes.get("/",auth(roles.ADMIN),orderController.getAllOrders);

export const adminOrderRoutes = routes;