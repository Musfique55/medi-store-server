import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { authController } from "./auth.controller";

const routes = Router();

routes.get("/me",auth(roles.CUSTOMER,roles.ADMIN,roles.SELLER),authController.getLoggedInUser);

export const authRoutes = routes;