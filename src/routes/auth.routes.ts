import { Router } from "express";
import { AuthController, AuthControllerValidator } from "../controllers";

export default class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  public path = "auth";

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }
  private routes() {
    this.router.post(
      "/signup",
      AuthControllerValidator.register,
      this.authController.register
    );
  }
}