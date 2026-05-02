import { Router } from "express";
import { cartController } from "./cart.controller";

const router = Router();

router.get("/",cartController.getCart);
router.post("/",cartController.createCart);


export const cartRoutes = router;