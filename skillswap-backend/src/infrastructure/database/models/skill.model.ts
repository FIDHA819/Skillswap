import mongoose, { Schema, Document } from "mongoose";

export interface ISkillDoc extends Document {
  userId: string;
  name: string;
  level: "beginner" | "intermediate" | "expert";
  category: string;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkillDoc>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, enum: ["beginner", "intermediate", "expert"], default: "beginner" },
  category: String,
}, { timestamps: true });

export const SkillModel = mongoose.model<ISkillDoc>("Skill", SkillSchema);
