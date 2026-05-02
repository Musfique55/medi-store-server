import { Router } from "express";
import { auth } from "../../middleware/auth";
import { categoryController } from "./categories.controller";
import { roles } from "../../generated/prisma/enums";

const router = Router();

router.post("/",auth(roles.ADMIN),categoryController.createCategory);
router.put("/update/:id",auth(roles.ADMIN),categoryController.updateCategory);
router.delete("/delete/:id",auth(roles.ADMIN),categoryController.deleteCategory);

export const categoryAdminRoutes = router;