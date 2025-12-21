import mongoose from "mongoose";

const CenterSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    contact: String,
  },
  { timestamps: true }
);

export default mongoose.models.Center ||
  mongoose.model("Center", CenterSchema);
