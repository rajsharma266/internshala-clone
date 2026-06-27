import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Post from "../../../models/Post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { postId, userEmail } = req.body;

    if (!postId || !userEmail) {
      return res.status(400).json({ error: "Post and user are required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userEmail)) {
      post.likes = post.likes.filter((email: string) => email !== userEmail);
    } else {
      post.likes.push(userEmail);
    }

    await post.save();

    return res.status(200).json({ message: "Like updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
}
