import { Router } from "express";
import { orderController } from "./orders.controller";

const routes = Router();


routes.post("/",orderController.newOrder);


export const orderRoutes = routes;