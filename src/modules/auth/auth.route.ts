import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { authController } from "./auth.controller";

const routes = Router();

routes.get("/me",auth(roles.CUSTOMER,roles.ADMIN,roles.SELLER),authController.getLoggedInUser);
routes.post("/login",authController.login);
routes.post("/register",authController.register);
routes.post("/verify-email",authController.verifyEmailOtp)
routes.post("/logout",authController.logout);
routes.post("/refresh-token",auth(roles.ADMIN,roles.SELLER,roles.CUSTOMER),authController.newRefreshToken);


export const authRoutes = routes;