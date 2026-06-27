import axios from "axios";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  PenSquare,
  Trash2,
  Users,
} from "lucide-react";
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

const sortInternships = (internships: any[]) =>
  [...internships].sort((a, b) => {
    const first = new Date(b.createdAt || b.createAt || 0).getTime();
    const second = new Date(a.createdAt || a.createAt || 0).getTime();

    return first - second;
  });

const index = () => {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(buildBackendApiUrl("internship"));
        setInternships(sortInternships(Array.isArray(res.data) ? res.data : []));
      } catch (error) {
        console.log(error);
        toast.error("Unable to load internships");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const handleDelete = async (internshipId: string) => {
    const shouldDelete = window.confirm(
      "Delete this internship? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(internshipId);
      await axios.delete(buildBackendApiUrl(`internship/${internshipId}`));
      setInternships((prev) =>
        prev.filter((internship) => internship._id !== internshipId)
      );
      toast.success("Internship deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("error deleting internship");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Internships
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review, edit, or delete the internships posted from the admin panel.
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
            <Link href="/postInternship" className="primary-button text-sm">
              Post Internship
            </Link>
          </div>
        </div>

        <div className="section-card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Posted Internships
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {internships.length} internship
                  {internships.length === 1 ? "" : "s"} available
                </p>
              </div>
              <div className="hidden rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 sm:block">
                Admin Listings
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading internships...
            </div>
          ) : internships.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Briefcase className="h-7 w-7 text-slate-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No internships posted yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Post an internship from the admin dashboard to manage it here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 p-4 md:hidden">
                {internships.map((internship) => (
                  <div
                    key={internship._id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {internship.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {internship.company}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {internship.category || "-"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {internship.location || "-"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {internship.stipend || "-"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        {internship.numberOfOpening || "-"} openings
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formatDate(internship.startDate)}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        className="secondary-button flex-1 text-sm"
                        onClick={() =>
                          router.push(`/postInternship?id=${internship._id}`)
                        }
                      >
                        <PenSquare className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="secondary-button flex-1 text-sm text-red-600"
                        onClick={() => handleDelete(internship._id)}
                        disabled={deletingId === internship._id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === internship._id ? "Deleting..." : "Delete"}
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
                        Stipend
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Openings
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
                    {internships.map((internship) => (
                      <tr key={internship._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {internship.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {internship.company}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {internship.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {internship.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {internship.stipend}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {internship.numberOfOpening}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(internship.startDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              className="secondary-button px-4 py-2 text-sm"
                              onClick={() =>
                                router.push(
                                  `/postInternship?id=${internship._id}`
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="secondary-button px-4 py-2 text-sm text-red-600"
                              onClick={() => handleDelete(internship._id)}
                              disabled={deletingId === internship._id}
                            >
                              {deletingId === internship._id
                                ? "Deleting..."
                                : "Delete"}
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
