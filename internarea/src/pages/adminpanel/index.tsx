import Link from "next/link";
import { Briefcase, ClipboardList, Mail, Send } from "lucide-react";

const menuItems = [
  {
    title: "View Applications",
    description: "Review and manage submitted applications.",
    icon: Mail,
    link: "/applications",
    color: "bg-blue-600",
  },
  {
    title: "Post Job",
    description: "Create and publish a new job opportunity.",
    icon: Briefcase,
    link: "/postJob",
    color: "bg-emerald-600",
  },
  {
    title: "Post Internship",
    description: "Create and publish a new internship opportunity.",
    icon: Send,
    link: "/postInternship",
    color: "bg-indigo-600",
  },
  {
    title: "Manage Jobs",
    description: "View, edit, and delete the jobs posted by admin.",
    icon: ClipboardList,
    link: "/manageJobs",
    color: "bg-amber-600",
  },
  {
    title: "Manage Internships",
    description: "View, edit, and delete the internships posted by admin.",
    icon: ClipboardList,
    link: "/manageInternships",
    color: "bg-cyan-600",
  },
];

export default function AdminPanel() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage the working admin routes in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="section-card p-5 transition hover:-translate-y-0.5 sm:p-6"
            >
              <div className={`inline-flex rounded-2xl p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
