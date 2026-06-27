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
  aboutInternship: "",
  whoCanApply: "",
  perks: "",
  numberOfOpening: "",
  stipend: "",
  startDate: "",
  additionalInfo: "",
};

const getInternshipId = (internshipId: string | string[] | undefined) =>
  Array.isArray(internshipId) ? internshipId[0] : internshipId || "";

const index = () => {
  const router = useRouter();
  const internshipId = getInternshipId(router.query.id);
  const isEditMode = Boolean(internshipId);

  const [formData, setFormData] = useState(initialFormData);
  const [isloading, setisloading] = useState(false);
  const [isFetchingInternship, setIsFetchingInternship] = useState(false);

  useEffect(() => {
    if (!router.isReady || !internshipId) {
      return;
    }

    const fetchInternship = async () => {
      try {
        setIsFetchingInternship(true);
        const res = await axios.get(
          buildBackendApiUrl(`internship/${internshipId}`)
        );
        const internship = res.data;

        setFormData({
          title: internship.title || "",
          company: internship.company || "",
          location: internship.location || "",
          category: internship.category || "",
          aboutCompany: internship.aboutCompany || "",
          aboutInternship: internship.aboutInternship || "",
          whoCanApply: internship.whoCanApply || "",
          perks: internship.perks || "",
          numberOfOpening: internship.numberOfOpening || "",
          stipend: internship.stipend || "",
          startDate: internship.startDate || "",
          additionalInfo: internship.additionalInfo || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Unable to load internship details");
        router.push("/manageInternships");
      } finally {
        setIsFetchingInternship(false);
      }
    };

    fetchInternship();
  }, [internshipId, router, router.isReady]);

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
      if (isEditMode) {
        await axios.put(
          buildBackendApiUrl(`internship/${internshipId}`),
          formData
        );
        toast.success("Internship updated successfully");
        router.push("/manageInternships");
      } else {
        await axios.post(buildBackendApiUrl("internship"), formData);
        toast.success("Internship posted successfully");
        router.push("/adminpanel");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        isEditMode ? "error updating internship" : "error posting internship"
      );
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
                {isEditMode ? "Edit Internship" : "Post New Internship"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {isEditMode
                  ? "Update the internship details and save the same listing."
                  : "Create a new internship opportunity for students."}
              </p>
            </div>
            <button
              type="button"
              className="secondary-button text-sm"
              onClick={() =>
                router.push(isEditMode ? "/manageInternships" : "/adminpanel")
              }
            >
              Back
            </button>
          </div>

          {isFetchingInternship ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              Loading internship details...
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
                      placeholder="e.g. Frontend Developer Intern"
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
                      About Internship*
                    </span>
                  </label>
                  <textarea
                    name="aboutInternship"
                    value={formData.aboutInternship}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Describe the internship role..."
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
                      Stipend*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 15,000/month"
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
                    name="additionalInfo"
                    value={formData.additionalInfo}
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
                    router.push(
                      isEditMode ? "/manageInternships" : "/adminpanel"
                    )
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
                      {isEditMode
                        ? "Saving Internship..."
                        : "Posting Internship..."}
                    </span>
                  ) : isEditMode ? (
                    "Save Internship"
                  ) : (
                    "Post Internship"
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
