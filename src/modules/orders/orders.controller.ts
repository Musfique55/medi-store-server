import { RequestHandler } from "express";
import { orderServices } from "./orders.services";
import { auth } from "../../lib/auth";
import { OrderStatus } from "../../generated/prisma/enums";
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
      req.body,
    );
    sendResponse(res, {
      message: "Order status updated Successfully",
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

const getSellersOrder: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getSellersOrder(
      session?.user.id as string,
    );
    sendResponse(res, {
      message: "Orders fetched successfully",
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
const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getUserOrders(
      session?.user.id as string,
    );
    sendResponse(res, {
      message: "Orders fetched successfully",
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
const getDeliveredOrders: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getDeliveredOrders(
      session?.user.id as string,
    );
    sendResponse(res, {
      message: "Orders fetched successfully",
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
const getOrdersByStatus: RequestHandler = async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.user?.id;
    const result = await orderServices.getOrdersByStatus(
      userId as string,
      status as OrderStatus,
    );

    sendResponse(res, {
      message: "Orders fetched successfully",
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
const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const result = await orderServices.getAllOrders();
    sendResponse(res, {
      message: "Order fetched successfully",
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

export const orderController = {
  newOrder,
  updateOrderStatus,
  getSellersOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  getOrdersByStatus,
  getDeliveredOrders,
};
