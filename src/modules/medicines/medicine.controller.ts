import { RequestHandler } from "express";
import { medicineServices } from "./medicine.services";
import { IQueryParams } from "../../types/queryBuilder";
import { sendResponse } from "../../helper/sendResponse";
import { AppError } from "../../helper/AppError";

const createMedicine: RequestHandler = async (req, res) => {
  try {
    const result = await medicineServices.createMedicine(req.body);
    sendResponse(res, {
      message: "medicine created successfully",
      success: true,
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const getMedicines: RequestHandler = async (req, res) => {
  try {
    const isSellerView = req.originalUrl.includes("/seller");
    const queryParams: IQueryParams = req.query;

    const result = await medicineServices.getMedicines(
      isSellerView,
      queryParams,
    );

    sendResponse(res, {
      data: result.data,
      meta: result.meta,
      success: true,
      statusCode: 200,
      message: "medicines fetched successfully",
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const updateMedicine: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineServices.updateMedicine(
      id as string,
      req.body,
    );
    sendResponse(res, {
      message: "medicine info updated successfully",
      success: true,
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const updateStocks: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineServices.updateStocks(id as string, req.body);
    sendResponse(res, {
      message: "medicine stock successfully",
      success: true,
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const getMedicine: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const isSellerView = req.originalUrl.includes("/seller");
    const result = await medicineServices.getMedicine(slug as string);
    if (!isSellerView) {
      const { unit_price, ...publicResult } = result as any;
      return res.status(200).json({
        message: "medicine fetched successfully",
        success: true,
        data: publicResult,
      });
    }
    sendResponse(res, {
      message: "medicine fetched successfully",
      success: true,
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const deleteMedicine: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await medicineServices.deleteMedicine(id as string);
    sendResponse(res, {
      message: "medicine deleted successfully",
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

export const medicineController = {
  createMedicine,
  getMedicines,
  getMedicine,
  updateStocks,
  updateMedicine,
  deleteMedicine,
};
