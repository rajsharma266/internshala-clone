import mongoose from "mongoose";

const ResumeOtpSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeOtp ||
  mongoose.model("ResumeOtp", ResumeOtpSchema);