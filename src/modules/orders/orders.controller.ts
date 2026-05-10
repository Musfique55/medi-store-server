import { RequestHandler } from "express";
import { orderServices } from "./orders.services";
import { sendResponse } from "../../helper/sendResponse";
import { AppError } from "../../helper/AppError";

const newOrder: RequestHandler = async (req, res) => {
  try {
    const cartId = req.cookies.cart_id;
    const result = await orderServices.newOrder(req.body, cartId);
    sendResponse(res, {
      message: "Order placed Successfully",
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

const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderServices.updateOrderStatus(
      id as string,
      req.body.order_status,
    );
    sendResponse(res, {
      message: "Order status updated Successfully",
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};

const getSellersOrder: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await orderServices.getSellersOrder(
      userId as string,
      req.query,
    );
    sendResponse(res, {
      message: "Orders fetched successfully",
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};
const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await orderServices.getUserOrders(
      userId as string,
      req.query,
    );
    sendResponse(res, {
      message: "Orders fetched successfully",
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

const getOrderDetails: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await orderServices.getOrderDetails(
      id as string,
      userId as string,
    );

    if (!result) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }
    sendResponse(res, {
      message: "Order details fetched successfully",
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};
const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const result = await orderServices.getAllOrders(req.query);
    sendResponse(res, {
      message: "Order fetched successfully",
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

export const orderController = {
  newOrder,
  updateOrderStatus,
  getSellersOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
};
