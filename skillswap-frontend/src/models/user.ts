

import mongoose, { Schema, Document } from "mongoose";

interface Skill {
  skillName: string;
  category?: string;
  introduction?: string;
  mode?: "free" | "paid";
  qualification?: string;
}

export interface IUser extends Document {
  fullName: string;
  nickname: string;
  gender: string;
  country: string;
  language: string;
  birthday: Date;
  photo?: string;
  skillsToLearn: Skill[];
  skillsToTeach: Skill[];
  bankDetails?: object;
  kycStatus: "pending" | "approved" | "rejected";
}


const SkillSchema = new Schema({
  skillName: { type: String, required: true },
  category: String,
  introduction: String,
  mode: { type: String, enum: ["free", "paid"] },
  qualification: String,
});

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  nickname: { type: String, required: true },
  gender: String,
  country: String,
  language: String,
  birthday: Date,
  photo: String,
  skillsToLearn: [SkillSchema],   
  skillsToTeach: [SkillSchema],   
  bankDetails: Object,
  kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});
