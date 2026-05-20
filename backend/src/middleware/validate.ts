import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import AppError from "../utils/AppError";

const validate = (schema: ZodType) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const output = schema.safeParse(data);
    if (!output.success) {
      const e = new AppError(
        output.error.issues[0]?.message || "Invalid inputs",
        400,
      );
      next(e);
      return;
    }
    req.body = output.data;
    next();
  };
};
export default validate;
