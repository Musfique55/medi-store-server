import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";
import { analyticsController } from "../analytics/analytics.controller";

const router = Router();

router.get("/", auth(roles.SELLER), analyticsController.getSellersAnalytics);

export const sellerAnalyticsRoutes = router;
