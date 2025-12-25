import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const User = new mongoose.model("User", userSchema);
export default User;
