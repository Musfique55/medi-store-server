import { NextFunction, Request, Response } from "express";
import z from "zod";

export const zodRequestValidator =
  (schema: z.ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          success: false,
          error: result.error,
        });
      }

      req.body = result.data;
      next();
    } catch (error: any) {
      console.log("validation error", error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  };
