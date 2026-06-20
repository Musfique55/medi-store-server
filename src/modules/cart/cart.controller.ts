import { Request, Response } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { cartServices } from "./cart.services";
import { sendResponse } from "../../helper/sendResponse";
import { cookieUtils } from "../../utils/cookieUtils";

const createCart = catchAsync(async (req: Request, res: Response) => {
  const cartId = req.cookies["cart_id"];

  const { product, quantity } = req.body;
  const result = await cartServices.createCart(cartId, product, quantity);
  sendResponse(res, {
    message: "item added to the cart",
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const cartId = req.cookies["cart_id"];
  const result = await cartServices.getCart(cartId);
  sendResponse(res, {
    message: "cart retrieved successfully",
    statusCode: 200,
    success: true,
    data: result,
  });
});

const removeProductFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const cartId = req.cookies["cart_id"];
    const result = await cartServices.removeProductFromCart(
      productId as string,
      cartId as string,
    );
    sendResponse(res, {
      message: "item removed from the cart",
      statusCode: 200,
      success: true,
      data: result,
    });
  },
);

const updateQuantityFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity, operation } = req.body;
    const cartId = req.cookies["cart_id"];
    const result = await cartServices.updateQuantityFromCart(
      operation,
      productId as string,
      cartId as string,
      quantity as number,
    );
    sendResponse(res, {
      message: "item quantity updated successfully",
      statusCode: 200,
      success: true,
      data: result,
    });
  },
);

const mergeCart = catchAsync(async (req: Request, res: Response) => {
  const cartId = req.cookies["cart_id"];
  const userId = req.user?.id;
  const result = await cartServices.mergeCart(cartId, userId!);
  cookieUtils.setCookie(res, "cart_id", userId!, {
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
  sendResponse(res, {
    message: "cart merged successfully",
    statusCode: 200,
    success: true,
    data: result,
  });
});

export const cartController = {
  createCart,
  getCart,
  removeProductFromCart,
  updateQuantityFromCart,
  mergeCart,
};
