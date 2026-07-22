import { NextFunction, Request, Response } from "express";
import { redisClient } from "../app";
import { sendResponse } from "../helper/sendResponse";

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function authRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const clientIp = req.ip || "unknown";
    const rateLimiterKey = `auth_rate_limit:${req.path}:${clientIp}`;
    const multi = redisClient.multi();
    multi.incr(rateLimiterKey);
    multi.expire(rateLimiterKey, RATE_LIMIT_WINDOW_SECONDS);
    const [requestCount] = (await multi.exec()) as [number, unknown];

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount),
    );

    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
      sendResponse(res, {
        statusCode: 429,
        success: false,
        message: "Too many requests",
      });
      return;
    }
    next();
  } catch (error) {
    next();
  }
}
