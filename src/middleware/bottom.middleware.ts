import { Application, Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../services";
import { MongoParseError } from "mongodb";

class BottomMiddleware {
  constructor(app: Application) {
    app.use(this.routeNotFoundErrorHandler);
    app.use(this.errorHandler);
  }

  public routeNotFoundErrorHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    next(new ErrorHandler("No route found, Please check your urls.", 400));
  }
  public errorHandler(
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    if (err.name === "CastError") {
      err.message = `Resource not found`;
      err.statusCode = 400;
    }

    // Mongoose duplicate key error
    if (err.statusCode === 11000) {
      err.message = `Duplicate key Entered`;
      err.statusCode = 400;
    }

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
      err.message = `Json Web Token is invalid, Try again`;
      err.statusCode = 400;
    }

    if (err instanceof MongoParseError) {
      err.message = `Json Web Token is invalid, Try again`;
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
}

export default BottomMiddleware;
