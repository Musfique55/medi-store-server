import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";

const router = Router();

router.get("/",auth(roles.ADMIN),userController.getUsers);
router.post("/update-status",auth(roles.ADMIN),userController.updateUsersStatus);

export const userAdminRoutes = router;