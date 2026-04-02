import mongoose, { Schema, Document } from "mongoose";

export interface IBankDoc extends Document {
  userId: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  accountHolderName: string;
  proofUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankSchema = new Schema<IBankDoc>({
  userId: { type: String, required: true, unique: true },
  accountNumber: String,
  ifsc: String,
  accountType: String,
  accountHolderName: String,
  proofUrl: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export const BankModel = mongoose.model<IBankDoc>("Bank", BankSchema);
