import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { categoryController } from "./categories.controller";

const routes = Router();

// public routes
routes.get("/",categoryController.getCategories);


export const categoryRoutes = routes;