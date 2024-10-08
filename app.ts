require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors (cross origin resource sharing)
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Routers
app.use("/api/v1", userRouter);

// test api
app.use("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is Working",
  });
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
