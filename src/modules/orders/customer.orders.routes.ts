import { Router } from "express";
import { orderController } from "./orders.controller";
import { roles } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const routes = Router();

// customer routes
routes.get('/',auth(roles.CUSTOMER),orderController.getUserOrders);
routes.get('/:id',auth(roles.CUSTOMER),orderController.getOrderDetails);
routes.post("/",auth(roles.CUSTOMER),orderController.newOrder);





export const customerOrderRoutes = routes;