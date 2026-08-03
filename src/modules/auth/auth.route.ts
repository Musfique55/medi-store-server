import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { authController } from "./auth.controller";
import { authRateLimiter } from "../../middleware/authRateLimiter";

const routes = Router();

routes.get(
  "/me",
  auth(roles.CUSTOMER, roles.ADMIN, roles.SELLER),
  authController.getLoggedInUser,
);
routes.post("/login", authRateLimiter, authController.login);
routes.post("/register", authRateLimiter, authController.register);
// routes.post("/verify-email", authRateLimiter, authController.verifyEmailOtp);
routes.post("/logout", authController.logout);
routes.post("/refresh-token", authController.newRefreshToken);

export const authRoutes = routes;
