import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Friend from "../../../models/Friend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail } = req.query;

    if (!userEmail || typeof userEmail !== "string") {
      return res.status(400).json({ error: "userEmail is required" });
    }

    const friends = await Friend.find({
      userEmail,
    });

    return res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
