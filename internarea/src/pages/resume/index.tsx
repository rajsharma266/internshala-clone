import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/userSession";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    experience: "",
    personalInfo: "",
    photo: "",
  });
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<any>(null);

  const userEmail = getStoredUser()?.email || "";

  useEffect(() => {
    const fetchResume = async () => {
      if (!userEmail) {
        return;
      }

      const res = await fetch(`/api/resume/getResume?userEmail=${userEmail}`);
      const data = await res.json();

      if (res.ok && data) {
        setResume(data);
      }
    };

    fetchResume();
  }, [userEmail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const res = await fetch("/api/resume/sendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/resume/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, otp }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setOtpVerified(true);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payResumeFee = async () => {
    if (!otpVerified) {
      setMessage("Please verify OTP first.");
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
      body: JSON.stringify({ plan: "Resume" }),
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
      description: "Resume Creation Fee",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/payment/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            plan: "Resume",
            userEmail,
          }),
        });

        const data = await verifyRes.json();
        setMessage(data.message);

        if (verifyRes.ok) {
          setPaymentDone(true);
          setMessage("Rs 50 payment successful. You can now create resume.");
        }
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

  const createResume = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      setMessage("Please verify OTP first.");
      return;
    }

    if (!paymentDone) {
      setMessage("Please complete Rs 50 payment first.");
      return;
    }

    const res = await fetch("/api/resume/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, ...form }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setResume(data.resume);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="section-card p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Resume Builder
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              OTP verification and Rs 50 payment are required before resume
              creation.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="form-input bg-slate-100"
                />
              </div>

              <button type="button" onClick={sendOtp} className="secondary-button w-full">
                Send OTP
              </button>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
              />

              <button type="button" onClick={verifyOtp} className="secondary-button w-full">
                Verify OTP
              </button>

              {otpVerified && (
                <button
                  type="button"
                  onClick={payResumeFee}
                  className="primary-button w-full"
                >
                  Pay Rs 50 Resume Fee
                </button>
              )}
            </div>

            <form onSubmit={createResume} className="mt-8 space-y-4">
              <input
                name="name"
                placeholder="Full name"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="qualification"
                placeholder="Qualification"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="experience"
                placeholder="Experience"
                onChange={handleChange}
                className="form-input"
              />
              <textarea
                name="personalInfo"
                placeholder="Personal information"
                onChange={handleChange}
                className="form-textarea min-h-28"
              />
              <input
                name="photo"
                placeholder="Photo URL"
                onChange={handleChange}
                className="form-input"
              />

              <button type="submit" className="primary-button w-full">
                Create Resume
              </button>
            </form>

            {message && (
              <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {message}
              </p>
            )}
          </div>

          <div className="section-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Resume Preview</h2>

            {resume ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                {resume.photo && (
                  <img
                    src={resume.photo}
                    alt="profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                )}
                <h3 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                  {resume.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {resume.qualification}
                </p>

                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900">Experience</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {resume.experience}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900">Personal Info</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {resume.personalInfo}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                Your saved resume preview appears here after creation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
