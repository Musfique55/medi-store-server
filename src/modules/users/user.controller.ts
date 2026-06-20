import { RequestHandler } from "express";
import { userServices } from "./user.services";
import { sendResponse } from "../../helper/sendResponse";
import { AppError } from "../../helper/AppError";

const getUsers: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.getUsers();
    sendResponse(res, {
      data: result,
      message: "users fetched successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "internal error",
      error.statusCode || 500,
    );
  }
};

const updateUsersStatus: RequestHandler = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await userServices.updateUserStatus(id, status);
    sendResponse(res, {
      data: result,
      message: "user status updated successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error: any) {
    throw new AppError(
      error.message || "internal error",
      error.statusCode || 500,
    );
  }
};

export const userController = {
  getUsers,
  updateUsersStatus,
};
