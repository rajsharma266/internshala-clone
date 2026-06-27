import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userEmail: String,
    text: String,
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    caption: String,
    mediaUrl: String,
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      default: "none",
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);