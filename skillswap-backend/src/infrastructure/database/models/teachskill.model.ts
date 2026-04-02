import mongoose, { Schema, Document } from "mongoose";

export interface ITeachSkillDoc extends Document {
  userId: string;
  name: string;
  category: string;
  introduction: string;
  highestQuality: string;
  mode: "free" | "paid";
  createdAt: Date;
}

const TeachSkillSchema = new Schema<ITeachSkillDoc>({
  userId: { type: String, required: true },
  name: String,
  category: String,
  introduction: String,
  highestQuality: String,
  mode: { type: String, enum: ["free", "paid"], default: "free" },
}, { timestamps: true });

export const TeachSkillModel = mongoose.model<ITeachSkillDoc>("TeachSkill", TeachSkillSchema);
