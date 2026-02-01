import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";

const routes = Router();

routes.get("/",auth(roles.ADMIN),userController.getUsers);
routes.post("/update-status",auth(roles.ADMIN),userController.updateUsersStatus);


export const userRoutes = routes;

