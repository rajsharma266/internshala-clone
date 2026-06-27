import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { UAParser } from "ua-parser-js";
import { connectDB } from "../../../lib/mongodb";
import { createMailer, fromEmail } from "../../../lib/mailer";
import Otp from "../../../models/Otp";
import User from "../../../models/User";
import LoginHistory from "../../../models/LoginHistory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const device = result.device.type || "desktop";
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";
    const currentHour = Number(
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        hour12: false,
      })
    );

    if (device === "mobile" && (currentHour < 10 || currentHour >= 13)) {
      await LoginHistory.create({
        userId: user._id,
        email: user.email,
        browser,
        os,
        device,
        ipAddress,
        status: "blocked",
      });

      return res.status(403).json({
        message: "Mobile login is allowed only between 10 AM and 1 PM",
      });
    }

    const isChromeBrowser = browser.toLowerCase().includes("chrome");

    if (isChromeBrowser) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.deleteMany({ email: user.email, purpose: "login" });

      await Otp.create({
        email: user.email,
        otp,
        purpose: "login",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      const transporter = createMailer();

      await transporter.sendMail({
        from: fromEmail,
        to: user.email,
        subject: "Login OTP Verification",
        text: `Your login OTP is ${otp}. It is valid for 5 minutes.`,
      });

      await LoginHistory.create({
        userId: user._id,
        email: user.email,
        browser,
        os,
        device,
        ipAddress,
        status: "otp_required",
      });

      return res.status(200).json({
        otpRequired: true,
        message: "Chrome detected. OTP verification required.",
        email: user.email,
      });
    }

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
      otpRequired: false,
      message: "Login successful",
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
