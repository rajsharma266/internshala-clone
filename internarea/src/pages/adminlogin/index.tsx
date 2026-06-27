import axios from "axios";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { buildBackendApiUrl } from "@/lib/backendApi";
import { saveStoredAdmin } from "@/lib/adminSession";

const index = () => {
  const [formadata, setformadata] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [isloading, setisloading] = useState(false);
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setformadata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formadata.username || !formadata.password) {
      toast.error("Please fill in all details");
      return;
    }
    try {
      setisloading(true);
      const res = await axios.post(buildBackendApiUrl("admin/adminlogin"), formadata);
      if (res.data?.admin) {
        saveStoredAdmin(res.data.admin);
      }
      toast.success("Logged in successfully");
      router.push("/adminpanel");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    } finally {
      setisloading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 md:px-5 lg:px-12 2xl:px-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Login</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Access the admin dashboard to manage internships and applications.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handlesubmit}>
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formadata.username}
                  onChange={handlechange}
                  className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formadata.password}
                  onChange={handlechange}
                  className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isloading}
                className="flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isloading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
