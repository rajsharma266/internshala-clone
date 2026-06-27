import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import { createMailer, fromEmail } from "../../../lib/mailer";
import ResumeOtp from "../../../models/ResumeOtp";

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

    await ResumeOtp.deleteMany({ userEmail });

    await ResumeOtp.create({
      userEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = createMailer();

    await transporter.sendMail({
      from: fromEmail,
      to: userEmail,
      subject: "Resume Creation OTP",
      text: `Your OTP for resume creation is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
