import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import EventCard from "../components/Events/EventCard";
import EventGridCard from "../components/Events/EventGridCard";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  HiFire,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'flash', 'trending', 'endingSoon', 'megaDiscount'
  const [sortBy, setSortBy] = useState("default");
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Extract unique categories from actual events
  const categories = useMemo(() => {
    const list = ["All"];
    if (allEvents && allEvents.length > 0) {
      allEvents.forEach((item) => {
        if (item.category && !list.includes(item.category)) {
          list.push(item.category);
        }
      });
    }
    return list;
  }, [allEvents]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];

    let list = [...allEvents];

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.tags?.toLowerCase().includes(q) ||
          item.shop?.name?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Tab Filters
    if (activeFilter === "trending") {
      list = list.filter((item) => (item.sold_out || 0) > 0).sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));
    } else if (activeFilter === "endingSoon") {
      list = list.sort((a, b) => {
        const dateA = a.Finish_Date ? new Date(a.Finish_Date).getTime() : Infinity;
        const dateB = b.Finish_Date ? new Date(b.Finish_Date).getTime() : Infinity;
        return dateA - dateB;
      });
    } else if (activeFilter === "megaDiscount") {
      list = list.filter((item) => {
        if (!item.originalPrice || !item.discountPrice) return false;
        const disc = ((item.originalPrice - item.discountPrice) / item.originalPrice) * 100;
        return disc >= 30;
      });
    }

    // Explicit Sort dropdown
    if (sortBy === "discountHigh") {
      list.sort((a, b) => {
        const discA = a.originalPrice && a.discountPrice ? (a.originalPrice - a.discountPrice) / a.originalPrice : 0;
        const discB = b.originalPrice && b.discountPrice ? (b.originalPrice - b.discountPrice) / b.originalPrice : 0;
        return discB - discA;
      });
    } else if (sortBy === "priceLow") {
      list.sort((a, b) => (a.discountPrice || a.originalPrice) - (b.discountPrice || b.originalPrice));
    } else if (sortBy === "priceHigh") {
      list.sort((a, b) => (b.discountPrice || b.originalPrice) - (a.discountPrice || a.originalPrice));
    }

    return list;
  }, [allEvents, searchTerm, selectedCategory, activeFilter, sortBy]);

  const spotlightEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;
  const gridEvents = filteredEvents.length > 1 ? filteredEvents.slice(1) : [];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }
    setIsSubscribed(true);
    toast.success("🎉 You're subscribed to VIP Flash Drop alerts!");
    setEmailSub("");
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Header activeHeading={4} />

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          {/* Hero Cyber Header Banner */}
          <section className="relative bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-14 sm:py-20 px-4 overflow-hidden border-b border-indigo-900/30">
            {/* Ambient Background Orbs */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className={`${styles.section} relative z-10 text-center max-w-4xl mx-auto`}>
              {/* Pulsing Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/10 mb-5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span>🔥 Live Timed Drops & Flash Events</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-none">
                Massive Savings. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-rose-400">
                  Exclusive Limited Drops.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
                Discover limited-quantity deals directly from verified merchants. Grab premium tech, lifestyle, and fashion essentials before time runs out.
              </p>

              {/* Live Perk Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8 sm:mt-10">
                <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                  <HiOutlineTag className="w-4 h-4 text-amber-400" />
                  <span>Up to 75% Off</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                  <HiOutlineClock className="w-4 h-4 text-rose-400" />
                  <span>Real-Time Timers</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                  <HiOutlineCheckBadge className="w-4 h-4 text-cyan-400" />
                  <span>Verified Stores</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                  <HiOutlineTruck className="w-4 h-4 text-emerald-400" />
                  <span>Fast Dispatch</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Events Showcase Section */}
          <main className={`${styles.section} py-8 sm:py-12`}>
            {/* Interactive Filters & Search Controls */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 mb-8 space-y-4">
              {/* Search & Sort Row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events, products, or stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Tabs & Sort Dropdown */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeFilter === "all"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All Events
                    </button>
                    <button
                      onClick={() => setActiveFilter("trending")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        activeFilter === "trending"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <HiFire className="w-3.5 h-3.5" />
                      <span>Trending</span>
                    </button>
                    <button
                      onClick={() => setActiveFilter("endingSoon")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        activeFilter === "endingSoon"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      <span>Ending Soon</span>
                    </button>
                    <button
                      onClick={() => setActiveFilter("megaDiscount")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        activeFilter === "megaDiscount"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <HiOutlineSparkles className="w-3.5 h-3.5" />
                      <span>Mega Deals (30%+)</span>
                    </button>
                  </div>

                  {/* Sort Select */}
                  <div className="relative shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                    >
                      <option value="default">Default Sort</option>
                      <option value="discountHigh">Biggest % Discount</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Pills Row (if multiple exist) */}
              {categories.length > 1 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <HiOutlineFunnel className="w-3.5 h-3.5" /> Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Active Flash Drops
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} Found
                </span>
              </div>
            </div>

            {/* Main Spotlight Event Card */}
            {spotlightEvent ? (
              <div className="space-y-10">
                {/* Spotlight Hero Event */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <HiFire className="w-4 h-4 text-rose-500" />
                      Spotlight Flash Deal
                    </span>
                  </div>
                  <EventCard active={true} data={spotlightEvent} />
                </div>

                {/* Additional Events Grid */}
                {gridEvents.length > 0 && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          More Flash Events
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Explore additional limited-time promotional offers
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {gridEvents.map((event, idx) => (
                        <EventGridCard key={event._id || idx} data={event} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto my-6">
                <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl mx-auto mb-4 text-rose-500 shadow-xs">
                  ⚡
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  No Active Events Found
                </h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  {searchTerm || selectedCategory !== "All" || activeFilter !== "all"
                    ? "No event promotions matched your current filters. Try resetting your search or filters."
                    : "There are currently no active flash sales running. Check back soon or browse our full catalogue."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  {(searchTerm || selectedCategory !== "All" || activeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                        setActiveFilter("all");
                        setSortBy("default");
                      }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Reset Filters
                    </button>
                  )}
                  <Link
                    to="/products"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            )}

            {/* VIP Perks & Trust Guarantees */}
            <section className="mt-16 pt-12 border-t border-slate-200/70">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  The Nexus Event Standard
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Why Shop Flash Deals With Us?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <HiOutlineTruck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Priority Dispatch</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Event orders get moved to the front of the fulfillment queue with 24h express dispatch.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <HiOutlineShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">100% Genuine Items</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Direct brand partnership ensures every flash sale product is authenticated with full warranty.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
                    <HiOutlineTag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Price Match Promise</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    We guarantee the lowest promotional pricing during all scheduled flash drop windows.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                    <HiOutlineClock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Instant Order Tracking</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Real-time GPS tracking and instant SMS/Email notifications on every flash drop shipment.
                  </p>
                </div>
              </div>
            </section>

            {/* VIP Notification Box: "Never Miss A Drop" */}
            <section className="mt-12 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-indigo-900/40">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-amber-300">
                  <HiOutlineBell className="w-7 h-7 animate-bounce" />
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                  Never Miss A Flash Sale Drop
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
                  Subscribe to VIP flash alerts to receive early-bird access notifications 15 minutes before high-demand items drop.
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition-all shrink-0"
                  >
                    Get Alerts
                  </button>
                </form>

                {isSubscribed && (
                  <p className="text-emerald-400 text-xs font-bold pt-1">
                    ✓ You're signed up for instant event drop alerts!
                  </p>
                )}
              </div>
            </section>
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventsPage;
