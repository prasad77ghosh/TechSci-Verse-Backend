import { NextFunction, Request, Response } from "express";
import { ErrorHandler, MediaStoreService } from "../services";
import { UserSchema } from "../models";
import { generateSlugName } from "../utils";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const profile = req?.files?.profile;

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

      const registerUser = await UserSchema.create({
        name,
        email,
        password,
        profilePath: profileInfo?.public_id,
        profileUrl: profileInfo?.url,
        slug: slugName,
      });
    } catch (error) {
      next(error);
    }
  }
}
