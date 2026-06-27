import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { UAParser } from "ua-parser-js";
import { connectDB } from "../../../lib/mongodb";
import Otp from "../../../models/Otp";
import LoginHistory from "../../../models/LoginHistory";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email, otp } = req.body;
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const device = result.device.type || "desktop";
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";

    const record = await Otp.findOne({
      email,
      otp,
      purpose: "login",
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ email, purpose: "login" });

    await LoginHistory.create({
      userId: user._id,
      email: user.email,
      browser,
      os,
      device,
      ipAddress,
      status: "success",
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: randomUUID(),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
