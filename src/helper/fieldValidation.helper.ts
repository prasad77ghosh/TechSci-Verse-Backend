import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ErrorHandler } from "../services";

export const filedValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorHandler(
        errors
          .array()
          .map((errors) => errors.msg)
          .join()
          .replace(/[,]/g, " and "),
        400
      )
    );
  }
};
