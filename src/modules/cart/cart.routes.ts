import { Router } from "express";
import { cartController } from "./cart.controller";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";

const router = Router();

router.get("/", cartController.getCart);
router.post("/", cartController.createCart);
router.delete("/:productId", cartController.removeProductFromCart);
router.patch("/:productId", cartController.updateQuantityFromCart);
router.post("/merge", auth(roles.CUSTOMER), cartController.mergeCart);

export const cartRoutes = router;
