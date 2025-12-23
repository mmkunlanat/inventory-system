import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    centerName: String,
    itemName: String,
    quantity: Number,
    unit: String,
    status: {
      type: String,
      default: "pending", // pending | approved | rejected
    },
  },
  { timestamps: true }
);

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
