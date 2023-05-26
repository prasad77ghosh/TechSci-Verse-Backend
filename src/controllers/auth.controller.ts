import { NextFunction, Request, Response } from "express";
import { EmailService, ErrorHandler, MediaStoreService } from "../services";
import { UserSchema } from "../models";
import { generateSlugName, generateVerificationToken } from "../utils";
import { filedValidationError } from "../helper";
import { body, query } from "express-validator";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const profile = req?.files?.profile;

      // validation error checking
      filedValidationError(req, next);

      // if password mismatch
      if (password !== confirmPassword)
        return next(
          new ErrorHandler(
            "Your password and confirmPassword does not match",
            422
          )
        );

      //profile picture upload
      const profileInfo = profile
        ? await new MediaStoreService().upload(profile, "User")
        : undefined;
      console.log(profileInfo);

      //check duplicate user
      const checkDuplicate = await UserSchema.findOne({ email });
      if (checkDuplicate)
        return next(new ErrorHandler("This user already exists", 409));

      //generate slugName
      const slugName = generateSlugName(name);
      const token = generateVerificationToken();

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
        return next(
          new ErrorHandler("Something went wrong. User is not registered", 500)
        );

      // Verification email sending
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/verify-email?token=${token}`;

      await new EmailService().mailSend({
        email,
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
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("provide email is not a valid email address")
      .normalizeEmail()
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/\d/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-zA-Z]/)
      .withMessage("Password must contain at least one letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
    body("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Confirm Password is required"),
  ],
};

export default AuthController;
