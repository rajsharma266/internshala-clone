import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Mail, User } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { getStoredUser } from "@/lib/userSession";
import { buildBackendApiUrl } from "@/lib/backendApi";

export default function ProfilePage() {
  const reduxUser = useSelector(selectuser);
  const [resume, setResume] = useState<any>(null);
  const [applicationCount, setApplicationCount] = useState(0);

  const user = useMemo(() => {
    const storedUser = getStoredUser();
    return reduxUser || storedUser || null;
  }, [reduxUser]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) {
        return;
      }

      try {
        const [resumeRes, applicationsRes] = await Promise.all([
          fetch(`/api/resume/getResume?userEmail=${user.email}`),
          fetch(buildBackendApiUrl("application")),
        ]);

        const resumeData = await resumeRes.json();
        const applications = await applicationsRes.json();

        setResume(resumeData);
        setApplicationCount(
          Array.isArray(applications)
            ? applications.filter((item: any) => item.user?.email === user.email)
                .length
            : 0
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, [user]);

  return (
    <div className="page-shell">
      <div className="page-container max-w-4xl">
        <div className="section-card overflow-hidden">
          <div className="h-36 bg-blue-600" />

          <div className="px-4 pb-6 sm:px-6 sm:pb-8">
            <div className="-mt-14 flex flex-col items-center text-center">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name || "User"}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-lg">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
              )}

              <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {user?.name || "Guest User"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                <span className="break-all">{user?.email || "No email available"}</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {applicationCount}
                </p>
                <p className="mt-1 text-sm text-blue-700">Applications</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-3xl font-bold text-emerald-700">
                  {resume ? "1" : "0"}
                </p>
                <p className="mt-1 text-sm text-emerald-700">Attached Resume</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-3xl font-bold text-slate-700">
                  {user?.phoneNumber || user?.phone ? "1" : "0"}
                </p>
                <p className="mt-1 text-sm text-slate-700">Contact Added</p>
              </div>
            </div>

            {resume && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Resume Attached
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {resume.name} | {resume.qualification}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/userapplication" className="primary-button">
                View Applications
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/resume" className="secondary-button">
                Manage Resume
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
