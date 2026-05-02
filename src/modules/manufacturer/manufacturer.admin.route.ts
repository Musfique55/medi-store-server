import { Router } from "express";
import { auth } from "../../middleware/auth";
import { manufacturerController } from "./manufacturer.controller";
import { roles } from "../../generated/prisma/enums";

const router = Router();

router.post("/",auth(roles.ADMIN),manufacturerController.createManufacturer);

export const manufacturerAdminRoutes = router;