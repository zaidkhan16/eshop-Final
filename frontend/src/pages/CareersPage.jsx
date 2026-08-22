import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";
import { FiArrowRight, FiSend, FiClock, FiStar } from "react-icons/fi";

const initialJobs = [
  {
    id: 1,
    title: "Senior Full Stack Engineer (React & Node.js)",
    department: "Engineering",
    location: "Remote (US / EU)",
    type: "Full-Time",
    experience: "Senior (5+ yrs)",
    salary: "$140,000 - $185,000 + Equity",
    description: "Lead the development of our high-scale multi-vendor marketplace microservices, live messaging, and order processing engine.",
  },
  {
    id: 2,
    title: "Principal UX/UI Product Designer",
    department: "Product & Design",
    location: "San Francisco, CA / Hybrid",
    type: "Full-Time",
    experience: "Lead / Principal",
    salary: "$150,000 - $190,000 + Equity",
    description: "Shape the next-generation shopping experience across mobile and web interfaces for over 1.2M monthly active users.",
  },
  {
    id: 3,
    title: "Global Seller Ecosystem Operations Manager",
    department: "Operations",
    location: "London, UK / Hybrid",
    type: "Full-Time",
    experience: "Mid-Senior (4+ yrs)",
    salary: "£65,000 - £85,000 + Bonus",
    description: "Scale merchant onboarding programs, store verification protocols, and seller growth workshops across Europe and North America.",
  },
  {
    id: 4,
    title: "Head of Performance Marketing & Growth",
    department: "Marketing & Growth",
    location: "Remote (Global)",
    type: "Full-Time",
    experience: "Director / Lead",
    salary: "$130,000 - $170,000 + Equity",
    description: "Drive multi-channel buyer acquisition campaigns, SEO strategies, and brand partnership initiatives globally.",
  },
  {
    id: 5,
    title: "DevOps & Infrastructure Architect (AWS & K8s)",
    department: "Engineering",
    location: "Remote (US / Canada)",
    type: "Full-Time",
    experience: "Senior (6+ yrs)",
    salary: "$155,000 - $195,000 + Equity",
    description: "Maintain 99.99% system uptime, scale distributed database clusters, and automate security CI/CD pipelines.",
  },
  {
    id: 6,
    title: "Enterprise Brand Partnership Specialist",
    department: "Sales",
    location: "New York, NY / Hybrid",
    type: "Full-Time",
    experience: "Mid-Level (3+ yrs)",
    salary: "$95,000 - $130,000 + Uncapped Commission",
    description: "Partner with global fashion and consumer tech brands to launch official verified storefronts on Nexus.",
  },
];

const CareersPage = () => {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    portfolioUrl: "",
    experience: "3-5 years",
    coverLetter: "",
  });

  const departments = ["All", "Engineering", "Product & Design", "Marketing & Growth", "Operations", "Sales"];

  const filteredJobs = initialJobs.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    toast.success(
      `Application submitted for ${selectedJob.title}! Our talent acquisition team will contact you at ${applyForm.email}.`
    );
    setSelectedJob(null);
    setApplyForm({
      fullName: "",
      email: "",
      portfolioUrl: "",
      experience: "3-5 years",
      coverLetter: "",
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header activeHeading={0} />

      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className={`${styles.section} relative z-10 text-center max-w-4xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6">
            <HiOutlineSparkles className="w-4 h-4 text-purple-400" />
            <span>Join Our Global Team</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Build the Future of <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Digital Commerce</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We are a mission-driven team of engineers, designers, creators, and problem solvers scaling next-generation shopping experiences for millions worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <FiStar className="text-amber-400 w-5 h-5" />
              <span>4.9 / 5 Glassdoor Employee Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineGlobeAlt className="text-purple-400 w-5 h-5" />
              <span>100% Remote-First & Hybrid Options</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineUserGroup className="text-emerald-400 w-5 h-5" />
              <span>Team Members Across 25+ Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* CULTURE & PERKS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className={`${styles.section}`}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Why Work With Us</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Perks & Benefits Designed for Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PerkCard
              icon={<HiOutlineGlobeAlt className="w-6 h-6 text-purple-600" />}
              title="Remote Flexibility"
              desc="Work from anywhere in the world with flexible hours and home-office stipends."
            />
            <PerkCard
              icon={<HiOutlineCurrencyDollar className="w-6 h-6 text-emerald-600" />}
              title="Competitive Pay & Equity"
              desc="Top-market salary packages, stock options, and performance bonuses for every role."
            />
            <PerkCard
              icon={<HiOutlineHeart className="w-6 h-6 text-rose-600" />}
              title="Health & Wellness"
              desc="100% premium health, dental, vision coverage plus gym and mental health subscriptions."
            />
            <PerkCard
              icon={<HiOutlineAcademicCap className="w-6 h-6 text-indigo-600" />}
              title="Learning Budget"
              desc="$2,000 annual stipend for courses, books, tech conferences, and certifications."
            />
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className={`${styles.section} py-16 sm:py-24`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Open Roles</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Explore Opportunities</h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 shadow-xs"
            />
            <HiOutlineSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <HiOutlineBriefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No positions found</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting another department or clearing search keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-lg">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-lg">
                      {job.salary}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{job.description}</p>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="bg-slate-900 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <span>Apply Now</span>
                  <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Application Form</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedJob.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedJob.department} • {selectedJob.location}</p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applyForm.email}
                  onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">LinkedIn / Portfolio URL</label>
                <input
                  type="url"
                  value={applyForm.portfolioUrl}
                  onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username or github.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Cover Letter / Note</label>
                <textarea
                  rows={3}
                  value={applyForm.coverLetter}
                  onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                  placeholder="Tell us briefly why you're excited about this role..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FiSend />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const PerkCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
    <div className="p-3 bg-white rounded-xl w-fit shadow-xs mb-4">{icon}</div>
    <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default CareersPage;
