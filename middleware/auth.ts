import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// authenticated User
export const isAutheticated = CatchAsyncError(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resources", 400)
      );
    }

    const decodeed = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decodeed) {
      return next(new ErrorHandler("Access token is not valid ", 400));
    }

    const user = await redis.get(decodeed.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);

// validate user role
export const authorizeRoles = (...roles : string[]) => {
  return (req:Request | any , res:Response, next:NextFunction) => {
    console.log(req.user?.role);
    
    if (!roles.includes(req.user?.role || "")) {
      return next(new ErrorHandler(`Role: ${req.user?.role} is not allow to access this resource `,403));
    }
    next();
  };
};
