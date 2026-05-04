import { Router } from "express";
import { orderController } from "./orders.controller";
import { roles } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { orderValidator } from "./order.validator";
import { orderRequestValidator } from "../../validators/orderRequestValidator";

const routes = Router();

// customer routes
routes.get("/", auth(roles.CUSTOMER), orderController.getUserOrders);
routes.get(
  "/delivered",
  auth(roles.CUSTOMER),
  orderController.getDeliveredOrders,
);
routes.get(
  "/status/:status",
  auth(roles.CUSTOMER),
  orderController.getOrdersByStatus,
);
routes.get("/:id", auth(roles.CUSTOMER), orderController.getOrderDetails);
routes.post(
  "/",
  auth(roles.CUSTOMER),
  orderRequestValidator(orderValidator.orderItemSchema),
  orderController.newOrder,
);

export const orderRoutes = routes;
