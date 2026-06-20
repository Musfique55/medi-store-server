import { catchAsync } from "../../helper/catchAsync";
import { Request, Response } from "express";
import { analyticsServices } from "./analytics.services";
import { sendResponse } from "../../helper/sendResponse";

const getSellersAnalytics = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await analyticsServices.getSellersAnalytics(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seller analytics fetched successfully",
    data: result,
  });
});

export const analyticsController = {
  getSellersAnalytics,
};
