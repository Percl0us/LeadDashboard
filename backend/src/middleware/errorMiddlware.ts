import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Error";
  return res.status(statusCode).json({ success: false, message: message });
};
export default errorMiddleware;
