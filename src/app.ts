import express from "express";
import * as Sentry from "@sentry/node";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { routeHandlers } from "./route/route";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import cookieParser from "cookie-parser";
import path from "path";
import cron from "node-cron";
import { cartServices } from "./modules/cart/cart.services";
import redis from "redis";
import { envVars } from "./config/env";

export const redisClient = redis.createClient({
  url: envVars.REDIS_URL,
});

(async () => {
  redisClient.on("error", (err) => console.log("redis error:", err));

  redisClient.on("ready", () => {
    console.log("redis client started");
  });

  await redisClient.connect();

  await redisClient.ping();
})();

const app = express();

app.use(express.json());
app.set("query parser", "extended");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.set("view-engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/templates"));

app.all("/api/auth/*splat", toNodeHandler(auth));

//this will run the clearExpiredCart function every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  await cartServices.clearExpiredCart();
});

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.get("/sentry-debug", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.use("/api/v1", routeHandlers);

Sentry.setupExpressErrorHandler(app);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
