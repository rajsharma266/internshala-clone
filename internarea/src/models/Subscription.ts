import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      default: "Free",
    },
    applicationLimit: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);