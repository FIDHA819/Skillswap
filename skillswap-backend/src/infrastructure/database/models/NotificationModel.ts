import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationDocument extends Document {
  recipientId: mongoose.Types.ObjectId;
  senderId:    mongoose.Types.ObjectId;
  type: "connect_request" | "connect_accepted" | "connect_declined" | "session_booked" | "general";
  title:   string;
  message: string;
  read:    boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    senderId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["connect_request","connect_accepted","connect_declined","session_booked","general"],
      default: "general",
    },
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    read:     { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDocument>("Notification", notificationSchema);

export default NotificationModel;