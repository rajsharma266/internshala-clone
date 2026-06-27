import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Resume from "../../../models/Resume";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail } = req.query;

    const resume = await Resume.findOne({ userEmail });

    return res.status(200).json(resume);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
