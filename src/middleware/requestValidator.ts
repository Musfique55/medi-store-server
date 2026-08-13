import { ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helper/AppError";

export const requestValidator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let parsed;

      if (req.body.data && typeof req.body.data === "string") {
        parsed = schema.safeParse(JSON.parse(req.body.data));
      } else {
        parsed = schema.safeParse(req.body);
      }

      if (!parsed.success) {
        throw new AppError(parsed.error.message, 400);
      }

      req.body = parsed.data;
      next();
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  };
};
