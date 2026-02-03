import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { medicineRoutes } from "../modules/medicines/medicine.routes";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { manufacturerRoutes } from "../modules/manufacturer/manufacturer.route";
import { orderRoutes } from "../modules/orders/orders.routes";

const routes = Router();


routes.use("/users",userRoutes);
routes.use("/medicines",medicineRoutes);
routes.use("/categories",categoryRoutes);
routes.use("/manufacturer",manufacturerRoutes);
routes.use("/orders",orderRoutes);

export const routeHandlers = routes;