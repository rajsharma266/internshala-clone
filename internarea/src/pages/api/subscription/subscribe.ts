import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Subscription from "../../../models/Subscription";

const plans: any = {
  Free: { price: 0, limit: 1 },
  Bronze: { price: 100, limit: 3 },
  Silver: { price: 300, limit: 5 },
  Gold: { price: 1000, limit: 999999 },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail, plan } = req.body;

    if (!userEmail || !plan) {
      return res.status(400).json({ message: "User email and plan are required" });
    }

    const selectedPlan = plans[plan];

    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const hour = Number(
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        hour12: false,
      })
    );

    if (plan !== "Free" && (hour < 10 || hour >= 11)) {
      return res.status(403).json({
        message: "Payments are allowed only between 10:00 AM and 11:00 AM IST",
      });
    }

    await Subscription.findOneAndUpdate(
      { userEmail },
      {
        userEmail,
        plan,
        applicationLimit: selectedPlan.limit,
        active: true,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: `${plan} plan activated successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
