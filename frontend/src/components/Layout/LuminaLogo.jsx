import React from "react";
import { Link } from "react-router-dom";

const LuminaLogo = ({ light = false, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* High Visibility Vivid Emblem */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-2 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
        {/* SVG Vector: High Contrast Orbit & Spark */}
        <svg
          className="w-full h-full text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Orbit Ring */}
          <ellipse
            cx="12"
            cy="12"
            rx="8.5"
            ry="4"
            transform="rotate(-30 12 12)"
            stroke="#ffffff"
            strokeWidth="2.2"
          />

          {/* Cross Orbit Ring */}
          <ellipse
            cx="12"
            cy="12"
            rx="8.5"
            ry="4"
            transform="rotate(30 12 12)"
            stroke="#67e8f9"
            strokeWidth="2"
          />

          {/* Glowing Center Core */}
          <circle cx="12" cy="12" r="2.5" fill="#ffffff" stroke="#a855f7" strokeWidth="1" />
        </svg>

        {/* Live Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-cyan-400 to-indigo-600 border border-white"></span>
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black text-2xl tracking-tight leading-none ${
              light
                ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                : "text-slate-900 drop-shadow-xs"
            }`}
          >
            NEXUS
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] font-black tracking-widest uppercase shadow-md shadow-indigo-500/20">
            STORE
          </span>
        </div>
        <span
          className={`text-[9.5px] tracking-[0.22em] uppercase font-extrabold mt-0.5 ${
            light ? "text-cyan-300" : "text-indigo-600"
          }`}
        >
          Next-Gen Market
        </span>
      </div>
    </Link>
  );
};

export default LuminaLogo;
