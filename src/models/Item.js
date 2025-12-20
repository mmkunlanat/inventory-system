import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Item ||
  mongoose.model("Item", ItemSchema);
