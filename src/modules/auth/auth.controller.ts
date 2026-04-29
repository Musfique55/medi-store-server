import { Request, RequestHandler, Response } from "express";
import { auth } from "../../lib/auth";
import { authServices } from "./auth.services";
import { catchAsync } from "../../helper/catchAsync";
import { sendResponse } from "../../helper/sendResponse";
import { cookieUtils } from "../../utils/cookieUtils";

const getLoggedInUser: RequestHandler = async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    const user = await authServices.getLoggedInUser(session?.user.id!);
    res.status(200).json({
      message: "user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {}
};

const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authServices.register({ name, email, password });

  cookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 60 * 15 * 1000,
  });
  cookieUtils.setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });
  cookieUtils.setCookie(res, "better-auth.session_token", result.token!, {
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });

  sendResponse(res, {
    message: "user registered successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authServices.login(email, password);

  cookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 60 * 15 * 1000,
  });
  cookieUtils.setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });
  cookieUtils.setCookie(res, "better-auth.session_token", result.token, {
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });

  sendResponse(res, {
    message: "user logged in successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const verifyEmailOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authServices.verifyEmailOtp(email, otp);
  sendResponse(res, {
    message: "email verified successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.logout();
  sendResponse(res, {
    message: "user logged out successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const newRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const  refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await authServices.newRefreshToken(refreshToken, sessionToken);
  cookieUtils.setCookie(res, "accessToken", result.accessToken, {
    maxAge: 60 * 15 * 1000,
  });
  sendResponse(res, {
    message: "new refresh token generated successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const authController = {
  getLoggedInUser,
  login,
  register,
  logout,
  verifyEmailOtp,
  newRefreshToken
};
