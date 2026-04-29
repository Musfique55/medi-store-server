import { Response } from "express";

interface JsonBody {
  message: string;
  success: boolean;
  data?: any;
  statusCode: number;
}

export const sendResponse = (res: Response, result: JsonBody) => {
  return res.status(result.statusCode).json({
    message: result.message,
    success: result.success,
    data: result.data,
  });
};
