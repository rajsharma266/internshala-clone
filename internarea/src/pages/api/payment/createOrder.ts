import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const amounts: any = {
  Bronze: 100,
  Silver: 300,
  Gold: 1000,
  Resume: 50,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { plan } = req.body;
    const amount = amounts[plan];

    if (!amount) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay is not configured" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to create payment order" });
  }
}
