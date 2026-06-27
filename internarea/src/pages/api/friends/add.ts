import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Friend from "../../../models/Friend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail, friendEmail } = req.body;

    if (!userEmail || !friendEmail) {
      return res.status(400).json({ message: "Both email fields are required" });
    }

    if (userEmail === friendEmail) {
      return res.status(400).json({
        message: "You cannot add yourself as a friend",
      });
    }

    const exists = await Friend.findOne({
      userEmail,
      friendEmail,
    });

    if (exists) {
      return res.status(400).json({
        message: "Friend already added",
      });
    }

    await Friend.create({
      userEmail,
      friendEmail,
    });

    return res.status(201).json({
      message: "Friend added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
