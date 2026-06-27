import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Subscription from "../../../models/Subscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail } = req.query;

    const subscription = await Subscription.findOne({ userEmail });

    if (!subscription) {
      return res.status(200).json({
        plan: "Free",
        applicationLimit: 1,
      });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
