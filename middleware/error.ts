import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // worng mongoDb id
  if (err.name === "CastError") {
    const message = `Resource Not Found :${err.path} `;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered `;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error
  if (err.code === "JsonWebTokenError") {
    const message = `Josn web token is expried, try again`;
    err = new ErrorHandler(message, 400);
  }

  //Jwt expired error
  if (err.code === "TokenExpiredError") {
    const message = `Json web token is expried, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
