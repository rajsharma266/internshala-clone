import { useState } from "react";
import { getStoredUser } from "@/lib/userSession";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  { name: "Free", price: "Rs 0", limit: "1 internship / month" },
  { name: "Bronze", price: "Rs 100", limit: "3 internships / month" },
  { name: "Silver", price: "Rs 300", limit: "5 internships / month" },
  { name: "Gold", price: "Rs 1000", limit: "Unlimited internships" },
];

export default function Subscription() {
  const [message, setMessage] = useState("");

  const userEmail = getStoredUser()?.email || "";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const activateFreePlan = async () => {
    const res = await fetch("/api/subscription/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, plan: "Free" }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const payForPlan = async (plan: string) => {
    if (!userEmail) {
      setMessage("Please login first.");
      return;
    }

    if (plan === "Free") {
      activateFreePlan();
      return;
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setMessage("Razorpay SDK failed to load.");
      return;
    }

    const orderRes = await fetch("/api/payment/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const order = await orderRes.json();

    if (!orderRes.ok) {
      setMessage(order.message);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "InternArea",
      description: `${plan} Subscription Plan`,
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/payment/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            plan,
            userEmail,
          }),
        });

        const data = await verifyRes.json();
        setMessage(data.message);
      },
      prefill: {
        email: userEmail,
      },
      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Subscription Plans
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose the existing plan that matches your application needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.name} className="section-card flex h-full flex-col p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-4 text-3xl font-bold text-blue-700">
                {plan.price}
              </p>
              <p className="mt-2 text-sm text-slate-500">{plan.limit}</p>

              <button
                onClick={() => payForPlan(plan.name)}
                className="primary-button mt-8 w-full"
              >
                {plan.name === "Free" ? "Activate Free" : "Pay Now"}
              </button>
            </div>
          ))}
        </div>

        {message && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-blue-50 px-5 py-4 text-center text-sm text-blue-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
