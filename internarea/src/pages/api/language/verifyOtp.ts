import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import LanguageOtp from "../../../models/LanguageOtp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail, otp } = req.body;

    const record = await LanguageOtp.findOne({ userEmail, otp, language: "French" });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await LanguageOtp.deleteMany({ userEmail });

    return res.status(200).json({
      message: "French language verified successfully",
      language: "fr",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
