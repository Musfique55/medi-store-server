import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";

const routes = Router();




export const userRoutes = routes;

