import { RequestHandler } from "express";
import { categoryServices } from "./categories.services";
import { sendResponse } from "../../helper/sendResponse";
import { AppError } from "../../helper/AppError";

const createCategory: RequestHandler = async (req, res) => {
  try {
    const result = await categoryServices.createCategory(req.body);
    sendResponse(res, {
      message: "Category created successfully",
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

const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.updateCategory(
      id as string,
      req.body,
    );
    sendResponse(res, {
      message: "Category updated successfully",
      success: true,
      statusCode: 201,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
      error,
    );
  }
};

const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryServices.deleteCategory(id as string);
    sendResponse(res, {
      message: "Category deleted successfully",
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
      error,
    );
  }
};

const getCategories: RequestHandler = async (req, res) => {
  try {
    const result = await categoryServices.getCategories(req.query);
    sendResponse(res, {
      message: "Categories fetched successfully",
      success: true,
      statusCode: 200,
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
