import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { connectDB } from "../../../lib/mongodb";
import { createMailer, fromEmail } from "../../../lib/mailer";
import Payment from "../../../models/Payment";
import Subscription from "../../../models/Subscription";

const planLimits: any = {
  Bronze: 3,
  Silver: 5,
  Gold: 999999,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userEmail,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan ||
      !userEmail
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    await Payment.findOneAndUpdate(
      {
        userEmail,
        plan,
        razorpayPaymentId: razorpay_payment_id,
      },
      {
        userEmail,
        plan,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { upsert: true, new: true }
    );

    if (plan !== "Resume") {
      await Subscription.findOneAndUpdate(
        { userEmail },
        {
          userEmail,
          plan,
          applicationLimit: planLimits[plan],
          active: true,
        },
        { upsert: true, returnDocument: "after" }
      );

      const transporter = createMailer();

      await transporter.sendMail({
        from: fromEmail,
        to: userEmail,
        subject: "Subscription Invoice - InternArea",
        text: `Your ${plan} plan payment was successful. Payment ID: ${razorpay_payment_id}`,
      });
    }

    return res.status(200).json({
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
}
