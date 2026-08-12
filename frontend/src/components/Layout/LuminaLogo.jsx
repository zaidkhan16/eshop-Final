import React from "react";
import { Link } from "react-router-dom";

const LuminaLogo = ({ light = false, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span
          className={`font-black text-2xl tracking-tight leading-none ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Lumina<span className="text-indigo-600">.</span>
        </span>
        <span
          className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
            light ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          Market
        </span>
      </div>
    </Link>
  );
};

export default LuminaLogo;
