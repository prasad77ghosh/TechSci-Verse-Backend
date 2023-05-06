import { Application, Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../services";
import { MongoParseError } from "mongodb";

class BottomMiddleware {
  constructor(app: Application) {
    app.use(this.errorHandler);
    app.use(this.routeNotFoundErrorHandler);
  }

  public routeNotFoundErrorHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    next(new ErrorHandler("No route found, Please check your urls.", 400));
  }
  public errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
      const message = `Resource not found: invalid ${err.path}`;
      err = new ErrorHandler(err, 400);
    }

    // Mongoose duplicate key error
    if (err.statusCode === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again `;
      err = new ErrorHandler(message, 400);
    }

    if (err instanceof MongoParseError) {
      const message = "Your Database not connected properly";
      err = new ErrorHandler(message, 500);
    }

    if (err.name === "TokenExpiredError") {
      // JWT EXPIRE error
      const message = `Json Web Token is Expired, Try again `;
      err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
}

export default BottomMiddleware;
