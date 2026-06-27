import axios from "axios";
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Info,
  MapPin,
  Tags,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { buildBackendApiUrl } from "@/lib/backendApi";

const initialFormData = {
  title: "",
  company: "",
  location: "",
  category: "",
  aboutCompany: "",
  aboutJob: "",
  whoCanApply: "",
  perks: "",
  numberOfOpening: "",
  CTC: "",
  startDate: "",
  AdditionalInfo: "",
};

const getJobId = (jobId: string | string[] | undefined) =>
  Array.isArray(jobId) ? jobId[0] : jobId || "";

const index = () => {
  const router = useRouter();
  const jobId = getJobId(router.query.id);
  const isEditMode = Boolean(jobId);

  const [formData, setFormData] = useState(initialFormData);
  const [isloading, setisloading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(false);

  useEffect(() => {
    if (!router.isReady || !jobId) {
      return;
    }

    const fetchJob = async () => {
      try {
        setIsFetchingJob(true);
        const res = await axios.get(buildBackendApiUrl(`job/${jobId}`));
        const job = res.data;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          category: job.category || "",
          aboutCompany: job.aboutCompany || "",
          aboutJob: job.aboutJob || "",
          whoCanApply: job.whoCanApply || "",
          perks: job.perks || "",
          numberOfOpening: job.numberOfOpening || "",
          CTC: job.CTC || "",
          startDate: job.startDate || job.StartDate || "",
          AdditionalInfo: job.AdditionalInfo || job.additionalInfo || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Unable to load job details");
        router.push("/manageJobs");
      } finally {
        setIsFetchingJob(false);
      }
    };

    fetchJob();
  }, [jobId, router, router.isReady]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasemptyfields = Object.values(formData).some((val) => !val.trim());

    if (hasemptyfields) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      setisloading(true);
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        category: formData.category,
        aboutCompany: formData.aboutCompany,
        aboutJob: formData.aboutJob,
        whoCanApply: formData.whoCanApply,
        perks: formData.perks,
        AdditionalInfo: formData.AdditionalInfo,
        additionalInfo: formData.AdditionalInfo,
        CTC: formData.CTC,
        StartDate: formData.startDate,
        startDate: formData.startDate,
        numberOfOpening: formData.numberOfOpening,
        openings: formData.numberOfOpening,
        Experience: "",
      };

      if (isEditMode) {
        await axios.put(buildBackendApiUrl(`job/${jobId}`), payload);
        toast.success("Job updated successfully");
        router.push("/manageJobs");
      } else {
        await axios.post(buildBackendApiUrl("job"), payload);
        toast.success("Job posted successfully");
        router.push("/adminpanel");
      }
    } catch (error) {
      console.log(error);
      toast.error(isEditMode ? "error updating job" : "error posting job");
    } finally {
      setisloading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-4xl">
        <div className="section-card p-6 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditMode ? "Edit Job" : "Post New Job"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {isEditMode
                  ? "Update the job details and save the same listing."
                  : "Create a new job opportunity for the admin dashboard."}
              </p>
            </div>
            <button
              type="button"
              className="secondary-button text-sm"
              onClick={() =>
                router.push(isEditMode ? "/manageJobs" : "/adminpanel")
              }
            >
              Back
            </button>
          </div>

          {isFetchingJob ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              Loading job details...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handlesubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <span className="mb-1 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Title*
                      </span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <span className="mb-1 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Name*
                      </span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Tech Solutions Inc"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <span className="mb-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location*
                      </span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Mumbai, India"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      <span className="mb-1 flex items-center gap-2">
                        <Tags className="h-4 w-4" />
                        Category*
                      </span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Software Development"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      About Company*
                    </span>
                  </label>
                  <textarea
                    name="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Describe your company..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      About Job*
                    </span>
                  </label>
                  <textarea
                    name="aboutJob"
                    value={formData.aboutJob}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Describe the job role..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Who Can Apply*
                    </span>
                  </label>
                  <textarea
                    name="whoCanApply"
                    value={formData.whoCanApply}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="Eligibility criteria..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Perks*
                    </span>
                  </label>
                  <textarea
                    name="perks"
                    value={formData.perks}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="List the perks..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Openings*
                    </span>
                  </label>
                  <input
                    type="number"
                    name="numberOfOpening"
                    value={formData.numberOfOpening}
                    onChange={handleChange}
                    min="1"
                    className="form-input"
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      CTC*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="CTC"
                    value={formData.CTC}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 10 LPA"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date*
                    </span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <span className="mb-1 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Additional Information*
                    </span>
                  </label>
                  <textarea
                    name="AdditionalInfo"
                    value={formData.AdditionalInfo}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="Any additional details..."
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="secondary-button w-full text-sm sm:w-auto"
                  onClick={() =>
                    router.push(isEditMode ? "/manageJobs" : "/adminpanel")
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isloading}
                  className="primary-button w-full text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isloading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {isEditMode ? "Saving Job..." : "Posting Job..."}
                    </span>
                  ) : isEditMode ? (
                    "Save Job"
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
