import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Book,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { buildBackendApiUrl } from "@/lib/backendApi";

const formatPostedDate = (value: string) => {
  if (!value) {
    return "recently";
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

const index = () => {
  const user = useSelector(selectuser);
  const router = useRouter();
  const { id } = router.query;

  const [jobdata, setjob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const fetchdata = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await axios.get(buildBackendApiUrl(`job/${id}`));
        setjob(res.data);
      } catch (error) {
        console.log(error);
        setjob(null);
        setErrorMessage("Job not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [id, router.isReady]);

  const handlesubmitapplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("please write a cover letter");
      return;
    }

    if (!availability) {
      toast.error("please select your availability");
      return;
    }

    try {
      const applicationdata = {
        category: jobdata.category,
        company: jobdata.company,
        coverLetter,
        user,
        Application: id,
        availability,
      };

      await axios.post(buildBackendApiUrl("application"), applicationdata);
      toast.success("Application submit successfully");
      router.push("/job");
    } catch (error) {
      console.error(error);
      toast.error(
        (error as any)?.response?.data?.error || "Failed to submit application"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorMessage || !jobdata) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">{errorMessage}</h1>
          <p className="mt-3 text-gray-600">
            This job is not available right now.
          </p>
          <Link
            href="/job"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 md:px-5 lg:px-12 2xl:px-16">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="border-b p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-blue-600">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-medium">Actively Hiring</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            {jobdata.title}
          </h1>
          <p className="mb-4 text-base text-gray-600 sm:text-lg">{jobdata.company}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{jobdata.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span>CTC {jobdata.CTC}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Book className="h-5 w-5" />
              <span>{jobdata.category}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm">
              Posted on {formatPostedDate(jobdata.createAt || jobdata.createdAt)}
            </span>
          </div>
        </div>

        <div className="border-b p-5 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            About {jobdata.company}
          </h2>
          <div className="mb-4 flex items-center gap-2">
            <a
              href="#"
              className="flex items-center gap-1 break-all text-blue-600 hover:text-blue-700"
            >
              <span>Visit company website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-600">{jobdata.aboutCompany}</p>
        </div>

        <div className="border-b p-5 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            About the Job
          </h2>
          <p className="text-gray-600 mb-6">{jobdata.aboutJob}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Who can apply
          </h3>
          <p className="text-gray-600 mb-6">{jobdata.whoCanApply}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Perks</h3>
          <p className="text-gray-600 mb-6">{jobdata.perks}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Additional Information
          </h3>
          <p className="text-gray-600 mb-6">{jobdata.AdditionalInfo}</p>
        </div>

        <div className="flex justify-center p-5 sm:p-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-lg bg-blue-600 px-8 py-3 text-white transition duration-150 hover:bg-blue-700 sm:w-auto"
          >
            Apply Now
          </button>
        </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
            <div className="border-b p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Apply to {jobdata.company}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Resume
                </h3>
                <p className="text-gray-600">
                  Your current resume will be submitted with the application
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cover Letter
                </h3>
                <p className="text-gray-600 mb-2">
                  Why should you be selected for this job?
                </p>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Write your cover letter here..."
                ></textarea>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Availability
                </h3>
                <div className="space-y-3">
                  {[
                    "Yes, I am available to join immediately",
                    "No, I am currently on notice period",
                    "No, I will have to serve notice period",
                    "Other",
                  ].map((option) => (
                    <label key={option} className="flex items-start gap-2">
                      <input
                        type="radio"
                        name=""
                        id=""
                        value={option}
                        checked={availability === option}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                {user ? (
                  <button
                    className="w-full rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 sm:w-auto"
                    onClick={handlesubmitapplication}
                  >
                    Submit Application
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full rounded-lg bg-blue-600 px-6 py-2 text-center text-white hover:bg-blue-700 sm:w-auto"
                  >
                    Login to apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
