import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp: string | null;
  otpExpires: Date | null;
  skillsToTeach: mongoose.Types.ObjectId[];
  skillsToLearn: mongoose.Types.ObjectId[];
  role: "learner" | "teacher";
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    skillsToTeach: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    skillsToLearn: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    role: {
      type: String,
      enum: ["learner", "teacher"],
      default: "learner",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

export default UserModel;