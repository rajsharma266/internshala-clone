import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    friendEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Friend ||
  mongoose.model("Friend", FriendSchema);