import { RequestHandler } from "express";
import { medicineServices } from "./medicine.services";
import { getMaxPrice } from "../../lib/maxPrice";
import { IQueryParams } from "../../types/queryBuilder";
import { sendResponse } from "../../helper/sendResponse";

const createMedicine: RequestHandler = async (req, res) => {
  try {
    const result = await medicineServices.createMedicine(req.body);
    res.status(201).json({
      message: "medicine created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
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

    const mx = await getMaxPrice();

    sendResponse(res, {
      data: result.data,
      meta: result.meta,
      success: true,
      statusCode: 200,
      message: "medicines fetched successfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateMedicine: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineServices.updateMedicine(
      id as string,
      req.body,
    );
    res.status(201).json({
      message: "medicine info updated successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateStocks: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineServices.updateStocks(id as string, req.body);
    res.status(201).json({
      message: "medicine stock successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
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
    res.status(200).json({
      message: "medicine fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
  }
};
const deleteMedicine: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await medicineServices.deleteMedicine(id as string);
    res.status(201).json({
      message: "medicine deleted successfully",
      success: true,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      success: false,
    });
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
