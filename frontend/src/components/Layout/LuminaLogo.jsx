import React from "react";
import { Link } from "react-router-dom";

const LuminaLogo = ({ light = false, className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Emblem: Modern Dynamic Shopping Bag with Gradient Wings */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden group-hover:bg-opacity-90 transition-all">
          {/* Inner Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-cyan-400/20 opacity-80 group-hover:opacity-100 transition-opacity"></div>

          {/* SVG Vector: Winged Shopping Bag */}
          <svg
            className="w-6 h-6 text-white relative z-10 drop-shadow-[0_2px_8px_rgba(99,102,241,0.6)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Bag Body */}
            <path
              d="M6 9l1.2 11a2 2 0 002 1.8h5.6a2 2 0 002-1.8L18 9H6z"
              fill="url(#bagGradient)"
              fillOpacity="0.3"
            />
            {/* Bag Handles */}
            <path d="M9 9V6a3 3 0 016 0v3" stroke="url(#handleGradient)" strokeWidth="2.2" />
            
            {/* Left Dynamic Wing Accent */}
            <path
              d="M3 11c-1.5-2-1-4.5 1-6 2 2 2.5 4.5 2 6"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            
            {/* Right Dynamic Wing Accent */}
            <path
              d="M21 11c1.5-2 1-4.5-1-6-2 2-2.5 4.5-2 6"
              stroke="#a855f7"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="bagGradient" x1="6" y1="9" x2="18" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="handleGradient" x1="9" y1="3" x2="15" y2="9" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live Sparkle Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-cyan-400 to-indigo-500 border border-white"></span>
        </span>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`font-black text-2xl tracking-tight leading-none ${
              light ? "text-white" : "text-slate-900"
            }`}
          >
            Lumina
          </span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></span>
        </div>
        <span
          className={`text-[10px] tracking-widest uppercase font-black mt-0.5 ${
            light ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          Marketplace
        </span>
      </div>
    </Link>
  );
};

export default LuminaLogo;
