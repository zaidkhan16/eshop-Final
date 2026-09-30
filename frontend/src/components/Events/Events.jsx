import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { HiFire, HiOutlineSparkles, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowRight } from "react-icons/hi2";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const eventsList = allEvents && allEvents.length > 0 ? allEvents : [];
  const currentEvent = eventsList[activeEventIndex] || eventsList[0];

  const handleNext = () => {
    setActiveEventIndex((prev) => (prev + 1) % eventsList.length);
  };

  const handlePrev = () => {
    setActiveEventIndex((prev) => (prev - 1 + eventsList.length) % eventsList.length);
  };

  return (
    <div className="py-10 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {!isLoading && (
        <div className={`${styles.section}`}>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-200 uppercase tracking-wider">
                  <HiFire className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                  <span>Limited-Time Flash Drops</span>
                </span>
                {eventsList.length > 1 && (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {eventsList.length} Active Events
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
                <span>Featured Event Deals</span>
                <HiOutlineSparkles className="w-6 h-6 text-amber-500 hidden sm:inline-block" />
              </h2>
            </div>

            {/* Controls & View All Link */}
            <div className="flex items-center gap-3">
              {eventsList.length > 1 && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1 shadow-xs">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition-colors"
                    title="Previous event"
                  >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-600 px-2">
                    {activeEventIndex + 1} / {eventsList.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition-colors"
                    title="Next event"
                  >
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>Browse All Events</span>
                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Event Content Showcase */}
          <div className="w-full">
            {currentEvent ? (
              <EventCard active={true} data={currentEvent} />
            ) : (
              <div className="w-full p-12 text-center bg-gradient-to-b from-slate-50 to-indigo-50/20 border border-slate-200/80 rounded-3xl text-slate-600 flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 text-2xl shadow-sm">
                  ⚡
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  New Flash Sales Coming Up Soon!
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  We are preparing exciting limited-time discounts from top verified brands. Stay tuned or check out our trending products.
                </p>
                <Link
                  to="/products"
                  className="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Explore All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;