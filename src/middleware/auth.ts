import { NextFunction, Request, Response } from "express";
import { roles } from "../generated/prisma/enums";
import { AppError } from "../helper/AppError";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utils/cookieUtils";
import { jwtUtils } from "../utils/jwtUtils";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        role: string;
        id: string;
      };
    }
  }
}

export const auth = (...roles: roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentSessionToken =
        req.cookies["better-auth.session_token"] ||
        req.cookies["_Secure-better-auth.session_token"];

      if (!currentSessionToken) {
        throw new AppError("Unauthorized", 401);
      }

      const session = await prisma.session.findUnique({
        where: {
          token: currentSessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!session || !session.user) {
        throw new AppError("invalid session token", 401);
      }

      if (session && session?.user) {
        if (roles.length > 0 && !roles.includes(session.user.role as roles)) {
          throw new AppError("Forbidden : Insufficient permissions", 403);
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError("unauthorized", 401);
      }

      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(accessToken);

        if (!verifiedToken.success) {
          throw new AppError("unauthorized", 401);
        }
      }

      req.user = {
        name: session.user.name,
        email: session.user.email,
        id: session.user.id,
        role: session.user.role as string,
      };

      next();
    } catch (error: any) {
      throw new AppError(error.message, error.statusCode);
    }
  };
};
