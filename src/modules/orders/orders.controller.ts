import { RequestHandler } from "express";
import { orderServices } from "./orders.services";
import { auth } from "../../lib/auth";
import { OrderStatus } from "../../generated/prisma/enums";

const newOrder: RequestHandler = async (req, res) => {
  try {
    const cartId = req.cookies.cart_id;
    const result = await orderServices.newOrder(req.body, cartId);
    res.status(201).json({
      message: "Order placed Successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(400).json({
        message:
          "One or more items are out of stock or have insufficient quantity.",
        success: false,
      });
    }
    res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderServices.updateOrderStatus(
      id as string,
      req.body,
    );
    res.status(201).json({
      message: "Order status updated Successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const getSellersOrder: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getSellersOrder(
      session?.user.id as string,
    );
    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
  }
};
const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getUserOrders(
      session?.user.id as string,
    );
    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
  }
};
const getDeliveredOrders: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const result = await orderServices.getDeliveredOrders(
      session?.user.id as string,
    );
    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
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

    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
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
    res.status(200).json({
      message: "Order details fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
  }
};
const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const result = await orderServices.getAllOrders();
    res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Server internal error",
      success: false,
    });
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
