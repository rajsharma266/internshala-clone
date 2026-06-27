import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Post from "../../../models/Post";
import Friend from "../../../models/Friend";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail, caption, mediaUrl, mediaType } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "Please login to create a post." });
    }

    if (!caption?.trim() && !mediaUrl) {
      return res.status(400).json({ error: "Add a caption or upload media." });
    }

    const friendCount = await Friend.countDocuments({ userEmail });

    if (friendCount === 0) {
      return res.status(403).json({ error: "You need at least 1 friend to post." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPosts = await Post.countDocuments({
      userEmail,
      createdAt: { $gte: today },
    });

    let limit = 0;

    if (friendCount === 1) limit = 1;
    else if (friendCount === 2) limit = 2;
    else if (friendCount > 10) limit = Infinity;
    else limit = 2;

    if (todayPosts >= limit) {
      return res.status(403).json({ error: "Daily post limit reached." });
    }

    await Post.create({
      userEmail,
      caption,
      mediaUrl,
      mediaType,
    });

    return res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
}
