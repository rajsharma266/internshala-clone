import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    browser: String,
    os: String,
    device: String,
    ipAddress: String,
    status: {
      type: String,
      enum: ["success", "blocked", "otp_required"],
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.models.LoginHistory ||
  mongoose.model("LoginHistory", LoginHistorySchema);