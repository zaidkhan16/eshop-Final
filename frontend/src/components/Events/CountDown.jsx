import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { server } from "../../server";
import { HiFire } from "react-icons/hi";

const CountDown = ({ data, size = "default", showPulse = true }) => {
  const calculateTimeLeft = useMemo(() => {
    return () => {
      // Default to 48 hours from now if no finish date is present
      const finishDate = data?.Finish_Date ? new Date(data.Finish_Date).getTime() : Date.now() + 172800000;
      const difference = finishDate - Date.now();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };
  }, [data?.Finish_Date]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (
        typeof remaining.days === "undefined" &&
        typeof remaining.hours === "undefined" &&
        typeof remaining.minutes === "undefined" &&
        typeof remaining.seconds === "undefined"
      ) {
        if (data?._id && !data._id.startsWith("mock-")) {
          axios.delete(`${server}/event/delete-shop-event/${data._id}`).catch(() => {});
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, data?._id]);

  const units = [
    { key: "days", label: "Days", shortLabel: "d" },
    { key: "hours", label: "Hours", shortLabel: "h" },
    { key: "minutes", label: "Mins", shortLabel: "m" },
    { key: "seconds", label: "Secs", shortLabel: "s" },
  ];

  const hasTime = units.some((u) => typeof timeLeft[u.key] !== "undefined");

  if (!hasTime) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50/90 border border-rose-200 text-rose-600 rounded-xl font-bold text-xs">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span>Offer Concluded</span>
      </div>
    );
  }

  // Compact Pill Design for grids or tight cards
  if (size === "compact") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl event-cyber-timer-compact text-white text-xs font-mono font-bold shadow-md">
        {showPulse && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-0.5 shrink-0" />}
        <span className="text-amber-300">{String(timeLeft.days ?? 0).padStart(2, "0")}d</span>
        <span className="text-slate-400">:</span>
        <span className="text-indigo-200">{String(timeLeft.hours ?? 0).padStart(2, "0")}h</span>
        <span className="text-slate-400">:</span>
        <span className="text-indigo-200">{String(timeLeft.minutes ?? 0).padStart(2, "0")}m</span>
        <span className="text-slate-400">:</span>
        <span className="text-rose-400 animate-pulse">{String(timeLeft.seconds ?? 0).padStart(2, "0")}s</span>
      </div>
    );
  }

  // Hero / Spotlight Large Presentation
  if (size === "hero") {
    return (
      <div className="my-4">
        {showPulse && (
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 flex items-center gap-1">
              <HiFire className="text-rose-500 w-4 h-4" /> Limited Time Flash Sale Ends In:
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
          {units.map((unit) => (
            <div
              key={unit.key}
              className="flex flex-col items-center justify-center event-cyber-timer text-white rounded-2xl p-2.5 sm:p-3.5 shadow-xl border border-indigo-500/20 group hover:border-indigo-400/40 transition-colors"
            >
              <span className={`text-xl sm:text-3xl font-black font-mono tracking-tight ${unit.key === 'seconds' ? 'text-rose-400 animate-pulse' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-white'}`}>
                {String(timeLeft[unit.key] ?? 0).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-300/80 font-bold mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default Standard presentation
  return (
    <div className="my-3">
      {showPulse && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
            Ends In
          </span>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 max-w-xs">
        {units.map((unit) => (
          <div
            key={unit.key}
            className="flex flex-col items-center bg-slate-900 text-white rounded-xl p-2 shadow-md border border-slate-800"
          >
            <span className={`text-base sm:text-lg font-black font-mono tracking-wider ${unit.key === "seconds" ? "text-rose-400" : "text-indigo-300"}`}>
              {String(timeLeft[unit.key] ?? 0).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountDown;
