import { RequestHandler } from "express";
import { orderServices } from "./orders.services";


const newOrder : RequestHandler = async(req,res) => {
    try {
        const result = await orderServices.newOrder(req.body);
        res.status(201).json({
            message : "Order placed Successfully",
            success : true,
            data : result
        });
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message || "Internal Server Error",
            success : false,
        });
    }
}

export const orderController = {
    newOrder
}