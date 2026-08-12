import React from "react";
import { Link } from "react-router-dom";

const LuminaLogo = ({ light = false, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Emblem: Futuristic Interlocking Ring Emblem in Cyan & Violet */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/45 group-hover:scale-105 transition-all duration-300">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Ambient Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-violet-500/20 opacity-80 group-hover:opacity-100 transition-opacity"></div>

          {/* SVG Vector: Interlocking Orbit Rings */}
          <svg
            className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Primary Cyan Ring */}
            <ellipse
              cx="12"
              cy="12"
              rx="8"
              ry="3.5"
              transform="rotate(-30 12 12)"
              stroke="url(#cyanGrad)"
              strokeWidth="2.2"
            />

            {/* Secondary Violet Ring */}
            <ellipse
              cx="12"
              cy="12"
              rx="8"
              ry="3.5"
              transform="rotate(30 12 12)"
              stroke="url(#violetGrad)"
              strokeWidth="2.2"
            />

            {/* Center Core Spark */}
            <circle cx="12" cy="12" r="2" fill="url(#coreGrad)" />

            {/* SVG Gradient Definitions */}
            <defs>
              <linearGradient id="cyanGrad" x1="4" y1="8.5" x2="20" y2="15.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="violetGrad" x1="4" y1="15.5" x2="20" y2="8.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="coreGrad" x1="10" y1="10" x2="14" y2="14" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>

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
              light ? "text-white" : "text-slate-900"
            }`}
          >
            NEXUS
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[9px] font-black tracking-widest uppercase shadow-xs">
            STORE
          </span>
        </div>
        <span
          className={`text-[9px] tracking-[0.25em] uppercase font-extrabold mt-0.5 ${
            light ? "text-cyan-300" : "text-cyan-600"
          }`}
        >
          Next-Gen Market
        </span>
      </div>
    </Link>
  );
};

export default LuminaLogo;
