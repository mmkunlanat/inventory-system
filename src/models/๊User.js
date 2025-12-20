import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // (เพื่อการเรียน เก็บ plain text ได้)
  role: String      // admin | center
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
