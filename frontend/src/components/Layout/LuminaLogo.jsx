import React from "react";
import { Link } from "react-router-dom";

const LuminaLogo = ({ light = false, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Emblem: Sleek Modern Hexagon Spark Shield */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/45 group-hover:scale-105 transition-all duration-300">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-cyan-400/20 opacity-80 group-hover:opacity-100 transition-opacity"></div>

          {/* SVG Vector: Hexagon Spark Shield */}
          <svg
            className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Hexagon Shield Frame */}
            <polygon
              points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"
              fill="url(#shieldGrad)"
              fillOpacity="0.25"
              stroke="url(#frameGrad)"
              strokeWidth="2"
            />

            {/* Central Spark Star */}
            <path
              d="M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5L12 7z"
              fill="url(#sparkGrad)"
              stroke="#fbbf24"
              strokeWidth="1"
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="shieldGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="frameGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.5" stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="sparkGrad" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live Status Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-amber-400 to-indigo-600 border border-white"></span>
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
            LUMINA
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
            PRIME
          </span>
        </div>
        <span
          className={`text-[10px] tracking-[0.2em] uppercase font-bold mt-0.5 ${
            light ? "text-amber-300" : "text-amber-600"
          }`}
        >
          Exclusive Market
        </span>
      </div>
    </Link>
  );
};

export default LuminaLogo;
