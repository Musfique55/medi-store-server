import { catchAsync } from "@/helper/catchAsync";
import { inventoryServices } from "./inventories.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await inventoryServices.updateInventory(
    id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Inventory updated successfully",
    data: result,
  });
});

const getInventoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await inventoryServices.getInventoryById(id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Inventory fetched successfully",
    data: result,
  });
});

const getInventoryDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await inventoryServices.getInventoryDetails(id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Inventory details fetched successfully",
    data: result,
  });
});

export const inventoryController = {
  updateInventory,
  getInventoryById,
  getInventoryDetails,
};
