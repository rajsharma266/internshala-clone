import axios from "axios";
import { Briefcase, Building2, Calendar, MapPin, PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { buildBackendApiUrl } from "@/lib/backendApi";

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sortJobs = (jobs: any[]) =>
  [...jobs].sort((a, b) => {
    const first = new Date(b.createAt || b.createdAt || 0).getTime();
    const second = new Date(a.createAt || a.createdAt || 0).getTime();

    return first - second;
  });

const index = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(buildBackendApiUrl("job"));
        setJobs(sortJobs(Array.isArray(res.data) ? res.data : []));
      } catch (error) {
        console.log(error);
        toast.error("Unable to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    const shouldDelete = window.confirm(
      "Delete this job? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(jobId);
      await axios.delete(buildBackendApiUrl(`job/${jobId}`));
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("error deleting job");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Jobs</h1>
            <p className="mt-2 text-sm text-slate-500">
              Review, edit, or delete the jobs posted from the admin panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="secondary-button text-sm"
              onClick={() => router.push("/adminpanel")}
            >
              Back to Dashboard
            </button>
            <Link href="/postJob" className="primary-button text-sm">
              Post Job
            </Link>
          </div>
        </div>

        <div className="section-card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Posted Jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {jobs.length} job{jobs.length === 1 ? "" : "s"} available
                </p>
              </div>
              <div className="hidden rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 sm:block">
                Admin Listings
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Briefcase className="h-7 w-7 text-slate-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No jobs posted yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Post a job from the admin dashboard to manage it here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 p-4 md:hidden">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.company}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {job.category || "-"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {job.location || "-"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {job.CTC || "-"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formatDate(job.startDate || job.StartDate)}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        className="secondary-button flex-1 text-sm"
                        onClick={() => router.push(`/postJob?id=${job._id}`)}
                      >
                        <PenSquare className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="secondary-button flex-1 text-sm text-red-600"
                        onClick={() => handleDelete(job._id)}
                        disabled={deletingId === job._id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === job._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        CTC
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {job.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {job.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {job.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {job.CTC}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(job.startDate || job.StartDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              className="secondary-button px-4 py-2 text-sm"
                              onClick={() =>
                                router.push(`/postJob?id=${job._id}`)
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="secondary-button px-4 py-2 text-sm text-red-600"
                              onClick={() => handleDelete(job._id)}
                              disabled={deletingId === job._id}
                            >
                              {deletingId === job._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
