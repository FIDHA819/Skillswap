import mongoose, { Schema, Document } from "mongoose";

interface IKYCDoc {
  idType: string;
  idName: string;
  photoUrl: string;
  status: "pending" | "approved" | "rejected";
}

const KYCDocSchema = new Schema<IKYCDoc>({
  idType: { type: String, required: true },
  idName: { type: String, required: true },
  photoUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  kyc: { type: [KYCDocSchema], default: [] }, 
});
export const KYCModel = mongoose.model("User", UserSchema);