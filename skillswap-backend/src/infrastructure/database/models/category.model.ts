import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategoryDoc>({
  name: { type: String, required: true, unique: true },
});

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
