import { Router } from "express";
import { medicineRoutes } from "../modules/medicines/medicine.routes";
import { categoryRoutes } from "../modules/categories/categories.routes";
import { manufacturerRoutes } from "../modules/manufacturer/manufacturer.route";
import { orderRoutes } from "../modules/orders/orders.routes";
import { sellerOrderRoutes } from "../modules/orders/seller.orders.route";
import { reviewsRoutes } from "../modules/reviews/reviews.route";
import { authRoutes } from "../modules/auth/auth.route";
import { adminOrderRoutes } from "../modules/orders/admin.orders.route";
import { cartRoutes } from "../modules/cart/cart.routes";
import { userAdminRoutes } from "../modules/users/user.admin.routes";
import { categoryAdminRoutes } from "../modules/categories/category.admin.routes";
import { manufacturerAdminRoutes } from "../modules/manufacturer/manufacturer.admin.route";
import { sellerMedicineRoutes } from "../modules/medicines/medicine.seller.routes";
import { sellerAnalyticsRoutes } from "../modules/seller/seller.routes";
import { inventoryRoutes } from "@/modules/inventories/inventories.routes";

const routes = Router();

// admin routes
routes.use("/admin/users", userAdminRoutes);
routes.use("/admin/categories", categoryAdminRoutes);
routes.use("/admin/manufacturer", manufacturerAdminRoutes);
routes.use("/admin/orders", adminOrderRoutes);

// for all roles expect public
routes.use("/auth", authRoutes);

// customer routes
routes.use("/medicines", medicineRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/manufacturer", manufacturerRoutes);
routes.use("/orders", orderRoutes);
routes.use("/reviews", reviewsRoutes);
routes.use("/cart", cartRoutes);

// seller routes
routes.use("/seller/medicines", sellerMedicineRoutes);
routes.use("/seller/orders", sellerOrderRoutes);
routes.use("/seller/analytics", sellerAnalyticsRoutes);
routes.use("/inventories", inventoryRoutes);

export const routeHandlers = routes;
