import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { orderController } from "./orders.controller";

const routes = Router();

routes.patch('/:id',auth(roles.SELLER),orderController.updateOrderStatus);
routes.get('/',auth(roles.SELLER),orderController.getSellersOrder);

export const sellerOrderRoutes = routes;