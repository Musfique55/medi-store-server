import { NextFunction, Request, Response } from "express";
import { roles } from "../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";


declare global{
    namespace Express{
        interface Request{
            user?: {
                name : string,
                email : string,
                role : string,
                id : string,
            }
        }
    }
}

export const auth = (...roles: roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        res.status(401).json({
          message: "unauthorized",
          success: false,
          status: 401,
        });
        return;
      }

      req.user = {
        name : session.user.name,
        email : session.user.email,
        id: session.user.id,
        role : session.user.role as string
      }

      if (!session.user.role || !roles.includes(session.user.role as roles)) {
        res.status(403).json({
          message: "forbidden",
          success: false,
          status: 403,
        });
        return;
      }

      next();
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
  };
};
