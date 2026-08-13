import { Router } from "express";
import { inventoryController } from "./inventories.controller";

import { roles } from "@/generated/prisma/enums";
import { auth } from "@/middleware/auth";
import { requestValidator } from "@/middleware/requestValidator";
import { updateInventorySchemaDTO } from "./inventories.schema";

const router = Router();

router.get("/:id", auth(roles.SELLER), inventoryController.getInventoryById);
router.put(
  "/:id",
  auth(roles.SELLER),
  requestValidator(updateInventorySchemaDTO),
  inventoryController.updateInventory,
);
router.get(
  "/:id/details",
  auth(roles.SELLER),
  inventoryController.getInventoryDetails,
);

export const inventoryRoutes = router;
