import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import LoginHistory from "../../../models/LoginHistory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email } = req.query;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const history = await LoginHistory.find({ email: email.trim() }).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}
