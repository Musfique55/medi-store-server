import { NextFunction, Request, Response } from "express";

export const productImageUploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof req.body.data === "string") {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      console.log("Failed to parse req.body.data JSON", error);
    }
  }

  const files = req.files as Express.Multer.File[];

  if (files && files.length > 0) {
    const images = files.map((file) => file.path);
    req.body.image_url = images; // Matches Prisma Medicine schema (image_url String[])
  }

  next();
};
