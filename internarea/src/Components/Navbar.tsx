import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../firebase/firebase";
import { Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import {
  clearStoredAdmin,
  getStoredAdmin,
} from "@/lib/adminSession";
import {
  clearStoredUser,
  getStoredUser,
  toAppUser,
} from "@/lib/userSession";

const navLinks = [
  { href: "/internship", label: "Internships" },
  { href: "/job", label: "Jobs" },
  { href: "/publicspace", label: "Public Space" },
  { href: "/subscription", label: "Subscription" },
  { href: "/resume", label: "Resume Builder" },
];

const Navbar = () => {
  const user = useSelector(selectuser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedAdmin = getStoredAdmin();

    if (storedUser) {
      setLocalUser(toAppUser(storedUser));
    }

    if (storedAdmin) {
      setAdminUser(storedAdmin);
    }
  }, []);

  const currentUser = user || localUser;
  const isAdminLoggedIn = Boolean(adminUser);
  const isUserLoggedIn = Boolean(currentUser) && !isAdminLoggedIn;

  const handleUserLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    } finally {
      clearStoredUser();
      setLocalUser(null);
      window.location.href = "/";
    }
  };

  const handleAdminLogout = () => {
    clearStoredAdmin();
    setAdminUser(null);
    window.location.href = "/adminlogin";
  };

  const displayedLinks = isAdminLoggedIn
    ? [{ href: "/adminpanel", label: "Dashboard" }]
    : navLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-5 lg:px-12 2xl:px-16">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="InternArea" className="h-10 w-auto sm:h-11" />
          </Link>

          <div className="hidden items-center gap-5 lg:gap-6 md:flex">
            {displayedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAdminLoggedIn ? (
            <>
              <div className="max-w-[220px] rounded-xl border border-slate-200 px-4 py-2">
                <p className="truncate text-sm font-semibold text-slate-800">
                  Welcome, {adminUser.username}
                </p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <button
                className="secondary-button px-4 py-2 text-sm"
                onClick={handleAdminLogout}
              >
                Logout
              </button>
            </>
          ) : isUserLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex min-w-0 max-w-[260px] items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {currentUser.photo ? (
                    <img
                      src={currentUser.photo}
                      alt={currentUser.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {currentUser.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </Link>
              <button
                className="secondary-button px-4 py-2 text-sm"
                onClick={handleUserLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="secondary-button px-4 py-2 text-sm">
                Login
              </Link>
              <Link href="/register" className="primary-button px-4 py-2 text-sm">
                Register
              </Link>
              <Link
                href="/adminlogin"
                className="secondary-button px-4 py-2 text-sm"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 md:px-5">
            {displayedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAdminLoggedIn ? (
              <>
                <div className="rounded-xl border border-slate-200 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Welcome, {adminUser.username}
                  </p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <button
                  className="secondary-button w-full text-sm"
                  onClick={handleAdminLogout}
                >
                  Logout
                </button>
              </>
            ) : isUserLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="secondary-button w-full text-sm"
                  onClick={handleUserLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="secondary-button w-full text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="primary-button w-full text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/adminlogin"
                  className="secondary-button w-full text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
