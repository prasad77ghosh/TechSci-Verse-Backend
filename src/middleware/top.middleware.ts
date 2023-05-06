import express, { Application, Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";

class TopMiddleware {
  constructor(app: Application) {
    app.use(express.json());
    app.use(fileUpload());
    app.use(express.urlencoded({ extended: true }));
    app.use(this.allowCrossDomain);
    app.use(this.cacheClear);
  }

  private allowCrossDomain(req: Request, res: Response, next: NextFunction) {
    // all domain request allowed
    res.header("Access-Control-Allow-Origin", "*");

    // all headers allowed
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
    );

    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      return res.status(200).json({});
    }
    next();
  }

  private cacheClear(req: Request, res: Response, next: NextFunction) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
  }
}

export default TopMiddleware;
