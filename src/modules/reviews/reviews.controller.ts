import { RequestHandler } from "express";
import { reviewServices } from "./reviews.services";
import { AppError } from "../../helper/AppError";

const giveReview: RequestHandler = async (req, res) => {
  try {
    const result = await reviewServices.giveReview(req.body as any);
    res.status(201).json({
      message: "Review created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    throw new AppError(error.message, error.statusCode);
  }
};
const deleteReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewServices.deleteReview(id as string);
    res.status(200).json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (error: any) {
    throw new AppError(error.message, error.statusCode);
  }
};

export const reviewsController = {
  giveReview,
  deleteReview,
};
