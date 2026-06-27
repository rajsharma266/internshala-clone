import mongoose from "mongoose";

const LanguageOtpSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "French",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.LanguageOtp ||
  mongoose.model("LanguageOtp", LanguageOtpSchema);