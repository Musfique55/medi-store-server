import { RequestHandler } from "express";
import { medicineServices } from "./medicine.services";
import { getMaxPrice } from "../../lib/maxPrice";

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

    const category =
      req.query.category !== "undefined"
        ? req.query.category?.toString()
        : undefined;
    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;
    const manufacturer =
      req.query.manufacturer !== "undefined"
        ? req.query.manufacturer?.toString().split("-").join(" ")
        : undefined;

    const result = await medicineServices.getMedicines(
      isSellerView,
      category,
      minPrice,
      maxPrice,
      manufacturer,
    );

    const mx = await getMaxPrice();

    res.status(200).json({
      message: "medicines fetched successfully",
      success: true,
      data: result,
      max_price: mx,
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
