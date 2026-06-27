import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import { createMailer, fromEmail } from "../../../lib/mailer";
import LanguageOtp from "../../../models/LanguageOtp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await LanguageOtp.deleteMany({ userEmail });

    await LanguageOtp.create({
      userEmail,
      otp,
      language: "French",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = createMailer();

    await transporter.sendMail({
      from: fromEmail,
      to: userEmail,
      subject: "French Language OTP Verification",
      text: `Your OTP for switching to French is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent for French verification" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
