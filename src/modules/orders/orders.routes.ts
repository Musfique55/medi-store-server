import { Router } from "express";
import { orderController } from "./orders.controller";
import { roles } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const routes = Router();


routes.post("/",orderController.newOrder);
routes.patch('/:id/order-status',auth(roles.SELLER),orderController.updateOrderStatus);


export const orderRoutes = routes;