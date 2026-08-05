import { Request, RequestHandler, Response } from "express";
import { medicineServices } from "./medicine.services";
import { IQueryParams } from "../../types/queryBuilder";
import { sendResponse } from "../../helper/sendResponse";
import { AppError } from "../../helper/AppError";
import { catchAsync } from "../../helper/catchAsync";
import {
  buildQueryParamsCacheKey,
  getOrSetCache,
  invalidateCache,
} from "../../utils/redisUtils";
import { Medicine } from "../../generated/prisma/client";

const createMedicine: RequestHandler = async (req, res) => {
  try {
    const result = await medicineServices.createMedicine(req.body);
    invalidateCache("medicine:*");
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
    const queryParams: IQueryParams = req.query;

    const key = buildQueryParamsCacheKey("medicine", queryParams);
    const result = await getOrSetCache(key, () =>
      medicineServices.getMedicines(queryParams),
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
    const key = "medicine:*";

    const result = await medicineServices.updateMedicine(
      id as string,
      req.body,
    );

    invalidateCache(key);
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

const getSellersMedicine = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const queryParams: IQueryParams = req.query;
  const key = buildQueryParamsCacheKey("medicine", queryParams, true);
  const result = await getOrSetCache(key, () =>
    medicineServices.getSellersMedicine(queryParams, userId),
  );
  sendResponse(res, {
    message: "seller's medicines fetched successfully",
    success: true,
    statusCode: 200,
    data: result.data,
    meta: result.meta,
  });
});

const updateStocks: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineServices.updateStocks(id as string, req.body);
    invalidateCache("medicine:*");
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
    const key = buildQueryParamsCacheKey(
      `medicine:slug:${slug}`,
      {},
      isSellerView,
    );

    const result = await getOrSetCache(key, () =>
      medicineServices.getMedicine(slug as string),
    );

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
    invalidateCache("medicine:*");
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

const topMedicines: RequestHandler = async (req, res) => {
  try {
    const key = "medicine:top";
    const result = await getOrSetCache(key, () =>
      medicineServices.topMedicines(),
    );
    sendResponse(res, {
      message: "top medicines fetched successfully",
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

export const medicineController = {
  createMedicine,
  getMedicines,
  getMedicine,
  updateStocks,
  updateMedicine,
  deleteMedicine,
  topMedicines,
  getSellersMedicine,
};
