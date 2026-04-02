import mongoose from "mongoose";
import { config } from "../../config/app.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {} as mongoose.ConnectOptions);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};
