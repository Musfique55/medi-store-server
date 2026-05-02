import { Request, Response } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { cartServices } from "./cart.services";
import { sendResponse } from "../../helper/sendResponse";

const createCart = catchAsync(async (req : Request,res : Response) => {
    const cartId = req.cookies['cart_id'];
    const {product,quantity} = req.body;
    const result = await cartServices.createCart(cartId,product,quantity);
    sendResponse(res,{
        message : "item added to the cart",
        statusCode : 200,
        success : true,
        data : result
    })
})


const getCart = catchAsync(async (req : Request,res : Response) => {
    const cartId = req.cookies['cart_id'];
    const result = await cartServices.getCart(cartId);
    sendResponse(res,{
        message : "cart retrieved successfully",
        statusCode : 200,
        success : true,
        data : result
    })
})

export const cartController = {
    createCart,
    getCart
}