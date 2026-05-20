import { Request, NextFunction, Response } from "express";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthPayload } from "../types/auth.types";
import { ReqWithUser } from "../types/express/ReqWithUser";

const AuthMiddleware = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) {
    next(new AppError("Invalid Authorization", 401));
    return;
  }
  const head = header.split(" ");
  if (head[0] != "Bearer") {
    next(new AppError("Invalid Authorization", 401));
    return;
  }
  const token = head[1];
  if (!token) {
    next(new AppError("Invalid Authorization", 401));
    return;
  }
  const secretkey = process.env.secretkey;
  if (!secretkey) {
    next(new AppError("Internal Server Error", 500));
    return;
  }
  try {
    const decoded = jwt.verify(token, String(secretkey)) as AuthPayload;
    const isuser = await User.findOne({ _id: decoded.id });
    if (!isuser) {
      next(new AppError("Invalid Authorization", 401));
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid Authorization", 401));
  }
};
const adminMiddleware = (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next();
  }
  if (req.user.role == "Admin") {
    next(new AppError("Invalid Authorization", 401));
    return;
  }
  next(new AppError("Unauthorized access", 403));
};
export { adminMiddleware, AuthMiddleware };
