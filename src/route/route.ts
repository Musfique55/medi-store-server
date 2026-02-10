import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { medicineRoutes } from "../modules/medicines/medicine.routes";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { manufacturerRoutes } from "../modules/manufacturer/manufacturer.route";
import { customerOrderRoutes } from "../modules/orders/customer.orders.routes";
import { sellerOrderRoutes } from "../modules/orders/seller.orders.route";
import { reviewsRoutes } from "../modules/reviews/reviews.route";
import { authRoutes } from "../modules/auth/auth.route";
import { adminOrderRoutes } from "../modules/orders/admin.orders.route";

const routes = Router();

// admin routes
routes.use("/admin/users",userRoutes);
routes.use("/admin/categories",categoryRoutes);
routes.use("/admin/manufacturer",manufacturerRoutes);
routes.use("/admin/orders",adminOrderRoutes);


// for all roles expect public
routes.use("/auth",authRoutes);


// public routes
routes.use("/medicines",medicineRoutes);
routes.use("/categories",categoryRoutes);
routes.use("/manufacturer",manufacturerRoutes);


// seller routes
routes.use("/seller/medicines",medicineRoutes);
routes.use("/seller/orders",sellerOrderRoutes);

// customer route
routes.use("/orders",customerOrderRoutes);
routes.use("/reviews",reviewsRoutes);


export const routeHandlers = routes;