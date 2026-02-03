import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { auth } from "../../middleware/auth";
import { roles } from "../../generated/prisma/enums";

const routes = Router();


routes.post("/",auth(roles.CUSTOMER),reviewsController.giveReview);
routes.delete("/:id",auth(roles.CUSTOMER),reviewsController.deleteReview);

export const reviewsRoutes = routes;