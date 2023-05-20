import { model, Model, Schema } from "mongoose";
import { USER_TYPE } from "../types";
import { PasswordHashServices } from "../services";

const userSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    role: {
      type: String,
      enum: {
        values: ["SUPER-ADMIN", "ADMIN"],
        message: "Role must be SUPER-ADMIN or ADMIN",
      },
    },

    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    email: {
      unique: true,
      type: String,
      index: true,
      required: [true, "Email is required"],
    },

    country: {
      type: String,
    },

    profession: {
      type: String,
    },

    expertiseInSubjects: {
      type: [String],
    },
    yearOfExperience: {
      type: String,
    },

    portfolioLink: {
      type: String,
    },
    about: {
      type: String,
    },

    designation: {
      type: String,
    },

    password: {
      type: String,
    },

    profilePath: {
      type: String,
    },

    profileUrl: {
      type: String,
    },

    slug: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
    },

    isBlocked: {
      type: Boolean,
    },

    isVerified: {
      type: Boolean,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    socialLinks: {
      facebook: String,
      youtube: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      github: String,
    },
  },
  {
    timestamps: true,
  }
).pre<USER_TYPE>("save", async function (next) {
  this.password = this.password
    ? await new PasswordHashServices().hash(this.password)
    : undefined;
  next();
});

const UserSchema = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);
export default UserSchema;
