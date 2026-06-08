import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkillDocument extends Document {
  name: string;
  categoryId?: mongoose.Types.ObjectId;
  description?: string;
  teachers: mongoose.Types.ObjectId[];
  learners: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    learners: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const SkillModel: Model<ISkillDocument> =
  mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", skillSchema);

export default SkillModel;