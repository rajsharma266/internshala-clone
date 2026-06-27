import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import { createMailer, fromEmail } from "../../../lib/mailer";
import User from "../../../models/User";
import { generatePassword } from "../../../utils/generatePassword";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toDateString();
    const lastResetDate = user.resetPasswordDate
      ? new Date(user.resetPasswordDate).toDateString()
      : null;

    if (lastResetDate === today && user.resetPasswordCount >= 1) {
      return res.status(400).json({
        message: "You can use this option only once per day.",
      });
    }

    const newPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordDate = new Date();
    user.resetPasswordCount = lastResetDate === today ? user.resetPasswordCount + 1 : 1;

    await user.save();

    const transporter = createMailer();

    await transporter.sendMail({
      from: fromEmail,
      to: user.email,
      subject: "Your New Password",
      text: `Your new password is: ${newPassword}`,
    });

    return res.status(200).json({
      success: true,
      message: "New password sent to your registered email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
