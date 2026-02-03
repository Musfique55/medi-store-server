import { RequestHandler } from "express";
import { reviewServices } from "./reviews.services";

const giveReview : RequestHandler = async (req,res) => {
    try {
        const result = await reviewServices.giveReview(req.body as any);
        res.status(201).json({
            message : "Review created successfully",
            success : true,
            data : result
        })
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message || "Server internal error",
            success : false
        })
    }
}
const deleteReview : RequestHandler = async (req,res) => {
    try {
        const {id} = req.params;
        await reviewServices.deleteReview(id as string);
        res.status(200).json({
            message : "Review deleted successfully",
            success : true,
        })
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message || "Server internal error",
            success : false
        })
    }
}

export const reviewsController = {
    giveReview,
    deleteReview
}