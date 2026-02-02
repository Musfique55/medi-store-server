import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { medicineRoutes } from "../modules/medicines/medicine.routes";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { manufacturerRoutes } from "../modules/manufacturer/manufacturer.route";
import { orderRoutes } from "../modules/orders/orders.routes";

const routes = Router();


routes.use("/admin/users",userRoutes);
routes.use("/seller/medicines",medicineRoutes);
routes.use("/admin/categories",categoryRoutes);
routes.use("/admin/manufacturer",manufacturerRoutes);
routes.use("/orders",orderRoutes);

export const routeHandlers = routes;