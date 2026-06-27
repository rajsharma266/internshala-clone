import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["paid"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
