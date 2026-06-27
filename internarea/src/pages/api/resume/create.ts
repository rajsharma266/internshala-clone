import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Resume from "../../../models/Resume";
import ResumeOtp from "../../../models/ResumeOtp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      userEmail,
      name,
      qualification,
      experience,
      personalInfo,
      photo,
    } = req.body;

    if (!userEmail || !name || !qualification || !experience || !personalInfo) {
      return res.status(400).json({ message: "All resume fields are required" });
    }

    const otpRecord = await ResumeOtp.findOne({
      userEmail,
      verified: true,
    });

    if (!otpRecord) {
      return res.status(403).json({
        message: "Please verify OTP before creating resume.",
      });
    }

    const resumePayment = await Payment.findOne({
      userEmail,
      plan: "Resume",
      status: "paid",
    }).sort({ createdAt: -1 });

    if (!resumePayment) {
      return res.status(403).json({
        message: "Please complete the resume payment before creating resume.",
      });
    }

    const resume = await Resume.findOneAndUpdate(
      { userEmail },
      {
        userEmail,
        name,
        qualification,
        experience,
        personalInfo,
        photo,
        resumeUrl: `/resume-preview/${userEmail}`,
      },
      { upsert: true, new: true }
    );

    await ResumeOtp.deleteMany({ userEmail });
    await Payment.deleteMany({
      userEmail,
      plan: "Resume",
      status: "paid",
    });

    return res.status(201).json({
      message: "Resume created and attached to profile successfully.",
      resume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
