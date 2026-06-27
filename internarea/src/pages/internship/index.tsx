import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Pin,
  PlayCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buildBackendApiUrl } from "@/lib/backendApi";

const index = () => {
  const [filteredInternships, setfilteredInternships] = useState<any[]>([]);
  const [isFiltervisible, setisFiltervisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setfilters] = useState({
    category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    stipend: 50,
  });
  const [allInternships, setInternship] = useState<any[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await axios.get(buildBackendApiUrl("internship"), {
          params: {
            _: Date.now(),
          },
        });
        const apiInternships = Array.isArray(res.data) ? res.data : [];
        setInternship(apiInternships);
        setfilteredInternships(apiInternships);
      } catch (error) {
        console.log(error);
        setInternship([]);
        setfilteredInternships([]);
        setErrorMessage(
          "Unable to load internships right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const filtered = allInternships.filter((internship: any) => {
      const matchesCategory = (internship.category || "")
        .toLowerCase()
        .includes(filter.category.toLowerCase());
      const matchesLocation = (internship.location || "")
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      return matchesCategory && matchesLocation;
    });

    setfilteredInternships(filtered);
  }, [filter, allInternships]);

  const handlefilterchange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setfilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setfilters({
      category: "",
      location: "",
      workFromHome: false,
      partTime: false,
      stipend: 50,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-5 lg:px-12 2xl:px-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="hidden h-fit rounded-lg bg-white p-6 shadow-sm md:block md:w-72 lg:w-64">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Marketing Intern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="workFromHome"
                    checked={filter.workFromHome}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded "
                  />
                  <span className="text-gray-700">Work from home</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="partTime"
                    checked={filter.partTime}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">Part-time</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Stipend (Rs)
                </label>
                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.stipend}
                  onChange={handlefilterchange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rs0</span>
                  <span>Rs50K</span>
                  <span>Rs100K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 md:hidden">
              <button
                onClick={() => setisFiltervisible(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white p-3 text-black shadow-sm"
              >
                <Filter className="h-5 w-5" />
                <span>Show Filters</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-center font-medium text-black">
                {filteredInternships.length} Internships found
              </p>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
                Loading internships...
              </div>
            ) : errorMessage ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-600">
                {errorMessage}
              </div>
            ) : filteredInternships.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
                No internships available at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInternships.map((internship: any) => (
                  <div
                    key={internship._id}
                    className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                  >
                    <div className="mb-4 flex items-center gap-2 text-blue-600">
                      <ArrowUpRight className="h-5 w-5" />
                      <span className="font-medium">Actively Hiring</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {internship.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{internship.company}</p>

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <PlayCircle className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm">{internship.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Pin className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm">{internship.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Stipend</p>
                          <p className="text-sm">{internship.stipend}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          Internship
                        </span>
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Posted recently</span>
                        </div>
                      </div>
                      <Link
                        href={`/detailiternship/${internship._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isFiltervisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setisFiltervisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Marketing Intern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="workFromHome"
                    checked={filter.workFromHome}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded "
                  />
                  <span className="text-gray-700">Work from home</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="partTime"
                    checked={filter.partTime}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">Part-time</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Stipend (Rs)
                </label>
                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.stipend}
                  onChange={handlefilterchange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rs0</span>
                  <span>Rs50K</span>
                  <span>Rs100K</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    setisFiltervisible(false);
                  }}
                  className="secondary-button w-full text-sm"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setisFiltervisible(false)}
                  className="primary-button w-full text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
