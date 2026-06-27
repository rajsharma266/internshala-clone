import { useState } from "react";

export default function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await res.json();
      setMessage(data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mx-auto max-w-md section-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Reset is available once per day. The new password is sent to the
            registered email.
          </p>

          <form onSubmit={handleReset} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email or Phone
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="form-input"
                placeholder="Enter registered email or phone"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="primary-button w-full"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
