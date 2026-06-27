import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const footerGroups = [
  {
    title: "Opportunities",
    items: [
      { label: "Internships", href: "/internship" },
      { label: "Jobs", href: "/job" },
      { label: "Public Space", href: "/publicspace" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Forgot Password", href: "/forgotpassword" },
    ],
  },
  {
    title: "Student Tools",
    items: [
      { label: "Subscription", href: "/subscription" },
      { label: "Resume Builder", href: "/resume" },
      { label: "Language", href: "/language" },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "Friends", href: "/friends" },
      { label: "Login History", href: "/loginhistory" },
      { label: "Profile", href: "/profile" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-5 lg:px-12 2xl:px-16">
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <img src="/logo.png" alt="InternArea" className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              InternArea helps students manage internships, jobs, subscriptions,
              public posts, and resume workflows in one clean workspace.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-slate-900">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-slate-500 transition hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Copyright 2026 InternArea. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
            <Instagram className="h-5 w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
