import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { buildBackendApiUrl } from "@/lib/backendApi";

export default function SvgSlider() {
  const categories = [
    "Big Brands",
    "Work From Home",
    "Part-time",
    "MBA",
    "Engineering",
    "Media",
    "Design",
    "Data Science",
  ];

  const slides = [
    {
      pattern: "pattern-1",
      title: "Start Your Career Journey",
      bgColor: "bg-indigo-600",
    },
    {
      pattern: "pattern-2",
      title: "Learn From The Best",
      bgColor: "bg-blue-600",
    },
    {
      pattern: "pattern-3",
      title: "Grow Your Skills",
      bgColor: "bg-purple-600",
    },
    {
      pattern: "pattern-4",
      title: "Connect With Top Companies",
      bgColor: "bg-teal-600",
    },
  ];

  const stats = [
    { number: "300K+", label: "companies hiring" },
    { number: "10K+", label: "new openings everyday" },
    { number: "21Mn+", label: "active students" },
    { number: "600K+", label: "learners" },
  ];

  const [internships, setInternship] = useState<any[]>([]);
  const [jobs, setJob] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [internshipsLoading, setInternshipsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      setInternshipsLoading(true);
      setJobsLoading(true);

      try {
        const [internshipres, jobres] = await Promise.all([
          axios.get(buildBackendApiUrl("internship")),
          axios.get(buildBackendApiUrl("job")),
        ]);

        setInternship(Array.isArray(internshipres.data) ? internshipres.data : []);
        setJob(Array.isArray(jobres.data) ? jobres.data : []);
      } catch (error) {
        console.log(error);
        setInternship([]);
        setJob([]);
      } finally {
        setInternshipsLoading(false);
        setJobsLoading(false);
      }
    };

    fetchdata();
  }, []);

  const filteredInternships = internships.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );

  const filteredJobs = jobs.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-5 lg:px-12 2xl:px-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Make your dream career a reality
        </h1>
        <p className="text-lg text-gray-600 sm:text-xl">Trending on InternArea</p>
      </div>

      <div className="mb-16">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`relative h-[260px] sm:h-[320px] lg:h-[400px] ${slide.bgColor}`}>
                <div className="absolute inset-0 opacity-20">
                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <pattern
                      id={slide.pattern}
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="20" cy="20" r="4" fill="white" />
                    </pattern>

                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#${slide.pattern})`}
                    />
                  </svg>
                </div>

                <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest internships on Intern Area
        </h2>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <span className="w-full text-sm font-medium text-gray-700 sm:w-auto sm:text-base">
            POPULAR CATEGORIES:
          </span>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? "" : category
                )
              }
              className={`rounded-full px-4 py-2 text-sm transition-colors sm:text-base ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {internshipsLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 mb-16">
          Loading internships...
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 mb-16">
          No internships available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredInternships.map((internship: any) => (
            <div
              key={internship._id}
              className="flex h-full flex-col rounded-lg bg-white p-5 shadow-md transition-transform hover:scale-105 sm:p-6"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <ArrowUpRight size={20} />
                <span className="font-medium">Actively Hiring</span>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {internship.title}
              </h3>

              <p className="text-gray-500 mb-4">{internship.company}</p>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{internship.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Banknote size={18} />
                  <span>{internship.stipend}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{internship.startDate}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Internship
                </span>

                <Link
                  href={`/detailiternship/${internship._id}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View details
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h2>

        {jobsLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 mb-16">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 mb-16">
            No jobs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredJobs.map((job: any) => (
              <div
                key={job._id}
                className="flex h-full flex-col rounded-lg bg-white p-5 shadow-md transition-transform hover:scale-105 sm:p-6"
              >
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <ArrowUpRight size={20} />
                  <span className="font-medium">Actively Hiring</span>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {job.title}
                </h3>

                <p className="text-gray-500 mb-4">{job.company}</p>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Banknote size={18} />
                    <span>{job.CTC}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{job.Experience}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Jobs
                  </span>

                  <Link
                    href={`/detailjob/${job._id}`}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-16 rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600 sm:text-4xl">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

