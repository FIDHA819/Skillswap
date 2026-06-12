import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConnectionDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<IConnectionDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

connectionSchema.index({ studentId: 1, teacherId: 1 }, { unique: true });

export const ConnectionModel: Model<IConnectionDocument> =
  mongoose.models.Connection ||
  mongoose.model<IConnectionDocument>("Connection", connectionSchema);

export default ConnectionModel;