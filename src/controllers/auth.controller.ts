import { NextFunction, Request, Response } from "express";
import { EmailService, MediaStoreService } from "../services";
import { UserSchema } from "../models";
import { generateSlugName, generateVerificationToken } from "../utils";
import { body, query } from "express-validator";
import { Conflict, InternalServerError, NotFound } from "http-errors";
import { fieldValidateError } from "../helper";
class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // validation error checking
      fieldValidateError(req);

      // if password mismatch
      if (password !== confirmPassword)
        throw new NotFound("Password and confirmPassword does not match");

      const profile = req?.files;
      //profile picture upload
      const profileInfo = await new MediaStoreService().upload({
        file: profile,
        folder: "User",
      });

      console.log(profileInfo);

      //check duplicate user
      const checkDuplicate = await UserSchema.findOne({ email });
      if (checkDuplicate)
        throw new Conflict("user already exists with the same email");

      //generate slugName
      const slugName = generateSlugName(name);
      const token = generateVerificationToken();
      console.log(slugName, token);
      const registerUser = await UserSchema.create({
        name,
        email,
        password,
        profilePath: profileInfo?.public_id,
        profileUrl: profileInfo?.url,
        slug: slugName,
        verificationToken: token,
      });

      if (!registerUser)
        throw new InternalServerError(
          "Something went wrong, user not registered"
        );

      // Verification email sending
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/verify-email?token=${token}`;

      await new EmailService().emailSend({
        emails: email,
        subject: "Email Verification Link",
        message: `Hi ${name} you register successfully.. \n Click on this link ${verificationLink} to verify your email`,
      });

      res.status(200).json({
        success: true,
        message:
          "You  Register successfully check your email to verify your email",
        data: registerUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

// --------------------------------------- VALIDATION SECTION ------------------------------------------------- //

export const AuthControllerValidator = {
  register: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("provide email is not a valid email address")
      .normalizeEmail()
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long.")
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters long."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one Capital letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one digit")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],
};

export default AuthController;
