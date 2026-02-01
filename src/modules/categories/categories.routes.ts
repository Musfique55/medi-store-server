import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { categoryController } from "./categories.controller";

const routes = Router();

routes.post("/",auth(roles.ADMIN),categoryController.createCategory);
routes.put("/update/:id",auth(roles.ADMIN),categoryController.updateCategory);
routes.delete("/delete/:id",categoryController.deleteCategory);
routes.get("/",auth(roles.ADMIN),categoryController.getCategories);

export const categoryRoutes = routes;