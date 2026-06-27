import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Post from "../../../models/Post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { postId, userEmail, text } = req.body;

    if (!postId || !userEmail || !text?.trim()) {
      return res.status(400).json({ error: "Post, user and comment are required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      userEmail,
      text,
    });

    await post.save();

    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
}
