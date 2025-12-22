import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    quantity: Number,
    unit: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item ||
  mongoose.model("Item", ItemSchema);
