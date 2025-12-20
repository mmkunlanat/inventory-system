import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  centerName: String,
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },
  quantity: Number,
  status: {
    type: String,
    default: "pending" // pending | approved | rejected
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
