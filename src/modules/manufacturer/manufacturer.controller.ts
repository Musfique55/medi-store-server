import { RequestHandler } from "express";
import { manufacturerService } from "./manufacturer.services";
import { AppError } from "../../helper/AppError";

const createManufacturer: RequestHandler = async (req, res) => {
  try {
    const result = await manufacturerService.createManufacturer(req.body);
    res.status(201).json({
      message: "Manufacturer created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(error.message, error.statusCode);
  }
};
const getManufacturers: RequestHandler = async (req, res) => {
  try {
    const result = await manufacturerService.getManufacturers();
    res.status(200).json({
      message: "Manufacturer created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(error.message, error.statusCode);
  }
};

export const manufacturerController = {
  createManufacturer,
  getManufacturers,
};
