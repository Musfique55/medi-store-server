import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";

const router = Router();

router.post("/",auth(roles.SELLER),medicineController.createMedicine);
router.patch("/:id/stock",auth(roles.SELLER),medicineController.updateStocks);
router.put("/:id",auth(roles.SELLER),medicineController.updateMedicine);
router.delete("/:id",auth(roles.SELLER),medicineController.deleteMedicine);

export const sellerMedicineRoutes = router;