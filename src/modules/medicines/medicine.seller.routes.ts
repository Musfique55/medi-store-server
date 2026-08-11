import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";
import { multerStorage } from "../../config/multer";
import { productImageUploadMiddleware } from "../../middleware/productImageUploadMiddleware";

const router = Router();

router.get("/", auth(roles.SELLER), medicineController.getSellersMedicine);
router.post(
  "/",
  //   auth(roles.SELLER),
  multerStorage.array("files", 5),
  productImageUploadMiddleware,
  medicineController.createMedicine,
);
router.patch("/:id/stock", auth(roles.SELLER), medicineController.updateStocks);
router.put("/:id", auth(roles.SELLER), medicineController.updateMedicine);
router.delete("/:id", auth(roles.SELLER), medicineController.deleteMedicine);

export const sellerMedicineRoutes = router;
