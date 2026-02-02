import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { medicineRoutes } from "../modules/medicines/medicine.routes";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { manufacturerRoutes } from "../modules/manufacturer/manufacturer.route";

const routes = Router();


routes.use("/admin/users",userRoutes);
routes.use("/seller/medicines",medicineRoutes);
routes.use("/admin/categories",categoryRoutes);
routes.use("/admin/manufacturer",manufacturerRoutes)

export const routeHandlers = routes;