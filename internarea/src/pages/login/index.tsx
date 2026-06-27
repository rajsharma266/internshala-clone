import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, provider } from "@/firebase/firebase";
import { getStoredUser, saveStoredUser } from "@/lib/userSession";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [pendingOtpEmail, setPendingOtpEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.otpRequired) {
        setPendingOtpEmail(form.email);
        setOtpStep(true);
        setMessage("OTP sent to your email. Please verify.");
        return;
      }

      if (res.ok && data.user) {
        saveStoredUser(data.user);
        router.push("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email || "";

      const res = await fetch("/api/auth/googleLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleEmail }),
      });

      const data = await res.json();

      if (data.otpRequired) {
        setPendingOtpEmail(data.email || googleEmail);
        setOtpStep(true);
        setMessage("OTP sent to your email. Please verify.");
        return;
      }

      if (res.ok && data.user) {
        saveStoredUser(data.user);
        toast.success("Logged in successfully");
        router.push("/");
        return;
      }

      setMessage(data.message || "Login failed");
      toast.error(data.message || "Login failed");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/verifyLoginOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingOtpEmail || form.email,
          otp,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && data.user) {
        saveStoredUser(data.user);
        setPendingOtpEmail("");
        router.push("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const existingUser = getStoredUser();

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mx-auto max-w-md section-card p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {otpStep ? "Verify OTP" : "Login"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {otpStep
                ? "Enter the OTP sent to your email address."
                : "Access your InternArea account."}
            </p>
          </div>

          {!otpStep ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleSubmitting || submitting}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path
                    fill="#4285F4"
                    d="M21.805 10.023H12v3.955h5.607c-.242 1.271-.967 2.35-2.059 3.075v2.552h3.333c1.951-1.797 3.074-4.445 3.074-7.605 0-.66-.059-1.294-.15-1.977Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.79 0 5.13-.925 6.84-2.395l-3.333-2.552c-.925.621-2.107.987-3.507.987-2.694 0-4.978-1.82-5.795-4.268H2.764v2.632A9.995 9.995 0 0 0 12 22Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.205 13.772A5.996 5.996 0 0 1 5.88 12c0-.615.11-1.21.325-1.772V7.596H2.764A9.995 9.995 0 0 0 2 12c0 1.611.386 3.134 1.064 4.404l3.141-2.632Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.96c1.518 0 2.88.522 3.951 1.548l2.962-2.962C17.124 2.88 14.785 2 12 2A9.995 9.995 0 0 0 3.064 7.596l3.141 2.632C7.022 7.78 9.306 5.96 12 5.96Z"
                  />
                </svg>
                <span>
                  {googleSubmitting ? "Please wait..." : "Login with Google"}
                </span>
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="primary-button w-full"
              >
                {submitting ? "Please wait..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input"
                  placeholder="Enter OTP"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="primary-button w-full"
              >
                {submitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {message && (
            <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-500">
            <Link href="/forgotpassword" className="font-medium text-blue-600">
              Forgot password?
            </Link>
            {!existingUser && (
              <p>
                New here?{" "}
                <Link href="/register" className="font-medium text-blue-600">
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
